import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {
  docsContextNames,
  transformDocsContextNames,
} from "../docs-context-names.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

const files = readdirSync(dirs.original).filter((file) => file.endsWith(".tsx"))

describe("docs-context-names", () => {
  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformDocsContextNames(original).content).toBe(expected)
    })
  }

  test.each(files)("is idempotent: %s", (file) => {
    const original = readFileSync(resolve(dirs.original, file), "utf-8")
    const once = transformDocsContextNames(original)
    const twice = transformDocsContextNames(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("skips files that don't import from the context or docs-layout entries", () => {
    const content = `import {NotFound} from "@qualcomm-ui/react-mdx/not-found"\n`
    expect(transformDocsContextNames(content)).toEqual({
      content,
      manual: [],
      renamed: 0,
      status: "skipped",
    })
  })

  test("leaves unrelated docs-layout imports alone", () => {
    const content = `import {Layout} from "@qualcomm-ui/react-mdx/docs-layout"\n`
    expect(transformDocsContextNames(content)).toEqual({
      content,
      manual: [],
      renamed: 0,
      status: "unchanged",
    })
  })

  test("replaces a docs-layout import that only had page context names", () => {
    const content = `import {
  type MdxDocsLayoutContextState,
  useMdxDocsLayoutContext,
} from "@qualcomm-ui/react-mdx/docs-layout"

export const pathname: MdxDocsLayoutContextState["pathname"] =
  useMdxDocsLayoutContext().pathname
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import {type DocsPageContextValue, useDocsPageContext} from "@qualcomm-ui/react-mdx/context"

export const pathname: DocsPageContextValue["pathname"] =
  useDocsPageContext().pathname
`)
  })

  test("moves type-only docs-layout imports to a type-only context import", () => {
    const content = `import type {MdxDocsLayoutContextState} from "@qualcomm-ui/react-mdx/docs-layout"

export type State = MdxDocsLayoutContextState
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import type {DocsPageContextValue} from "@qualcomm-ui/react-mdx/context"

export type State = DocsPageContextValue
`)
  })

  test("doesn't move values into a type-only context import", () => {
    const content = `import type {MdxDocsContextValue} from "@qualcomm-ui/react-mdx/context"
import {Layout, useMdxDocsLayoutContext} from "@qualcomm-ui/react-mdx/docs-layout"

export const value: MdxDocsContextValue = useMdxDocsLayoutContext()
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import type {DocsRuntimeContextValue} from "@qualcomm-ui/react-mdx/context"
import {useDocsPageContext} from "@qualcomm-ui/react-mdx/context"
import {Layout} from "@qualcomm-ui/react-mdx/docs-layout"

export const value: DocsRuntimeContextValue = useDocsPageContext()
`)
  })

  test("aliases moved page context imports that are already bound", () => {
    const content = `import {useDocsPageContext} from "@qualcomm-ui/react-mdx/context"
import {useMdxDocsLayoutContext} from "@qualcomm-ui/react-mdx/docs-layout"

useDocsPageContext()
useMdxDocsLayoutContext()
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import {useDocsPageContext, useDocsPageContext as useMdxDocsLayoutContext} from "@qualcomm-ui/react-mdx/context"

useDocsPageContext()
useMdxDocsLayoutContext()
`)
  })

  test("keeps the old local name when the new name is already bound", () => {
    const content = `import {useSiteContext} from "@qualcomm-ui/react-mdx/context"

function useDocsManifestContext() {
  return useSiteContext()
}
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import {useDocsManifestContext as useSiteContext} from "@qualcomm-ui/react-mdx/context"

function useDocsManifestContext() {
  return useSiteContext()
}
`)
  })

  test("keeps the exported name of local exports", () => {
    const content = `import {useSiteContext} from "@qualcomm-ui/react-mdx/context"

export {useSiteContext}
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import {useDocsManifestContext} from "@qualcomm-ui/react-mdx/context"

export {useDocsManifestContext as useSiteContext}
`)
  })

  test("keeps the exported name of re-exports from the context entry", () => {
    const content = `export {
  type SiteDataContextValue as SiteData,
  useSiteContext,
} from "@qualcomm-ui/react-mdx/context"
`
    const result = transformDocsContextNames(content)
    expect(result.status).toBe("updated")
    expect(result.content).toBe(`export {
  type DocsManifestContextValue as SiteData,
  useDocsManifestContext as useSiteContext,
} from "@qualcomm-ui/react-mdx/context"
`)
  })

  test("renames members of a context namespace import", () => {
    const content = `import * as Docs from "@qualcomm-ui/react-mdx/context"

export const value: Docs.MdxDocsContextValue = Docs.useMdxDocsContext()
`
    expect(transformDocsContextNames(content).content)
      .toBe(`import * as Docs from "@qualcomm-ui/react-mdx/context"

export const value: Docs.DocsRuntimeContextValue = Docs.useDocsRuntimeContext()
`)
  })

  test("reports docs-layout namespace members as conflicts", () => {
    const content = `import * as Docs from "@qualcomm-ui/react-mdx/docs-layout"

export const value = Docs.useMdxDocsLayoutContext()
`
    expect(transformDocsContextNames(content)).toEqual({
      content,
      manual: [
        `replace Docs.useMdxDocsLayoutContext with useDocsPageContext from "@qualcomm-ui/react-mdx/context"`,
      ],
      renamed: 0,
      status: "conflict",
    })
  })

  test("reports re-exports from the docs-layout entry as conflicts", () => {
    const content = `import {useSiteContext} from "@qualcomm-ui/react-mdx/context"

export {useMdxDocsLayoutContext} from "@qualcomm-ui/react-mdx/docs-layout"

useSiteContext()
`
    expect(transformDocsContextNames(content)).toEqual({
      content: `import {useDocsManifestContext} from "@qualcomm-ui/react-mdx/context"

export {useMdxDocsLayoutContext} from "@qualcomm-ui/react-mdx/docs-layout"

useDocsManifestContext()
`,
      manual: [
        `re-export useDocsPageContext from "@qualcomm-ui/react-mdx/context" instead of useMdxDocsLayoutContext from "@qualcomm-ui/react-mdx/docs-layout"`,
      ],
      renamed: 1,
      status: "conflict",
    })
  })
})

