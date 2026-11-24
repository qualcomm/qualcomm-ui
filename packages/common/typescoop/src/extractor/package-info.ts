// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFile} from "node:fs/promises"
import {dirname, join, relative, sep} from "node:path"

export interface SourcePackage {
  packageName: string
  /**
   * Path of the file relative to the directory of its nearest named
   * `package.json`, using forward slashes.
   *
   * @example "src/menu/menu.types.ts"
   */
  packagePath: string
}

/**
 * Maps source files to the package that owns them. Lookups are synchronous so
 * that they can run inside checker traversal. Call {@link load} with every file
 * first.
 */
export class PackageResolver {
  private readonly dirs = new Map<string, Promise<string | undefined>>()
  private readonly roots = new Map<string, {dir: string; name: string}>()

  async load(fileNames: Iterable<string>): Promise<void> {
    const pending = [...new Set([...fileNames].map((file) => dirname(file)))]
    await Promise.all(pending.map((dir) => this.findPackage(dir)))
  }

  resolve(fileName: string): SourcePackage | undefined {
    const root = this.roots.get(dirname(fileName))
    if (!root) {
      return undefined
    }
    return {
      packageName: root.name,
      packagePath: relative(root.dir, fileName).split(sep).join("/"),
    }
  }

  private findPackage(dir: string): Promise<string | undefined> {
    let pending = this.dirs.get(dir)
    if (!pending) {
      pending = this.readPackage(dir)
      this.dirs.set(dir, pending)
    }
    return pending
  }

  /**
   * Resolves to the directory of the nearest `package.json` with a name. Unnamed
   * manifests, such as `{"type": "module"}` markers, are skipped.
   */
  private async readPackage(dir: string): Promise<string | undefined> {
    const name = await readFile(join(dir, "package.json"), "utf-8")
      .then((content) => JSON.parse(content).name as string | undefined)
      .catch(() => undefined)
    if (name) {
      this.roots.set(dir, {dir, name})
      return dir
    }
    const parent = dirname(dir)
    if (parent === dir) {
      return undefined
    }
    const found = await this.findPackage(parent)
    const root = found ? this.roots.get(found) : undefined
    if (root) {
      this.roots.set(dir, root)
    }
    return found
  }
}
