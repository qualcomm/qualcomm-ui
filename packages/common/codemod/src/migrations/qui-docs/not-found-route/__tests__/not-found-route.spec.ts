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

import {notFoundRoute, transformNotFoundRoute} from "../not-found-route.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

describe("not-found-route", () => {
  const files = readdirSync(dirs.original).filter((file) =>
    file.endsWith(".tsx"),
  )

  for (const file of files) {
    test(file, () => {
      const original = readFileSync(resolve(dirs.original, file), "utf-8")
      const expected = readFileSync(resolve(dirs.expected, file), "utf-8")
      expect(transformNotFoundRoute(original).content).toBe(expected)
    })
  }

  test("is idempotent", () => {
    const original = readFileSync(resolve(dirs.original, "basic.tsx"), "utf-8")
    const once = transformNotFoundRoute(original)
    expect(once.status).toBe("updated")
    const twice = transformNotFoundRoute(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("skips files without createFallbackRouteLoader", () => {
    const content = `export const loader = () => null\n`
    expect(transformNotFoundRoute(content)).toEqual({
      content,
      status: "skipped",
    })
  })

  test("skips files that already have a fallback component", () => {
    const content = `import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

export const loader = createFallbackRouteLoader({})

export default function Custom() {
  return <div>404</div>
}
`
    expect(transformNotFoundRoute(content)).toEqual({
      content,
      status: "unchanged",
    })
  })

  test("uses an aliased NotFound import", () => {
    const content = `import {NotFound as Missing} from "@qualcomm-ui/react-mdx/not-found"
import {createFallbackRouteLoader} from "@qualcomm-ui/react-router-utils/node"

export const loader = createFallbackRouteLoader({})
`
    const result = transformNotFoundRoute(content)
    expect(result.content).toContain(
      `return <Missing url={loaderData.pathname} />`,
    )
  })
})

describe("notFoundRoute codemod", () => {
  let cwd: string
  let routeFile: string
  const original = readFileSync(resolve(dirs.original, "basic.tsx"), "utf-8")
  const expected = readFileSync(resolve(dirs.expected, "basic.tsx"), "utf-8")

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "not-found-route-"))
    mkdirSync(join(cwd, "src/routes"), {recursive: true})
    routeFile = join(cwd, "src/routes/$.tsx")
    writeFileSync(routeFile, original)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("adds NotFoundRoute when there is no default export", async () => {
    const results = await notFoundRoute.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: routeFile,
        message: "added the 404 fallback component",
        status: "updated",
      },
    ])
    expect(readFileSync(routeFile, "utf-8")).toBe(expected)
  })

  test("doesn't write in dry-run mode", async () => {
    const results = await notFoundRoute.run({cwd, dryRun: true})

    expect(results[0].status).toBe("updated")
    expect(readFileSync(routeFile, "utf-8")).toBe(original)
  })

  test("leaves migrated files alone", async () => {
    writeFileSync(routeFile, expected)
    const results = await notFoundRoute.run({cwd, dryRun: false})

    expect(results[0].status).toBe("unchanged")
    expect(readFileSync(routeFile, "utf-8")).toBe(expected)
  })
})
