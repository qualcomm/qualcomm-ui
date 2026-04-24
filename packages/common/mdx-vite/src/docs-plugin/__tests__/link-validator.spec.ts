// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Root} from "mdast"
import remarkParse from "remark-parse"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import type {PageMap} from "@qualcomm-ui/mdx-common"

import {
  collectLinks,
  reportInvalidLinks,
  resolveLink,
  validateLinks,
} from "../link-validator"
import {SectionExtractor} from "../markdown/knowledge/section-extractor"
import {createRemarkProcessor} from "../markdown/remark-pipeline"

function parse(md: string): Root {
  return unified().use(remarkParse).parse(md)
}

function parseWithPipeline(md: string): Root {
  const processor = createRemarkProcessor({
    alerts: true,
    extractMeta: {},
    frontmatter: true,
    gfm: true,
    mdx: true,
    removeJsx: true,
    removeMermaidCodeBlocks: true,
  })
  return processor.runSync(processor.parse(md)) as Root
}

describe("resolveLink", () => {
  test("returns null for external https links", () => {
    expect(resolveLink("https://example.com", "/page")).toBeNull()
  })

  test("returns null for external http links", () => {
    expect(resolveLink("http://example.com", "/page")).toBeNull()
  })

  test("returns null for mailto links", () => {
    expect(resolveLink("mailto:a@b.com", "/page")).toBeNull()
  })

  test("resolves absolute path", () => {
    expect(resolveLink("/components/tooltip", "/page")).toEqual({
      fragment: undefined,
      pathname: "/components/tooltip",
    })
  })

  test("resolves absolute path with fragment", () => {
    expect(resolveLink("/components/tooltip#size", "/page")).toEqual({
      fragment: "size",
      pathname: "/components/tooltip",
    })
  })

  test("resolves fragment-only relative link", () => {
    expect(resolveLink("./#emphasis", "/components/button")).toEqual({
      fragment: "emphasis",
      pathname: "/components/button",
    })
  })

  test("resolves ./ as current page", () => {
    expect(resolveLink("./", "/components/button")).toEqual({
      fragment: undefined,
      pathname: "/components/button",
    })
  })

  test("resolves bare fragment with dot path", () => {
    expect(resolveLink(".#anchor", "/components/button")).toEqual({
      fragment: "anchor",
      pathname: "/components/button",
    })
  })

  test("resolves relative sibling path", () => {
    expect(resolveLink("../tooltip", "/components/button")).toEqual({
      fragment: undefined,
      pathname: "/tooltip",
    })
  })

  test("resolves relative sibling path with fragment", () => {
    expect(resolveLink("../tooltip#placement", "/components/button")).toEqual({
      fragment: "placement",
      pathname: "/tooltip",
    })
  })

  test("strips trailing slash from resolved pathname", () => {
    expect(resolveLink("/components/button/", "/page")).toEqual({
      fragment: undefined,
      pathname: "/components/button",
    })
  })

  test("preserves root pathname /", () => {
    expect(resolveLink("/", "/page")).toEqual({
      fragment: undefined,
      pathname: "/",
    })
  })
})

describe("collectLinks", () => {
  test("collects absolute internal links", () => {
    const tree = parse("Check the [tooltip](/components/tooltip) component.")
    const links = collectLinks(tree, "/src/button.mdx", "/components/button")

    expect(links).toEqual([
      {
        fragment: undefined,
        sourceFile: "/src/button.mdx",
        sourcePathname: "/components/button",
        targetPathname: "/components/tooltip",
        url: "/components/tooltip",
      },
    ])
  })

  test("collects fragment-relative links", () => {
    const tree = parse("Use the [emphasis](./#emphasis) prop.")
    const links = collectLinks(tree, "/src/button.mdx", "/components/button")

    expect(links).toEqual([
      {
        fragment: "emphasis",
        sourceFile: "/src/button.mdx",
        sourcePathname: "/components/button",
        targetPathname: "/components/button",
        url: "./#emphasis",
      },
    ])
  })

  test("skips external links", () => {
    const tree = parse(
      "See [MDN](https://developer.mozilla.org) for more info.",
    )
    const links = collectLinks(tree, "/src/button.mdx", "/components/button")
    expect(links).toEqual([])
  })

  test("collects multiple links from one page", () => {
    const tree = parse(
      [
        "See [tooltip](/components/tooltip) and [size](./#size).",
        "",
        "Also see [setup](/setup/react-router).",
      ].join("\n"),
    )
    const links = collectLinks(tree, "/src/button.mdx", "/components/button")
    expect(links).toHaveLength(3)
    expect(links.map((l) => l.url)).toEqual([
      "/components/tooltip",
      "./#size",
      "/setup/react-router",
    ])
  })
})

