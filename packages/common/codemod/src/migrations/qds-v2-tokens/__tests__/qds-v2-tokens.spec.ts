import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {dirname, join} from "node:path"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {MigrationCancelledError} from "../../migration-cancelled-error.js"
import {qdsV2TokensCodemod} from "../qds-v2-tokens.js"

describe("qdsV2Tokens codemod", () => {
  let cwd: string
  let sourceFile: string
  const packageJson = `{\n  "name": "app"\n}\n`

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "qds-v2-tokens-"))
    mkdirSync(join(cwd, "src"), {recursive: true})
    writeFileSync(join(cwd, "package.json"), packageJson)
    sourceFile = join(cwd, "src/styles.css")
    writeFileSync(sourceFile, `a { gap: var(--spacing-40); }\n`)
  })

  afterEach(() => {
    rmSync(cwd, {force: true, recursive: true})
  })

  function readPackageJson() {
    return JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"))
  }

  test("renames the tokens and records the run", async () => {
    const results = await qdsV2TokensCodemod.run({cwd, dryRun: false})

    expect(results).toEqual([
      {file: sourceFile, message: "renamed 1 token", status: "updated"},
      {
        file: join(cwd, "package.json"),
        message:
          "recorded qds-v2-tokens in qui.completedMigrations, so that running the codemod again doesn't rename the new tokens",
        status: "updated",
      },
    ])
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-100); }\n`,
    )
    expect(readPackageJson()).toEqual({
      name: "app",
      qui: {
        completedMigrations: ["qds-v2-tokens"],
        note: "Managed by @qualcomm-ui/codemod to track applied migrations. Do not edit or remove.",
      },
    })
  })

  test("doesn't rename the new tokens on a second run", async () => {
    await qdsV2TokensCodemod.run({cwd, dryRun: false})
    const packageJsonAfterFirstRun = readFileSync(
      join(cwd, "package.json"),
      "utf-8",
    )
    const results = await qdsV2TokensCodemod.run({cwd, dryRun: false})

    expect(results).toEqual([
      {
        file: sourceFile,
        message: "no legacy tokens found",
        status: "unchanged",
      },
    ])
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-100); }\n`,
    )
    expect(readFileSync(join(cwd, "package.json"), "utf-8")).toBe(
      packageJsonAfterFirstRun,
    )
  })

  test("respects a record in an ancestor package.json", async () => {
    const app = join(cwd, "apps/web")
    mkdirSync(join(app, "src"), {recursive: true})
    writeFileSync(join(app, "package.json"), packageJson)
    const appFile = join(app, "src/styles.css")
    writeFileSync(appFile, `a { gap: var(--spacing-100); }\n`)
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({qui: {completedMigrations: ["qds-v2-tokens"]}}),
    )

    const results = await qdsV2TokensCodemod.run({cwd: app, dryRun: false})

    expect(results.map((result) => result.status)).toEqual(["unchanged"])
    expect(readFileSync(appFile, "utf-8")).toBe(
      `a { gap: var(--spacing-100); }\n`,
    )
    expect(readFileSync(join(app, "package.json"), "utf-8")).toBe(packageJson)
  })

  test("respects a record in a nested package.json when run from the root", async () => {
    const app = join(cwd, "apps/web")
    mkdirSync(join(app, "src"), {recursive: true})
    writeFileSync(join(app, "package.json"), packageJson)
    const appFile = join(app, "src/styles.css")
    writeFileSync(appFile, `a { gap: var(--spacing-40); }\n`)

    await qdsV2TokensCodemod.run({cwd: app, dryRun: false})
    const results = await qdsV2TokensCodemod.run({cwd, dryRun: false})

    expect(results.map(({file, status}) => [file, status])).toEqual([
      [appFile, "unchanged"],
      [sourceFile, "updated"],
      [join(cwd, "package.json"), "updated"],
    ])
    expect(readFileSync(appFile, "utf-8")).toBe(
      `a { gap: var(--spacing-100); }\n`,
    )
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-100); }\n`,
    )
  })

  test("cancels the migration when a file uses steps unique to the new scale", async () => {
    const card = join(cwd, "src/card.tsx")
    writeFileSync(card, `<div className="md:-mt-qds-1000 p-qds-40" />\n`)
    writeFileSync(
      join(cwd, "src/other.css"),
      `a { gap: var(--spacing-25); width: var(--sizing-900); }\n`,
    )

    const run = qdsV2TokensCodemod.run({cwd, dryRun: false})

    await expect(run).rejects.toThrow(MigrationCancelledError)
    await expect(run).rejects.toThrow(
      "src/card.tsx: md:-mt-qds-1000\n  src/other.css: --spacing-25, --sizing-900\n",
    )
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-40); }\n`,
    )
    expect(readFileSync(card, "utf-8")).toBe(
      `<div className="md:-mt-qds-1000 p-qds-40" />\n`,
    )
    expect(readFileSync(join(cwd, "package.json"), "utf-8")).toBe(packageJson)
  })

  test("cancels the migration in dry-run mode", async () => {
    writeFileSync(join(cwd, "src/other.css"), `a { gap: var(--spacing-25); }\n`)

    await expect(qdsV2TokensCodemod.run({cwd, dryRun: true})).rejects.toThrow(
      MigrationCancelledError,
    )
  })

  test("cancels the migration for steps unique to the new scale in recorded files", async () => {
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({qui: {completedMigrations: ["qds-v2-tokens"]}}),
    )
    writeFileSync(join(cwd, "src/other.css"), `a { gap: var(--spacing-25); }\n`)

    await expect(qdsV2TokensCodemod.run({cwd, dryRun: false})).rejects.toThrow(
      MigrationCancelledError,
    )
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-40); }\n`,
    )
  })

  test("keeps ambiguous steps in projects migrated by hand with force", async () => {
    writeFileSync(sourceFile, `a { gap: var(--spacing-100); }\n`)
    writeFileSync(join(cwd, "src/other.css"), `a { gap: var(--spacing-25); }\n`)

    const results = await qdsV2TokensCodemod.run({
      cwd,
      dryRun: false,
      force: true,
    })

    expect(results.map((result) => result.status)).toEqual([
      "unchanged",
      "unchanged",
    ])
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-100); }\n`,
    )
    expect(readFileSync(join(cwd, "package.json"), "utf-8")).toBe(packageJson)
  })

  test("doesn't write in dry-run mode", async () => {
    const results = await qdsV2TokensCodemod.run({cwd, dryRun: true})

    expect(results.map((result) => result.message)).toEqual([
      "would rename 1 token",
      "would record qds-v2-tokens in qui.completedMigrations, so that running the codemod again doesn't rename the new tokens",
    ])
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-40); }\n`,
    )
    expect(readFileSync(join(cwd, "package.json"), "utf-8")).toBe(packageJson)
  })

  test("ignores node_modules and changelogs", async () => {
    const dependency = join(cwd, "node_modules/dep/styles.css")
    mkdirSync(dirname(dependency), {recursive: true})
    writeFileSync(dependency, `a { gap: var(--spacing-40); }\n`)
    writeFileSync(join(cwd, "CHANGELOG.md"), "Renamed `--spacing-40`.\n")

    const results = await qdsV2TokensCodemod.run({cwd, dryRun: false})

    expect(results.map((result) => result.file)).toEqual([
      sourceFile,
      join(cwd, "package.json"),
    ])
    expect(readFileSync(dependency, "utf-8")).toBe(
      `a { gap: var(--spacing-40); }\n`,
    )
  })
  test("renames the Tailwind utilities once across runs", async () => {
    const card = join(cwd, "src/card.tsx")
    writeFileSync(card, `<div className="p-qds-40" />\n`)

    await qdsV2TokensCodemod.run({cwd, dryRun: false})
    await qdsV2TokensCodemod.run({cwd, dryRun: false})

    expect(readFileSync(card, "utf-8")).toBe(`<div className="p-qds-100" />\n`)
    expect(readPackageJson().qui.completedMigrations).toEqual(["qds-v2-tokens"])
  })
})
