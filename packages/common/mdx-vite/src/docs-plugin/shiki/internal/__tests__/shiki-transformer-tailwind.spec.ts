import type {Root} from "hast"
import {createHighlighter} from "shiki"
import {describe, expect, test} from "vitest"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {
  createShikiTailwindTransformer,
  extractClassesFromHast,
  transformWithInlineStyles,
} from "../shiki-transformer-tailwind"

const styles = dedent`
  @layer theme, base, components, utilities;
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/utilities.css" layer(utilities);

  @import "@qualcomm-ui/tailwind-plugin/qui-strict.css";
`

describe("transformWithInlineStyles", () => {
  describe("inlining simple classes", () => {
    test("inlines multiple classes as style attributes", async () => {
      const html = `<div className="flex items-center bg-brand-primary"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('style="')
      expect(result.html).toContain("display: flex")
      expect(result.html).toContain("align-items: center")
      expect(result.html).not.toContain("class=")
      expect(result.css).toBe("")
    })

    test("handles nested elements", async () => {
      const html = `<div className="flex"><span className="hidden"></span></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('style="display: flex"')
      expect(result.html).toContain('style="display: none"')
    })

    test("handles multiple sibling elements", async () => {
      const html = `<div className="flex"></div><div className="grid"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain("display: flex")
      expect(result.html).toContain("display: grid")
    })

    test("handles elements without classes", async () => {
      const html = `<div className="flex"><span></span></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('style="display: flex"')
      expect(result.html).toContain("<span></span>")
    })

    test("handles arbitrary values", async () => {
      const html = `<div className="w-[100px] h-[50px]"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain("width: 100px")
      expect(result.html).toContain("height: 50px")
    })

    test("handles negative values", async () => {
      const html = `<div className="-mt-4 -ml-2"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain("margin-top:")
      expect(result.html).toContain("margin-left:")
    })
  })

  describe("keeping variant classes as CSS", () => {
    test("keeps responsive classes (sm:)", async () => {
      const html = `<div className="flex sm:hidden"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('style="display: flex"')
      expect(result.html).toContain('class="sm:hidden"')
      expect(result.css).toContain(".sm\\:hidden")
      expect(result.css).toContain("@media")
    })

    test("keeps hover classes", async () => {
      const html = `<div className="flex hover:opacity-50"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('style="display: flex"')
      expect(result.html).toContain('class="hover:opacity-50"')
      expect(result.css).toContain(".hover\\:opacity-50")
      expect(result.css).toContain(":hover")
    })

    test("keeps focus classes", async () => {
      const html = `<div className="opacity-100 focus:opacity-50"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('class="focus:opacity-50"')
      expect(result.css).toContain(".focus\\:opacity-50")
      expect(result.css).toContain(":focus")
    })

    test("keeps active classes", async () => {
      const html = `<div className="scale-100 active:scale-95"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('class="active:scale-95"')
      expect(result.css).toContain(".active\\:scale-95")
    })

    test("keeps multiple breakpoint variants", async () => {
      const html = `<div className="hidden sm:block md:flex lg:grid"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).toContain('style="display: none"')
      expect(result.html).toContain('class="sm:block md:flex lg:grid"')
      expect(result.css).toContain(".sm\\:block")
      expect(result.css).toContain(".md\\:flex")
      expect(result.css).toContain(".lg\\:grid")
    })

    test("does not include inlineable classes in residual CSS", async () => {
      const html = `<div className="flex items-center justify-between"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).not.toContain("class=")
      expect(result.css).not.toContain(".flex")
      expect(result.css).not.toContain(".items-center")
      expect(result.css).not.toContain(".justify-between")
    })

    test("returns all classes as CSS when none are inlineable", async () => {
      const html = `<div className="hover:flex sm:hidden focus:opacity-50"></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).not.toContain("style=")
      expect(result.html).toContain(
        'class="hover:flex sm:hidden focus:opacity-50"',
      )
      expect(result.css).toContain(".hover\\:flex")
      expect(result.css).toContain(".sm\\:hidden")
      expect(result.css).toContain(".focus\\:opacity-50")
    })
  })

  describe("edge cases", () => {
    test("handles empty className", async () => {
      const html = `<div className=""></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).not.toContain("style=")
    })

    test("handles whitespace-only className", async () => {
      const html = `<div className="   "></div>`
      const result = await transformWithInlineStyles(html, styles)

      expect(result.html).not.toContain("style=")
    })

    test("applies same styles to multiple elements with same class", async () => {
      const html = `<div className="flex"></div><div className="flex"></div>`
      const result = await transformWithInlineStyles(html, styles)

      const matches = result.html.match(/display: flex/g)
      expect(matches).toHaveLength(2)
    })
  })
})

