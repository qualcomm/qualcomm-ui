import {readFile, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {
  type Browser,
  type BrowserContext,
  chromium,
  type Page,
} from "playwright"

import type {PageMap} from "@qualcomm-ui/mdx-common"

const __dirname = dirname(fileURLToPath(import.meta.url))

interface CrawlOptions {
  baseUrl: string
  concurrency?: number
  maxDepth?: number
  maxPages?: number
  pageTimeout?: number
  sameDomainOnly?: boolean
  targetDataAttribute: string
}

interface FoundElement {
  demoId: string
  innerHtml: string
  url: string
}

class WebCrawler {
  private browser: Browser | null = null
  private contexts: BrowserContext[] = []
  private visitedUrls = new Set<string>()
  private foundElements: FoundElement[] = []
  private readonly options: Required<CrawlOptions>
  private ignoredUrls = /.*\/changelogs.*/
  private urlQueue: string[] = []

  constructor(options: CrawlOptions) {
    this.options = {
      concurrency: 8,
      maxDepth: 5,
      maxPages: 5000,
      pageTimeout: 20000,
      sameDomainOnly: true,
      ...options,
    }
  }

  async initialize(): Promise<void> {
    const siteData: PageMap = JSON.parse(
      await readFile(resolve(__dirname, "./temp/site-data.json"), "utf-8"),
    )

    this.urlQueue = Object.keys(siteData).map((url) =>
      new URL(url, this.options.baseUrl).toString(),
    )

    this.browser = await chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      headless: true,
    })

    // Create multiple browser contexts
    for (let i = 0; i < this.options.concurrency; i++) {
      const context = await this.browser.newContext({
        ignoreHTTPSErrors: true,
      })
      this.contexts.push(context)
    }
  }

  async crawl(): Promise<FoundElement[]> {
    if (!this.browser || this.contexts.length === 0) {
      throw new Error("Browser not initialized. Call initialize() first.")
    }

    try {
      await this.crawlUrls()
      return this.foundElements
    } finally {
      await this.cleanup()
    }
  }

  private async crawlUrls(): Promise<void> {
    const activeTasks = new Set<Promise<void>>()

    while (this.urlQueue.length > 0 || activeTasks.size > 0) {
      // Start new tasks up to concurrency limit
      while (
        this.urlQueue.length > 0 &&
        activeTasks.size < this.options.concurrency &&
        this.visitedUrls.size < this.options.maxPages
      ) {
        const url = this.urlQueue.shift()!

        if (this.ignoredUrls.test(url)) {
          continue
        }

        const contextIndex = activeTasks.size % this.contexts.length
        const task = this.crawlSingleUrl(url, contextIndex).finally(() => {
          activeTasks.delete(task)
        })

        activeTasks.add(task)
      }

      if (activeTasks.size > 0) {
        await Promise.race(activeTasks)
      }
    }
  }

  private async crawlSingleUrl(
    url: string,
    contextIndex: number,
  ): Promise<void> {
    console.log(`[${contextIndex}] Crawling: ${url}`)

    const context = this.contexts[contextIndex]
    const page = await context.newPage()

    try {
      await page.goto(url, {
        timeout: this.options.pageTimeout,
        waitUntil: "networkidle",
      })

      await this.searchForDataAttribute(page, url)
    } catch (error: any) {
      console.error(`[${contextIndex}] Error crawling ${url}:`, error.message)
    } finally {
      await page.close().catch(() => {})
    }
  }

  private async searchForDataAttribute(page: Page, url: string): Promise<void> {
    const {targetDataAttribute} = this.options
    const selector = `[${targetDataAttribute}]`

    try {
      await page.locator(selector).first().waitFor({
        state: "attached",
        timeout: 10000,
      })

      const elements = await page.locator(selector).all()
      console.log(
        `[${url}] Found ${elements.length} elements with ${targetDataAttribute}`,
      )

      const elementPromises = elements.map(async (element, index) => {
        try {
          const demoId = await element.getAttribute(targetDataAttribute)
          if (!demoId) {
            console.warn(`[${url}] Element ${index}: No demoId found`)
            return null
          }

          const codeDemo = element.locator("angular-demo[data-demo-rendered]")

          try {
            await codeDemo.waitFor({
              state: "attached",
              timeout: 10000,
            })
          } catch (waitError) {
            console.warn(
              `[${url}] Element ${demoId}: angular-demo not found, trying without attribute`,
            )
            const codeDemoFallback = element.locator("angular-demo")
            await codeDemoFallback.waitFor({
              state: "attached",
              timeout: 10000,
            })
          }

          const firstChild = codeDemo.locator("> :first-child")
          await firstChild.waitFor({
            state: "attached",
            timeout: 2500,
          })

          await page.waitForFunction(
            (el) => {
              const innerHTML = el?.innerHTML
              return innerHTML && innerHTML.trim().length > 0
            },
            await firstChild.elementHandle(),
            {timeout: 1500},
          )

          const demoHtml = await firstChild.innerHTML()

          if (!demoHtml || demoHtml.trim().length === 0) {
            console.warn(`[${url}] Element ${demoId}: Empty HTML content`)
            return null
          }

          console.log(`[${url}] Successfully processed ${demoId}`)
          return {
            demoId,
            innerHtml: demoHtml,
            url,
          }
        } catch (error: any) {
          console.warn(`[${url}] Error processing element: ${error.message}`)
          return null
        }
      })

      const results = await Promise.all(elementPromises)
      const validResults = results.filter(
        (result): result is FoundElement => result !== null,
      )

      if (validResults.length > 0) {
        this.foundElements.push(...validResults)
        console.log(
          `[${url}] Added ${validResults.length}/${elements.length} elements to results`,
        )
      } else {
        console.log(
          `[${url}] No valid elements found out of ${elements.length} candidates`,
        )
      }
    } catch (error: any) {
      if (error.message.includes("Timeout")) {
        console.log(`[${url}] No elements with ${targetDataAttribute} found`)
      } else {
        console.error(
          `[${url}] Error searching for data attribute:`,
          error.message,
        )
      }
    }
  }

  private async cleanup(): Promise<void> {
    await Promise.all(
      this.contexts.map((context) => context.close().catch(() => {})),
    )

    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  getSummary(): {
    totalElementsFound: number
    totalPagesVisited: number
    uniqueUrls: string[]
  } {
    return {
      totalElementsFound: this.foundElements.length,
      totalPagesVisited: this.visitedUrls.size,
      uniqueUrls: [...new Set(this.foundElements.map((el) => el.url))],
    }
  }
}

