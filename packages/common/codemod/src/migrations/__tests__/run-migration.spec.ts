import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest"

import {qdsV2Tokens} from "../qds-v2-tokens/index.js"
import {runMigration} from "../run-migration.js"

describe("runMigration", () => {
  let cwd: string
  let sourceFile: string

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {})
    vi.spyOn(console, "warn").mockImplementation(() => {})
    cwd = mkdtempSync(join(tmpdir(), "run-migration-"))
    mkdirSync(join(cwd, "src"), {recursive: true})
    writeFileSync(
      join(cwd, "package.json"),
      `${JSON.stringify(
        {
          dependencies: {"@qualcomm-ui/qds-core": "^1.39.0"},
          name: "app",
        },
        null,
        4,
      )}\n`,
    )
    sourceFile = join(cwd, "src/styles.css")
    writeFileSync(sourceFile, `a { gap: var(--spacing-40); }\n`)
  })

  afterEach(() => {
    process.exitCode = undefined
    vi.restoreAllMocks()
    rmSync(cwd, {force: true, recursive: true})
  })

  function readPackageJson(): string {
    return readFileSync(join(cwd, "package.json"), "utf-8")
  }

  test("keeps package.json changes made by codemods", async () => {
    await runMigration(qdsV2Tokens, {dir: cwd})

    expect(readPackageJson()).toBe(
      `${JSON.stringify(
        {
          dependencies: {"@qualcomm-ui/qds-core": "^2.0.0"},
          name: "app",
          qui: {
            note: "Managed by @qualcomm-ui/codemod to track applied migrations. Do not edit or remove.",
            // The written package.json lists the note first.
            // eslint-disable-next-line perfectionist/sort-objects
            completedMigrations: ["qds-v2-tokens"],
          },
        },
        null,
        4,
      )}\n`,
    )
  })

  test("leaves the project unchanged when run again", async () => {
    await runMigration(qdsV2Tokens, {dir: cwd})
    const packageJson = readPackageJson()
    const styles = readFileSync(sourceFile, "utf-8")

    await runMigration(qdsV2Tokens, {dir: cwd})

    expect(readPackageJson()).toBe(packageJson)
    expect(readFileSync(sourceFile, "utf-8")).toBe(styles)
    expect(styles).toBe(`a { gap: var(--spacing-100); }\n`)
  })

  test("shows the group warning before running", async () => {
    await runMigration(qdsV2Tokens, {dir: cwd, dryRun: true})

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(qdsV2Tokens.warning!),
    )
  })

  test("doesn't write in dry-run mode", async () => {
    const packageJson = readPackageJson()

    await runMigration(qdsV2Tokens, {dir: cwd, dryRun: true})

    expect(readPackageJson()).toBe(packageJson)
    expect(readFileSync(sourceFile, "utf-8")).toBe(
      `a { gap: var(--spacing-40); }\n`,
    )
  })

  describe("when a codemod cancels the migration", () => {
    let packageJson: string

    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {})
      writeFileSync(
        join(cwd, "src/migrated.css"),
        `a { gap: var(--spacing-25); }\n`,
      )
      packageJson = readPackageJson()
    })

    test("leaves the project unchanged and fails", async () => {
      await runMigration(qdsV2Tokens, {dir: cwd})

      expect(process.exitCode).toBe(1)
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Migration cancelled:"),
      )
      expect(readPackageJson()).toBe(packageJson)
      expect(readFileSync(sourceFile, "utf-8")).toBe(
        `a { gap: var(--spacing-40); }\n`,
      )
    })

    test("runs the migration with force", async () => {
      await runMigration(qdsV2Tokens, {dir: cwd, force: true})

      expect(process.exitCode).toBeUndefined()
      expect(readFileSync(sourceFile, "utf-8")).toBe(
        `a { gap: var(--spacing-100); }\n`,
      )
      expect(JSON.parse(readPackageJson()).dependencies).toEqual({
        "@qualcomm-ui/qds-core": "^2.0.0",
      })
    })
  })

  describe("without the migrated packages", () => {
    beforeEach(() => {
      writeFileSync(join(cwd, "package.json"), `{\n  "name": "app"\n}\n`)
    })

    test("skips the codemods", async () => {
      await runMigration(qdsV2Tokens, {dir: cwd})

      expect(readFileSync(sourceFile, "utf-8")).toBe(
        `a { gap: var(--spacing-40); }\n`,
      )
      expect(readPackageJson()).toBe(`{\n  "name": "app"\n}\n`)
    })

    test("runs the codemods with force, without adding dependencies", async () => {
      await runMigration(qdsV2Tokens, {dir: cwd, force: true})

      expect(readFileSync(sourceFile, "utf-8")).toBe(
        `a { gap: var(--spacing-100); }\n`,
      )
      expect(JSON.parse(readPackageJson())).toEqual({
        name: "app",
        qui: {
          completedMigrations: ["qds-v2-tokens"],
          note: "Managed by @qualcomm-ui/codemod to track applied migrations. Do not edit or remove.",
        },
      })
    })

    test("doesn't rename tokens twice with force", async () => {
      await runMigration(qdsV2Tokens, {dir: cwd, force: true})
      await runMigration(qdsV2Tokens, {dir: cwd, force: true})

      expect(readFileSync(sourceFile, "utf-8")).toBe(
        `a { gap: var(--spacing-100); }\n`,
      )
    })
  })
})