describe("docsContextNames codemod", () => {
  let cwd: string
  let sourceFile: string
  const original = readFileSync(
    resolve(dirs.original, "context-imports.tsx"),
    "utf-8",
  )
  const expected = readFileSync(
    resolve(dirs.expected, "context-imports.tsx"),
    "utf-8",
  )

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "docs-context-names-"))
    mkdirSync(join(cwd, "src"), {recursive: true})
    sourceFile = join(cwd, "src/root.tsx")
    writeFileSync(sourceFile, original)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("renames the deprecated names", async () => {
    const results = await docsContextNames.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: sourceFile,
        message: "renamed 5 deprecated names",
        status: "updated",
      },
    ])
    expect(readFileSync(sourceFile, "utf-8")).toBe(expected)
  })

  test("doesn't write in dry-run mode", async () => {
    const results = await docsContextNames.run({cwd, dryRun: true})

    expect(results[0].message).toBe("would rename 5 deprecated names")
    expect(readFileSync(sourceFile, "utf-8")).toBe(original)
  })

  test("leaves migrated files alone", async () => {
    writeFileSync(sourceFile, expected)
    const results = await docsContextNames.run({cwd, dryRun: false})

    expect(results[0].status).toBe("unchanged")
    expect(readFileSync(sourceFile, "utf-8")).toBe(expected)
  })

  test("ignores node_modules", async () => {
    const dependency = join(cwd, "node_modules/dep/index.tsx")
    mkdirSync(dirname(dependency), {recursive: true})
    writeFileSync(dependency, original)

    const results = await docsContextNames.run({cwd, dryRun: false})

    expect(results.map((result) => result.file)).toEqual([sourceFile])
    expect(readFileSync(dependency, "utf-8")).toBe(original)
  })
})
