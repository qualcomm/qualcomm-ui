import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import {tmpdir} from "node:os"
import {join} from "node:path"
import {afterEach, beforeEach, describe, expect, test} from "vitest"

import {
  addMigrationRecord,
  createMigrationRecordLookup,
} from "../migration-record.js"

const NOTE =
  "Managed by @qualcomm-ui/codemod to track applied migrations. Do not edit or remove."

describe("migration record", () => {
  let root: string
  let app: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "migration-record-"))
    app = join(root, "packages/app")
    mkdirSync(join(app, "src"), {recursive: true})
  })

  afterEach(() => {
    rmSync(root, {force: true, recursive: true})
  })

  function writePackageJson(dir: string, value: unknown) {
    writeFileSync(join(dir, "package.json"), `${JSON.stringify(value)}\n`)
  }

  function readPackageJson(dir: string) {
    return JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"))
  }

  test("records the codemod", async () => {
    writePackageJson(root, {name: "root"})

    await addMigrationRecord(root, "a")
    await addMigrationRecord(root, "b")

    expect(readPackageJson(root)).toEqual({
      name: "root",
      qui: {completedMigrations: ["a", "b"], note: NOTE},
    })
  })

  test("doesn't record a codemod twice", async () => {
    writePackageJson(root, {qui: {completedMigrations: ["a"]}})
    const content = readFileSync(join(root, "package.json"), "utf-8")

    await addMigrationRecord(root, "a")

    expect(readFileSync(join(root, "package.json"), "utf-8")).toBe(content)
  })

  test("resolves false for directories without a record", async () => {
    writePackageJson(root, {name: "root"})

    expect(await createMigrationRecordLookup("a")(join(app, "src"))).toBe(false)
  })

  test("resolves a record in an ancestor directory", async () => {
    writePackageJson(root, {qui: {completedMigrations: ["a"]}})
    writePackageJson(app, {name: "app"})
    const lookup = createMigrationRecordLookup("a")

    expect(await lookup(join(app, "src"))).toBe(true)
    expect(await lookup(root)).toBe(true)
  })

  test("resolves a record in a nested package only below it", async () => {
    writePackageJson(root, {name: "root"})
    writePackageJson(app, {qui: {completedMigrations: ["a"]}})
    const lookup = createMigrationRecordLookup("a")

    expect(await lookup(join(app, "src"))).toBe(true)
    expect(await lookup(root)).toBe(false)
  })

  test("ignores entries that aren't strings and records that aren't arrays", async () => {
    writePackageJson(root, {qui: {completedMigrations: [1, {a: true}]}})
    writePackageJson(app, {qui: {completedMigrations: {a: 1}}})
    const lookup = createMigrationRecordLookup("a")

    expect(await lookup(root)).toBe(false)
    expect(await lookup(join(app, "src"))).toBe(false)
  })
})