describe("validateLinks", () => {
  const pageMap: PageMap = {
    "/components/button": {
      categories: [],
      data: {},
      id: "button",
      pathname: "/components/button",
      pathSegments: ["components", "button"],
      title: "Button",
      toc: [
        {headingLevel: 2, id: "size", tagName: "h2", textContent: "Size"},
        {
          headingLevel: 2,
          id: "emphasis",
          tagName: "h2",
          textContent: "Emphasis",
        },
      ],
    },
    "/components/tooltip": {
      categories: [],
      data: {},
      id: "tooltip",
      pathname: "/components/tooltip",
      pathSegments: ["components", "tooltip"],
      title: "Tooltip",
      toc: [
        {
          headingLevel: 2,
          id: "placement",
          tagName: "h2",
          textContent: "Placement",
        },
      ],
    },
  }

  test("returns empty array for valid page links", () => {
    const links = [
      {
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/components/button",
        url: "/components/button",
      },
    ]
    expect(validateLinks(links, pageMap)).toEqual([])
  })

  test("returns empty array for valid page + fragment links", () => {
    const links = [
      {
        fragment: "size",
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/components/button",
        url: "/components/button#size",
      },
    ]
    expect(validateLinks(links, pageMap)).toEqual([])
  })

  test("reports page-not-found for missing pages", () => {
    const links = [
      {
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/components/missing",
        url: "/components/missing",
      },
    ]
    const invalid = validateLinks(links, pageMap)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].reason).toBe("page-not-found")
  })

  test("reports fragment-not-found for missing headings", () => {
    const links = [
      {
        fragment: "nonexistent",
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/components/button",
        url: "/components/button#nonexistent",
      },
    ]
    const invalid = validateLinks(links, pageMap)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].reason).toBe("fragment-not-found")
  })

  test("reports page-not-found even if fragment is provided", () => {
    const links = [
      {
        fragment: "size",
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/missing",
        url: "/missing#size",
      },
    ]
    const invalid = validateLinks(links, pageMap)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].reason).toBe("page-not-found")
  })

  test("accepts fragment matching a doc prop ID", () => {
    const links = [
      {
        fragment: "onClick",
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/components/button",
        url: "/components/button#onClick",
      },
    ]
    const docPropIds = {
      "/components/button": new Set(["onClick", "disabled", "variant"]),
    }
    expect(validateLinks(links, pageMap, docPropIds)).toEqual([])
  })

  test("still reports fragment-not-found when not in toc or doc props", () => {
    const links = [
      {
        fragment: "nonexistent",
        sourceFile: "a.mdx",
        sourcePathname: "/page",
        targetPathname: "/components/button",
        url: "/components/button#nonexistent",
      },
    ]
    const docPropIds = {
      "/components/button": new Set(["onClick", "disabled"]),
    }
    const invalid = validateLinks(links, pageMap, docPropIds)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].reason).toBe("fragment-not-found")
  })

  test("skips fragment validation when page has no toc", () => {
    const sparsePageMap: PageMap = {
      "/page": {
        categories: [],
        data: {},
        id: "page",
        pathname: "/page",
        pathSegments: ["page"],
        title: "Page",
      },
    }
    const links = [
      {
        fragment: "heading",
        sourceFile: "a.mdx",
        sourcePathname: "/other",
        targetPathname: "/page",
        url: "/page#heading",
      },
    ]
    const invalid = validateLinks(links, sparsePageMap)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].reason).toBe("fragment-not-found")
  })
})

describe("reportInvalidLinks", () => {
  test("does not throw for empty array", () => {
    expect(() => reportInvalidLinks([])).not.toThrow()
  })

  test("does not throw for non-empty array", () => {
    expect(() =>
      reportInvalidLinks([
        {
          reason: "page-not-found",
          sourceFile: "a.mdx",
          sourcePathname: "/page",
          targetPathname: "/missing",
          url: "/missing",
        },
      ]),
    ).not.toThrow()
  })
})

describe("integration: full remark pipeline", () => {
  test("validates same-page fragment links against toc", () => {
    const md = [
      "---",
      "title: Setup",
      "---",
      "",
      "## Install",
      "",
      "Run npm install.",
      "",
      "## Configure",
      "",
      "Set up your config.",
      "",
      "## Troubleshooting",
      "",
      "- Check the [install](./#install) step.",
      "- Check the [configure](./#configure) step.",
      "- Check the [missing](./#does-not-exist) step.",
    ].join("\n")

    const tree = parseWithPipeline(md)
    const links = collectLinks(tree, "/test.mdx", "/setup")

    const extractor = new SectionExtractor({depths: [1, 2, 3, 4]})
    const {toc} = extractor.extract(tree, {
      frontmatter: {},
      id: "test",
      pathname: "/setup",
      title: "Setup",
      url: "/setup",
    })

    const pageMap: PageMap = {
      "/setup": {
        categories: [],
        data: {},
        id: "setup",
        pathname: "/setup",
        pathSegments: ["setup"],
        title: "Setup",
        toc,
      },
    }

    const invalid = validateLinks(links, pageMap)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].fragment).toBe("does-not-exist")
    expect(invalid[0].reason).toBe("fragment-not-found")
  })

  test("validates links in MDX with JSX imports and steps markers", () => {
    const md = [
      "---",
      "title: Guide",
      "---",
      "",
      "import {Foo} from 'bar'",
      "",
      "# {frontmatter.title}",
      "",
      "::: steps h2",
      "",
      "## First step",
      "",
      "Do this first.",
      "",
      "## Second step",
      "",
      "Do this second.",
      "",
      "::: /steps",
      "",
      "## Summary",
      "",
      "- See [first step](./#first-step).",
      "- See [second step](./#second-step).",
      "- See [nonexistent](./#nope).",
    ].join("\n")

    const tree = parseWithPipeline(md)
    const links = collectLinks(tree, "/test.mdx", "/guide")

    const extractor = new SectionExtractor({depths: [1, 2, 3, 4]})
    const {toc} = extractor.extract(tree, {
      frontmatter: {},
      id: "test",
      pathname: "/guide",
      title: "Guide",
      url: "/guide",
    })

    const pageMap: PageMap = {
      "/guide": {
        categories: [],
        data: {},
        id: "guide",
        pathname: "/guide",
        pathSegments: ["guide"],
        title: "Guide",
        toc,
      },
    }

    const invalid = validateLinks(links, pageMap)
    expect(invalid).toHaveLength(1)
    expect(invalid[0].fragment).toBe("nope")
  })
})