describe("extractClassesFromHast", () => {
  test("extracts classes from text content with double quotes", () => {
    const hast: Root = {
      children: [
        {
          children: [{type: "text", value: 'className="flex items-center"'}],
          properties: {},
          tagName: "span",
          type: "element",
        },
      ],
      type: "root",
    }

    const classes = extractClassesFromHast(hast)
    expect(classes).toContain("flex")
    expect(classes).toContain("items-center")
  })

  test("extracts classes from text content with single quotes", () => {
    const hast: Root = {
      children: [
        {
          children: [{type: "text", value: "className='flex hidden'"}],
          properties: {},
          tagName: "span",
          type: "element",
        },
      ],
      type: "root",
    }

    const classes = extractClassesFromHast(hast)
    expect(classes).toContain("flex")
    expect(classes).toContain("hidden")
  })

  test("extracts classes from nested elements", () => {
    const hast: Root = {
      children: [
        {
          children: [
            {
              children: [
                {
                  children: [{type: "text", value: '"flex"'}],
                  properties: {},
                  tagName: "span",
                  type: "element",
                },
                {
                  children: [{type: "text", value: '"grid"'}],
                  properties: {},
                  tagName: "span",
                  type: "element",
                },
              ],
              properties: {},
              tagName: "code",
              type: "element",
            },
          ],
          properties: {},
          tagName: "pre",
          type: "element",
        },
      ],
      type: "root",
    }

    const classes = extractClassesFromHast(hast)
    expect(classes).toContain("flex")
    expect(classes).toContain("grid")
  })

  test("extracts classes with variants", () => {
    const hast: Root = {
      children: [
        {
          children: [{type: "text", value: '"hover:bg-red-500 sm:hidden"'}],
          properties: {},
          tagName: "span",
          type: "element",
        },
      ],
      type: "root",
    }

    const classes = extractClassesFromHast(hast)
    expect(classes).toContain("hover:bg-red-500")
    expect(classes).toContain("sm:hidden")
  })

  test("handles empty tree", () => {
    const hast: Root = {
      children: [],
      type: "root",
    }

    const classes = extractClassesFromHast(hast)
    expect(classes).toEqual([])
  })

  test("handles tree without string literals", () => {
    const hast: Root = {
      children: [
        {
          children: [{type: "text", value: "const x = 5"}],
          properties: {},
          tagName: "span",
          type: "element",
        },
      ],
      type: "root",
    }

    const classes = extractClassesFromHast(hast)
    expect(classes).toEqual([])
  })
})

describe("createShikiTailwindTransformer", () => {
  test("transforms className to inline styles in highlighted code", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styles}),
    ])

    const code = dedent`
      export function Demo() {
        return <div className="flex items-center">Hello</div>
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // Should contain inline styles instead of className
    expect(html).toContain("display: flex")
    expect(html).toContain("align-items: center")

    highlighter.dispose()
  })

  test("keeps non-inlineable classes like hover variants", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styles}),
    ])

    const code = dedent`
      export function Demo() {
        return <div className="flex hover:bg-red-500">Hello</div>
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // Should inline flex but keep hover variant as className
    expect(html).toContain("display: flex")
    expect(html).toContain("hover:bg-red-500")

    highlighter.dispose()
  })

  test("handles code without any tailwind classes", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styles}),
    ])

    const code = dedent`
      export function Demo() {
        return <div>Hello World</div>
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // Should not crash and should contain the original code
    expect(html).toContain("Hello World")

    highlighter.dispose()
  })

  test("handles multiple elements with different classes", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styles}),
    ])

    const code = dedent`
      export function Demo() {
        return (
          <div className="flex">
            <span className="hidden">Hidden</span>
            <span className="grid">Grid</span>
          </div>
        )
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    expect(html).toContain("display: flex")
    expect(html).toContain("display: none")
    expect(html).toContain("display: grid")

    highlighter.dispose()
  })

  test("keeps responsive variants like sm: as className", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styles}),
    ])

    const code = dedent`
      export function Demo() {
        return <div className="hidden sm:block md:flex">Hello</div>
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // hidden should be inlined, responsive variants should be kept
    expect(html).toContain("display: none")
    expect(html).toContain("sm:block")
    expect(html).toContain("md:flex")

    highlighter.dispose()
  })

  test("outputs JSX object syntax when styleFormat is jsx", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styleFormat: "jsx", styles}),
    ])

    const code = dedent`
      export function Demo() {
        return <div className="flex items-center">Hello</div>
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // Strip HTML tags to check text content (syntax highlighting splits across
    // spans)
    const textContent = html.replace(/<[^>]+>/g, "")

    // Should use JSX object syntax
    expect(textContent).toContain("style={{")
    expect(textContent).toContain("display: 'flex'")
    expect(textContent).toContain("alignItems: 'center'")

    highlighter.dispose()
  })

  test("JSX format keeps non-inlineable classes as className", async () => {
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({styleFormat: "jsx", styles}),
    ])

    const code = dedent`
      export function Demo() {
        return <div className="flex hover:bg-red-500">Hello</div>
      }
    `

    const html = highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // Strip HTML tags to check text content (syntax highlighting splits across
    // spans)
    const textContent = html.replace(/<[^>]+>/g, "")

    // Should use JSX object syntax for flex, keep hover as className
    expect(textContent).toContain("style={{")
    expect(textContent).toContain("display: 'flex'")
    expect(textContent).toContain("hover:bg-red-500")

    highlighter.dispose()
  })

  test("calls onResidualCss with Map for non-inlineable classes", async () => {
    let residualRules: Map<string, string> | null = null
    const [highlighter, transformer] = await Promise.all([
      createHighlighter({
        langs: ["tsx"],
        themes: ["github-light"],
      }),
      createShikiTailwindTransformer({
        onResidualCss: (rules) => {
          residualRules = rules
        },
        styles,
      }),
    ])

    const code = dedent`
      export function Demo() {
        return <div className="flex hover:opacity-50 sm:hidden">Hello</div>
      }
    `

    highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-light",
      transformers: [transformer],
    })

    // Should return a Map with CSS rules for hover and sm variants
    expect(residualRules).toBeInstanceOf(Map)
    expect(residualRules!.size).toBeGreaterThan(0)

    const cssString = [...residualRules!.values()].join("\n")
    expect(cssString).toContain("hover")
    expect(cssString).toContain("@media")

    highlighter.dispose()
  })
})
