import {writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {
  type Browser,
  type BrowserContext,
  chromium,
  type Page,
} from "playwright"

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
  private pendingUrls = new Set<string>()
  private ignoredUrls = /.*\/changelogs.*/

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
      const startUrls = [{depth: 0, url: this.options.baseUrl}]
      await this.crawlUrls(startUrls)
      return this.foundElements
    } finally {
      await this.cleanup()
    }
  }

  private async crawlUrls(
    urlsWithDepth: Array<{depth: number; url: string}>,
  ): Promise<void> {
    const urlQueue = [...urlsWithDepth]
    const activeTasks = new Set<Promise<void>>()

    while (urlQueue.length > 0 || activeTasks.size > 0) {
      // Start new tasks up to concurrency limit
      while (
        urlQueue.length > 0 &&
        activeTasks.size < this.options.concurrency &&
        this.visitedUrls.size < this.options.maxPages
      ) {
        const urlData = urlQueue.shift()!

        if (
          this.visitedUrls.has(urlData.url) ||
          this.pendingUrls.has(urlData.url) ||
          this.ignoredUrls.test(urlData.url)
        ) {
          continue
        }

        this.pendingUrls.add(urlData.url)
        const contextIndex = activeTasks.size % this.contexts.length
        const task = this.crawlSingleUrl(
          urlData.url,
          urlData.depth,
          contextIndex,
        )
          .then((newUrls) => {
            // Add new URLs to queue
            for (const newUrl of newUrls) {
              if (
                urlData.depth < this.options.maxDepth &&
                !this.visitedUrls.has(newUrl) &&
                !this.pendingUrls.has(newUrl)
              ) {
                urlQueue.push({depth: urlData.depth + 1, url: newUrl})
              }
            }
          })
          .finally(() => {
            activeTasks.delete(task)
            this.pendingUrls.delete(urlData.url)
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
    depth: number,
    contextIndex: number,
  ): Promise<string[]> {
    if (
      this.visitedUrls.has(url) ||
      this.visitedUrls.size >= this.options.maxPages
    ) {
      return []
    }

    this.visitedUrls.add(url)
    console.log(
      `[${contextIndex}] Crawling: ${url} (depth: ${depth}) [${this.visitedUrls.size}/${this.options.maxPages}]`,
    )

    const context = this.contexts[contextIndex]
    const page = await context.newPage()

    try {
      await page.goto(url, {
        timeout: this.options.pageTimeout,
        waitUntil: "networkidle",
      })

      // Run both operations in parallel
      const [newUrls] = await Promise.all([
        this.extractLinks(page, url),
        this.searchForDataAttribute(page, url),
      ])

      return newUrls
    } catch (error: any) {
      console.error(`[${contextIndex}] Error crawling ${url}:`, error.message)
      return []
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

  private async extractLinks(
    page: Page,
    currentUrl: string,
  ): Promise<string[]> {
    try {
      const links = await page.locator("a[href]").all()
      const urls: string[] = []

      // Process links in smaller batches for speed
      const batchSize = 10
      for (let i = 0; i < links.length; i += batchSize) {
        const batch = links.slice(i, i + batchSize)
        const batchPromises = batch.map(async (link) => {
          try {
            const href = await link.getAttribute("href")
            if (!href) {
              return null
            }

            const absoluteUrl = this.resolveUrl(href, currentUrl)
            return this.shouldCrawlUrl(absoluteUrl, currentUrl)
              ? absoluteUrl
              : null
          } catch {
            return null
          }
        })

        const batchResults = await Promise.all(batchPromises)
        const validUrls = batchResults.filter(
          (url): url is string => url !== null,
        )
        urls.push(...validUrls)
      }

      return [...new Set(urls)]
    } catch (error) {
      console.error(`Error extracting links from ${currentUrl}:`, error)
      return []
    }
  }

  private resolveUrl(href: string, baseUrl: string): string {
    try {
      return new URL(href, baseUrl).toString()
    } catch {
      return ""
    }
  }

  private shouldCrawlUrl(url: string, currentUrl: string): boolean {
    if (!url || this.visitedUrls.has(url) || this.pendingUrls.has(url)) {
      return false
    }

    try {
      const urlObj = new URL(url)
      const currentUrlObj = new URL(currentUrl)

      if (!urlObj.protocol.startsWith("http")) {
        return false
      }
      if (urlObj.href.includes("#")) {
        return false
      }

      if (
        this.options.sameDomainOnly &&
        urlObj.hostname !== currentUrlObj.hostname
      ) {
        return false
      }

      return true
    } catch {
      return false
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
    console.log(`Elements found: ${summary.totalElementsFound}`)

    if (summary.totalPagesVisited > 0) {
      console.log(
        `Speed: ${(summary.totalPagesVisited / ((endTime - startTime) / 1000)).toFixed(1)} pages/sec`,
      )
    }

    console.log("\nFound elements:")
    results.forEach((element) => {
      console.debug(`${element.demoId} (${element.url})`)
    })

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
