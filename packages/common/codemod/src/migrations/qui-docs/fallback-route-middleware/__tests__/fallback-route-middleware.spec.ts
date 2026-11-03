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

import {transformNotFoundRoute} from "../../not-found-route/not-found-route.js"
import {
  fallbackRouteMiddleware,
  transformFallbackRouteMiddleware,
} from "../fallback-route-middleware.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

describe("fallback-route-middleware", () => {
  const files = readdirSync(dirs.original).filter((file) =>
    file.endsWith(".tsx"),
  )

  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformFallbackRouteMiddleware(original).content).toBe(expected)
    })
  }

  test("is idempotent", () => {
    const original = readFileSync(resolve(dirs.original, "basic.tsx"), "utf-8")
    const once = transformFallbackRouteMiddleware(original)
    expect(once.status).toBe("updated")
    const twice = transformFallbackRouteMiddleware(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("chains after not-found-route", () => {
    const content = `import {getPages, getSections} from "@qualcomm-ui/docs-plugin/markdown-content"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

export const loader = createFallbackRouteLoader({
  exports: siteData.exports,
  getPages,
  getSections,
})
`
    const expected = readFileSync(resolve(dirs.expected, "basic.tsx"), "utf-8")
    const withRoute = transformNotFoundRoute(content).content
    expect(transformFallbackRouteMiddleware(withRoute).content).toBe(expected)
  })

  test("skips files without createFallbackRouteLoader", () => {
    const content = `export const loader = () => null\n`
    expect(transformFallbackRouteMiddleware(content)).toMatchObject({
      content,
      status: "skipped",
    })
  })

  test("uses aliased imports", () => {
    const content = `import {
  createFallbackRouteLoader as createLoader,
  createFallbackRouteMiddleware as createMiddleware,
} from "@qualcomm-ui/react-router-utils/node"

export const loader = createLoader(args)
`
    const result = transformFallbackRouteMiddleware(content)
    expect(result.status).toBe("updated")
    expect(result.content).toContain(
      `export const middleware = [createMiddleware(args)]\n\nexport const loader = createLoader(args)`,
    )
  })

  test("reports an existing middleware export as a conflict", () => {
    const content = `import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

export const middleware = [authMiddleware]

export const loader = createFallbackRouteLoader(args)
`
    expect(transformFallbackRouteMiddleware(content)).toMatchObject({
      content,
      status: "conflict",
    })
  })

  test("reports an unrecognized loader as a conflict", () => {
    const content = `import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

const fallbackLoader = createFallbackRouteLoader(args)

export const loader: LoaderFunction = (args) => fallbackLoader(args)
`
    expect(transformFallbackRouteMiddleware(content)).toMatchObject({
      content,
      status: "conflict",
    })
  })

  test("reports a conflict when fallbackRouteArgs is already declared", () => {
    const content = `import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

const fallbackRouteArgs = {}

export const loader = createFallbackRouteLoader({exports: undefined})
`
    expect(transformFallbackRouteMiddleware(content)).toMatchObject({
      content,
      status: "conflict",
    })
  })
})

describe("fallbackRouteMiddleware codemod", () => {
  let cwd: string
  let routeFile: string
  const original = readFileSync(resolve(dirs.original, "basic.tsx"), "utf-8")
  const expected = readFileSync(resolve(dirs.expected, "basic.tsx"), "utf-8")

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "fallback-route-middleware-"))
    mkdirSync(join(cwd, "src/routes"), {recursive: true})
    routeFile = join(cwd, "src/routes/$.tsx")
    writeFileSync(routeFile, original)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("adds the middleware export", async () => {
    const results = await fallbackRouteMiddleware.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: routeFile,
        message: "added the fallback route middleware",
        status: "updated",
      },
    ])
    expect(readFileSync(routeFile, "utf-8")).toBe(expected)
  })

  test("doesn't write in dry-run mode", async () => {
    const results = await fallbackRouteMiddleware.run({cwd, dryRun: true})

    expect(results[0].status).toBe("updated")
    expect(readFileSync(routeFile, "utf-8")).toBe(original)
  })

  test("leaves migrated files alone", async () => {
    writeFileSync(routeFile, expected)
    const results = await fallbackRouteMiddleware.run({cwd, dryRun: false})

    expect(results[0].status).toBe("unchanged")
    expect(readFileSync(routeFile, "utf-8")).toBe(expected)
  })
})
