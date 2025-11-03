import {existsSync, readFileSync} from "node:fs"
import {dirname, join, parse} from "node:path"

function readPackageJson(p: string) {
  try {
    return JSON.parse(readFileSync(p, "utf8"))
  } catch {
    return null
  }
}

export function findNearestPackageJson(file: string) {
  let dir = dirname(file)
  while (parse(dir).root !== dir) {
    const p = join(dir, "package.json")
    if (existsSync(p)) {
      return readPackageJson(p)
    }
    dir = dirname(dir)
  }
  return null
}
