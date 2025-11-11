import {readFileSync, writeFileSync} from "node:fs"

export function readJsonSync(path: string): void {
  return JSON.parse(readFileSync(path, "utf-8"))
}

export function writeJsonSync(path: string, contents: any): void {
  return writeFileSync(path, JSON.stringify(contents, null, 2), "utf-8")
}
