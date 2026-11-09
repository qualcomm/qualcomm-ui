import {
  existsSync,
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

import {planMigration} from "../../../plan.js"
import {quiDocs} from "../../index.js"
import {
  fallbackRoute,
  resolveRouteDirectories,
  transformFallbackRoute,
} from "../fallback-route.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

function readMock(dir: keyof typeof dirs, file: string): string {
  return readFileSync(resolve(dirs[dir], file), "utf-8")
}

describe("resolveRouteDirectories", () => {
  test("reads a default export with satisfies", () => {
    const content = `import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

export default {
  appDirectory: "src",
  pageDirectory: "pages",
} satisfies QuiDocsConfig
`
    expect(resolveRouteDirectories(content)).toEqual({
      appDirectory: "src",
      pageDirectory: "pages",
    })
  })

  test("follows an exported variable", () => {
    const content = `const config: QuiDocsConfig = {
  appDirectory: "src",
}

export default config
`
    expect(resolveRouteDirectories(content)).toEqual({
      appDirectory: "src",
      pageDirectory: "routes",
    })
  })

  test("unwraps a config helper call", () => {
    const content = `export default defineConfig({appDirectory: \`site\`})\n`
    expect(resolveRouteDirectories(content)).toEqual({
      appDirectory: "site",
      pageDirectory: "routes",
    })
  })

  test("uses the defaults when both directories are omitted", () => {
    expect(resolveRouteDirectories(`export default {}\n`)).toEqual({
      appDirectory: "app",
      pageDirectory: "routes",
    })
  })

  test("returns undefined for values it can't read statically", () => {
    expect(
      resolveRouteDirectories(
        `const dir = "src"\nexport default {appDirectory: dir}\n`,
      ),
    ).toBeUndefined()
    expect(
      resolveRouteDirectories(`export default {...base}\n`),
    ).toBeUndefined()
    expect(
      resolveRouteDirectories(`module.exports = {appDirectory: "src"}\n`),
    ).toBeUndefined()
  })
})

describe("transformFallbackRoute", () => {
  const files = readdirSync(dirs.original).filter((file) =>
    file.endsWith(".tsx"),
  )

  for (const file of files) {
    test(file, () => {
      expect(transformFallbackRoute(readMock("original", file)).content).toBe(
        readMock("expected", file),
      )
    })
  }

  test("is idempotent", () => {
    const once = transformFallbackRoute(
      readMock("original", "default-export.tsx"),
    )
    expect(once.status).toBe("updated")
    const twice = transformFallbackRoute(once.content)
    expect(twice.status).toBe("unchanged")
    expect(twice.content).toBe(once.content)
  })

  test("reports a conflict for a loader that isn't the fallback route loader", () => {
    const content = `export const loader = () => {
  throw new Response("Not Found", {status: 404})
}
`
    expect(transformFallbackRoute(content)).toEqual({
      content,
      reason:
        "replace the existing loader with createFallbackRouteLoader(...) and add createFallbackRouteMiddleware(...) to the middleware export, both with the same arguments",
      status: "conflict",
    })
  })

  test("reports a conflict for a loader that isn't exported", () => {
    const content = `const loader = () => null\n`
    expect(transformFallbackRoute(content).status).toBe("conflict")
  })

  test("reports a conflict for inline middleware arguments", () => {
    const content = `import {createFallbackRouteMiddleware} from "@qualcomm-ui/react-router-utils/node"

export const middleware = [createFallbackRouteMiddleware({exports: undefined})]
`
    expect(transformFallbackRoute(content).status).toBe("conflict")
  })

  test("reports a conflict when an import name is already taken", () => {
    const content = `import {siteData} from "./site-data"\n`
    expect(transformFallbackRoute(content).status).toBe("conflict")
  })

  test("reuses an existing fallbackRouteArgs constant", () => {
    const content = `const fallbackRouteArgs = {}\n`
    expect(transformFallbackRoute(content).content).toContain(
      "export const loader = createFallbackRouteLoader(fallbackRouteArgs)",
    )
  })
})

describe("fallbackRoute codemod", () => {
  let cwd: string
  let routeFile: string

  function writeConfig(content: string, path = "qui-docs.config.ts"): string {
    const file = join(cwd, path)
    mkdirSync(dirname(file), {recursive: true})
    writeFileSync(file, content)
    return file
  }

  function writeRoute(content: string): void {
    mkdirSync(dirname(routeFile), {recursive: true})
    writeFileSync(routeFile, content)
  }

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "fallback-route-"))
    routeFile = join(cwd, "src/routes/$.tsx")
    writeConfig(`export default {appDirectory: "src"}\n`)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  test("creates the fallback route in the configured routes directory", async () => {
    const results = await fallbackRoute.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: routeFile,
        message: "created the fallback route",
        status: "updated",
      },
    ])
    expect(readFileSync(routeFile, "utf-8")).toBe(
      readMock("expected", "empty.tsx"),
    )
  })

  test("adds the loader to an existing fallback route", async () => {
    writeRoute(readMock("original", "middleware-args.tsx"))

    const results = await fallbackRoute.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: routeFile,
        message: "added the fallback route loader",
        status: "updated",
      },
    ])
    expect(readFileSync(routeFile, "utf-8")).toBe(
      readMock("expected", "middleware-args.tsx"),
    )
  })

  test("resolves appDirectory from the project root for nested configs", async () => {
    rmSync(join(cwd, "qui-docs.config.ts"))
    writeConfig(
      `export default {appDirectory: "src"}\n`,
      "src/qui-docs.config.ts",
    )

    const results = await fallbackRoute.run({cwd, dryRun: false})

    expect(results[0].file).toBe(routeFile)
    expect(existsSync(routeFile)).toBe(true)
  })

  test("leaves a migrated fallback route alone", async () => {
    const content = readMock("expected", "already-migrated.tsx")
    writeRoute(content)

    const results = await fallbackRoute.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: routeFile,
        message: "skipped, already exports the fallback route loader",
        status: "unchanged",
      },
    ])
    expect(readFileSync(routeFile, "utf-8")).toBe(content)
  })

  test("doesn't write in dry-run mode", async () => {
    const original = readMock("original", "middleware-args.tsx")
    writeRoute(original)

    const results = await fallbackRoute.run({cwd, dryRun: true})

    expect(results[0]).toMatchObject({
      message: "would add the fallback route loader",
      status: "updated",
    })
    expect(readFileSync(routeFile, "utf-8")).toBe(original)
  })

  test("doesn't create the route in dry-run mode", async () => {
    const results = await fallbackRoute.run({cwd, dryRun: true})

    expect(results[0].status).toBe("updated")
    expect(existsSync(routeFile)).toBe(false)
  })

  test("reports a conflict when the routes directory can't be resolved", async () => {
    const configFile = writeConfig(
      `export default {appDirectory: process.env.APP_DIR}\n`,
    )

    const results = await fallbackRoute.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: configFile,
        message:
          "update manually: couldn't read appDirectory or pageDirectory, create $.tsx in the routes directory",
        status: "conflict",
      },
    ])
  })

  test("does nothing without a qui-docs config", async () => {
    rmSync(join(cwd, "qui-docs.config.ts"))
    expect(await fallbackRoute.run({cwd, dryRun: false})).toEqual([])
  })

  test.each(["empty.tsx", "middleware-args.tsx"])(
    "the qui-docs codemods fully migrate %s",
    async (file) => {
      const original = readMock("original", file)
      if (original) {
        writeRoute(original)
      }

      for (const codemod of quiDocs.codemods) {
        await codemod.run({cwd, dryRun: false})
      }

      expect(readFileSync(routeFile, "utf-8")).toBe(
        readMock("expected", "already-migrated.tsx"),
      )
    },
  )
})

describe("qui-docs migration plan", () => {
  test.each([1, 2, 3])(
    "runs the fallback route codemods for react-router-utils v%i",
    (major) => {
      const plan = planMigration(
        quiDocs.codemods,
        new Map([["@qualcomm-ui/react-router-utils", major]]),
      )
      expect(plan.steps.map((step) => step.codemod.name)).toEqual([
        "fallback-route",
        "not-found-route",
        "fallback-route-middleware",
      ])
      expect(plan.majors.get("@qualcomm-ui/react-router-utils")).toBe(3)
    },
  )

  test("skips the fallback route codemods without react-router-utils", () => {
    const plan = planMigration(
      quiDocs.codemods,
      new Map([
        ["@qualcomm-ui/mdx-vite", 4],
        ["@qualcomm-ui/react-mdx", 3],
      ]),
    )
    expect(plan.steps.map((step) => step.codemod.name)).toEqual([
      "docs-context-names",
      "remove-open-web-ui",
      "validate-page-links",
    ])
  })
})
