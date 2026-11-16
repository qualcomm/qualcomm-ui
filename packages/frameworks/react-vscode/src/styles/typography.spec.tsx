import {type CSSProperties, useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import "./index.css"

/**
 * Typography is a CSS-only public API. Computed fonts and colors verify its
 * documented output, including host variable updates and missing-token fallbacks.
 */
describe("VS Code typography", () => {
  test("scales legacy role proportions when the host UI size changes", async () => {
    function Example() {
      const [size, setSize] = useState("13px")
      return (
        <>
          <button onClick={() => setSize("26px")}>
            Increase host font size
          </button>
          <div
            className="qui-vscode"
            style={{"--vscode-font-size": size} as CSSProperties}
          >
            <h1 className="qui-vscode-heading-1">Page title</h1>
            <p className="qui-vscode-body-2">Supporting text</p>
            <h2 className="qui-vscode-markdown-2">Markdown heading</h2>
          </div>
        </>
      )
    }
    await render(<Example />)
    const title = page.getByRole("heading", {name: "Page title"})
    const supporting = page.getByText("Supporting text", {exact: true})
    const markdown = page.getByRole("heading", {name: "Markdown heading"})
    expect(getComputedStyle(title.element()).fontSize).toBe("26px")
    expect(getComputedStyle(title.element()).fontWeight).toBe("600")
    expect(getComputedStyle(supporting.element()).fontSize).toBe("12px")
    expect(getComputedStyle(markdown.element()).fontSize).toBe("20px")
    await page.getByRole("button", {name: "Increase host font size"}).click()
    await expect
      .poll(() => getComputedStyle(title.element()).fontSize)
      .toBe("52px")
    expect(getComputedStyle(supporting.element()).fontSize).toBe("24px")
    expect(getComputedStyle(markdown.element()).fontSize).toBe("40px")
  })

  test("uses independent host UI and editor font settings", async () => {
    await render(
      <div
        className="qui-vscode"
        style={
          {
            "--vscode-editor-font-family": "monospace",
            "--vscode-editor-font-size": "17px",
            "--vscode-editor-font-weight": "700",
            "--vscode-font-family": "serif",
            "--vscode-font-size": "13px",
            "--vscode-font-weight": "400",
          } as CSSProperties
        }
      >
        <p className="qui-vscode-body-1">Body text</p>
        <code className="qui-vscode-code">Build command</code>
        <input aria-label="Host-styled input" />
      </div>,
    )
    const body = getComputedStyle(
      page.getByText("Body text", {exact: true}).element(),
    )
    const code = getComputedStyle(
      page.getByText("Build command", {exact: true}).element(),
    )
    const input = getComputedStyle(
      page.getByRole("textbox", {name: "Host-styled input"}).element(),
    )
    expect(body.fontFamily).toBe("serif")
    expect(body.fontWeight).toBe("500")
    expect(code.fontFamily).toBe("monospace")
    expect(code.fontSize).toBe("17px")
    expect(code.fontWeight).toBe("700")
    expect(input.fontFamily).toBe("serif")
    expect(input.fontSize).toBe("13px")
    expect(input.fontWeight).toBe("400")
  })

  test("uses host text colors and falls back when optional tokens are missing", async () => {
    function Example() {
      const [colors, setColors] = useState<CSSProperties>({})
      return (
        <>
          <button
            onClick={() =>
              setColors({
                "--vscode-descriptionForeground": "rgb(60, 60, 60)",
                "--vscode-editorWarning-foreground": "rgb(100, 80, 0)",
                "--vscode-errorForeground": "rgb(140, 0, 0)",
                "--vscode-testing-iconPassed": "rgb(0, 100, 0)",
              } as CSSProperties)
            }
          >
            Apply host colors
          </button>
          <div
            className="qui-vscode"
            style={
              {
                "--vscode-foreground": "rgb(20, 20, 20)",
                ...colors,
              } as CSSProperties
            }
          >
            <p className="qui-vscode-text-normal">Normal text</p>
            <p className="qui-vscode-text-muted">Muted text</p>
            <p className="qui-vscode-text-success">Success text</p>
            <p className="qui-vscode-text-warning">Warning text</p>
            <p className="qui-vscode-text-error">Error text</p>
          </div>
        </>
      )
    }
    await render(<Example />)
    for (const name of ["Normal", "Muted", "Success", "Warning", "Error"]) {
      expect(
        getComputedStyle(
          page.getByText(`${name} text`, {exact: true}).element(),
        ).color,
      ).toBe("rgb(20, 20, 20)")
    }
    await page.getByRole("button", {name: "Apply host colors"}).click()
    await expect
      .poll(
        () =>
          getComputedStyle(
            page.getByText("Success text", {exact: true}).element(),
          ).color,
      )
      .toBe("rgb(0, 100, 0)")
    expect(
      getComputedStyle(page.getByText("Muted text", {exact: true}).element())
        .color,
    ).toBe("rgb(60, 60, 60)")
    expect(
      getComputedStyle(page.getByText("Warning text", {exact: true}).element())
        .color,
    ).toBe("rgb(100, 80, 0)")
    expect(
      getComputedStyle(page.getByText("Error text", {exact: true}).element())
        .color,
    ).toBe("rgb(140, 0, 0)")
  })
})
