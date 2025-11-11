import {cpSync, mkdirSync, readdirSync, rmSync} from "node:fs"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {describe, test} from "vitest"

import {transformTs} from "../../../transformers"
import {reactTableTransforms} from "../react-table"

const __dirname = dirname(fileURLToPath(import.meta.url))

const mockTestDir = resolve(__dirname, "./mocks")

const dirs = {
  actual: resolve(mockTestDir, "actual"),
  expected: resolve(mockTestDir, "expected"),
  original: resolve(mockTestDir, "original"),
}

function before() {
  rmSync(dirs.actual, {force: true, recursive: true})
  mkdirSync(dirs.actual)
  cpSync(dirs.original, dirs.actual, {force: true, recursive: true})
}
before()

describe("react-table-migrations", () => {
  const files = readdirSync(dirs.actual).filter((file) => file.endsWith(".tsx"))

  for (const file of files) {
    test(file, async () => {
      transformTs(resolve(dirs.actual, file), reactTableTransforms)
    })
  }
})