async function crawlForDataAttribute(): Promise<void> {
  const crawler = new WebCrawler({
    baseUrl: "http://localhost:3000",
    concurrency: 6,
    maxDepth: 2,
    maxPages: 50,
    pageTimeout: 25000,
    sameDomainOnly: true,
    targetDataAttribute: "data-demo-id",
  })

  try {
    await crawler.initialize()
    console.log("Starting crawl...")

    const startTime = Date.now()
    const results = await crawler.crawl()
    const endTime = Date.now()

    const summary = crawler.getSummary()
    console.log("\n=== CRAWL COMPLETE ===")
    console.log(`Time taken: ${(endTime - startTime) / 1000}s`)
    console.log(`Pages visited: ${summary.totalPagesVisited}`)
    console.log(`Demo Elements found: ${summary.totalElementsFound}`)

    if (summary.totalPagesVisited > 0) {
      console.log(
        `Speed: ${(summary.totalPagesVisited / ((endTime - startTime) / 1000)).toFixed(1)} pages/sec`,
      )
    }

    console.log("\nFound elements:")

    if (results.length > 0) {
      await writeFile(
        resolve(
          __dirname,
          "../angular-demo-module/generated/demo-elements.json",
        ),
        JSON.stringify(
          results.reduce((acc: Record<string, string>, current) => {
            acc[current.demoId] = current.innerHtml
            return acc
          }, {}),
          null,
          2,
        ),
      )
      console.log("Results written to demo-elements.json")
    } else {
      console.log("No elements found. Check your target site and selectors")
    }
  } catch (error) {
    console.error("Crawl failed:", error)
  }
}

export {WebCrawler, type CrawlOptions, type FoundElement}

if (import.meta.url === `file://${process.argv[1]}`) {
  crawlForDataAttribute()
}
