import {deepStrictEqual, ok, strictEqual} from "node:assert"
import {randomBytes} from "node:crypto"
import {readFile} from "node:fs/promises"
import {chromium, type Route} from "playwright"

import {getWebviewContent} from "../src/extension/webview-content"
import {
  respondToWebviewMessage,
  type WebviewMessage,
} from "../src/shared/messages"

declare global {
  interface Window {
    sampleTestHost: {
      acquisitions: number
      messages: unknown[]
      state: unknown
    }
  }
}

const origin = "http://qui-webview.test"
const html = getWebviewContent({
  cspSource: origin,
  nonce: randomBytes(16).toString("hex"),
  scriptUri: `${origin}/webview.js`,
  styleUri: `${origin}/webview.css`,
})
const [script, stylesheet] = await Promise.all([
  readFile("dist/webview/webview.js"),
  readFile("dist/webview/webview.css", "utf8"),
])

const browser = await chromium.launch({headless: true})
try {
  const page = await browser.newPage()
  const pageErrors: string[] = []
  const requests: string[] = []
  page.on("pageerror", (error) => pageErrors.push(error.message))

  /**
   * VS Code is the external boundary. Exercise the built application and the
   * extension's actual response handler while simulating its transport.
   */
  await page.exposeFunction("sampleTestRespond", respondToWebviewMessage)
  await page.addInitScript({
    content: `
    const host = {acquisitions: 0, messages: [], state: {name: "Saved name"}}
    window.sampleTestHost = host
    Object.defineProperty(window, "acquireVsCodeApi", {
      value: () => {
        host.acquisitions += 1
        if (host.acquisitions > 1) {
          throw new Error("acquireVsCodeApi can only be called once")
        }
        return {
          getState: () => host.state,
          postMessage: async (message) => {
            host.messages.push(message)
            const response = await window.sampleTestRespond(message)
            if (response) window.postMessage(response, window.location.origin)
          },
          setState: (value) => { host.state = value },
        }
      },
    })
  `,
  })
  const serveSample = (route: Route) => {
    const pathname = new URL(route.request().url()).pathname
    requests.push(pathname)
    if (pathname === "/webview.js") {
      return route.fulfill({body: script, contentType: "text/javascript"})
    }
    if (pathname === "/webview.css") {
      return route.fulfill({
        body: `:root { --vscode-font-family: monospace; --vscode-font-size: 17px; --vscode-font-weight: 400; --vscode-foreground: #112233; --vscode-editor-background: #ffffff; }\n${stylesheet}`,
        contentType: "text/css",
      })
    }
    return pathname === "/"
      ? route.fulfill({body: html, contentType: "text/html"})
      : route.abort()
  }
  await page.route(`${origin}/**`, serveSample)

  await page.goto(origin)
  await page.getByRole("heading", {name: "QUI React VS Code Sample"}).waitFor()
  deepStrictEqual(pageErrors, [])
  await page
    .getByRole("status")
    .filter({hasText: /^Connected to the extension\.$/})
    .waitFor()
  strictEqual(
    await page.getByRole("textbox", {name: "Your name"}).inputValue(),
    "Saved name",
  )
  strictEqual(
    await page.getByRole("combobox", {name: "Preview theme"}).count(),
    0,
  )

  await page.getByRole("textbox", {name: "Your name"}).fill("Dust")
  await page.getByRole("button", {name: "Send greeting"}).click()
  await page
    .getByRole("status")
    .filter({hasText: /^Hello, Dust!$/})
    .waitFor()
  deepStrictEqual(await page.evaluate(() => window.sampleTestHost.state), {
    name: "Dust",
  })
  const messages = await page.evaluate(() => window.sampleTestHost.messages)
  ok(
    messages.some(
      (message) =>
        JSON.stringify(message) ===
        JSON.stringify({name: "Dust", type: "greet"} satisfies WebviewMessage),
    ),
  )
  strictEqual(await page.evaluate(() => window.sampleTestHost.acquisitions), 1)

  await page.getByRole("textbox", {name: "Your name"}).fill("   ")
  strictEqual(
    await page.getByRole("button", {name: "Send greeting"}).isDisabled(),
    true,
  )
  await page.evaluate(() =>
    window.postMessage({text: 123, type: "greeting"}, window.location.origin),
  )
  strictEqual(await page.getByRole("status").textContent(), "Hello, Dust!")

  await page
    .getByRole("textbox", {name: "Your name"})
    .fill("<img src=x onerror=alert(1)>")
  await page.getByRole("button", {name: "Send greeting"}).click()
  await page
    .getByRole("status")
    .filter({hasText: "Hello, <img src=x onerror=alert(1)>!"})
    .waitFor()
  strictEqual(await page.getByRole("img").count(), 0)

  /**
   * Host font/color variables are documented CSS inputs. Check the shipped
   * stylesheet and a live theme update without remounting the application.
   */
  const input = page.getByRole("textbox", {name: "Your name"})
  strictEqual(
    await input.evaluate((element) => getComputedStyle(element).fontSize),
    "17px",
  )
  strictEqual(
    await page
      .getByRole("heading")
      .evaluate((element) => getComputedStyle(element).color),
    "rgb(17, 34, 51)",
  )
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--vscode-foreground", "#eeeeee")
    document.documentElement.style.setProperty(
      "--vscode-editor-background",
      "#000000",
    )
  })
  strictEqual(
    await page
      .getByRole("heading")
      .evaluate((element) => getComputedStyle(element).color),
    "rgb(238, 238, 238)",
  )

  const blockedDirective = await page.evaluate(`
    new Promise((resolve) => {
      const timeout = setTimeout(() => resolve("not-blocked"), 1500)
      document.addEventListener("securitypolicyviolation", (event) => {
        clearTimeout(timeout)
        resolve(event.effectiveDirective)
      }, {once: true})
      const script = document.createElement("script")
      script.textContent = "window.sampleForbiddenScriptRan = true"
      document.head.append(script)
    })
  `)
  strictEqual(blockedDirective, "script-src-elem")
  strictEqual(
    await page.evaluate(() => Reflect.get(window, "sampleForbiddenScriptRan")),
    undefined,
  )

  ok(requests.includes("/webview.js"))
  ok(requests.includes("/webview.css"))
  deepStrictEqual(pageErrors, [])

  const preview = await browser.newPage()
  const previewErrors: string[] = []
  preview.on("pageerror", (error) => previewErrors.push(error.message))
  await preview.route(`${origin}/**`, serveSample)
  await preview.goto(origin)
  await preview
    .getByRole("status")
    .filter({hasText: "Connected to the browser simulator."})
    .waitFor()
  const themes = preview.getByRole("combobox", {name: "Preview theme"})
  strictEqual(await themes.inputValue(), "light-modern")
  const expectedThemes = [
    {background: "rgb(31, 31, 31)", id: "dark-modern", label: "Dark Modern"},
    {background: "rgb(30, 30, 30)", id: "dark-plus", label: "Dark+"},
    {
      background: "rgb(0, 0, 0)",
      id: "dark-high-contrast",
      label: "Dark High Contrast",
    },
    {
      background: "rgb(255, 255, 255)",
      id: "light-modern",
      label: "Light Modern",
    },
    {background: "rgb(255, 255, 255)", id: "light-plus", label: "Light+"},
    {
      background: "rgb(255, 255, 255)",
      id: "light-high-contrast",
      label: "Light High Contrast",
    },
    {background: "rgb(39, 40, 34)", id: "monokai", label: "Monokai"},
    {background: "rgb(245, 245, 245)", id: "quiet-light", label: "Quiet Light"},
    {
      background: "rgb(0, 43, 54)",
      id: "solarized-dark",
      label: "Solarized Dark",
    },
    {
      background: "rgb(253, 246, 227)",
      id: "solarized-light",
      label: "Solarized Light",
    },
  ]
  deepStrictEqual(
    await themes.getByRole("option").allTextContents(),
    expectedThemes.map(({label}) => label),
  )
  for (const {background, id} of expectedThemes) {
    await themes.selectOption(id)
    strictEqual(await themes.inputValue(), id)
    strictEqual(
      await preview
        .getByRole("main")
        .evaluate((element) => getComputedStyle(element).backgroundColor),
      background,
    )
  }
  await preview.getByRole("textbox", {name: "Your name"}).fill("Browser")
  await preview.getByRole("button", {name: "Send greeting"}).click()
  await preview
    .getByRole("status")
    .filter({hasText: "Hello, Browser!"})
    .waitFor()
  await preview.reload()
  await preview
    .getByRole("status")
    .filter({hasText: "Connected to the browser simulator."})
    .waitFor()
  strictEqual(
    await preview.getByRole("textbox", {name: "Your name"}).inputValue(),
    "",
  )
  deepStrictEqual(previewErrors, [])
  console.log(
    "Built webview passed CSP enforcement, messaging, restored/saved state, host styling, text escaping, and browser preview checks.",
  )
} finally {
  await browser.close()
}
