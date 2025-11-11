import {Command} from "@commander-js/extra-typings"
import ignore from "ignore"
import {access, readdir, readFile, writeFile} from "node:fs/promises"
import {extname, join, relative, resolve} from "node:path"
import {cwd} from "node:process"

interface AddHeaderConfig {
  directory: string
  sourceLicense?: string
  sourceUrl?: string
  type: "original" | "modified"
}

const QUALCOMM_HEADER = `// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear`

class LicenseHeaderManager {
  private ig: ReturnType<typeof ignore>
  private rootPath: string

  private constructor(rootPath: string, ig: ReturnType<typeof ignore>) {
    this.rootPath = rootPath
    this.ig = ig
  }

  static async create(rootPath: string): Promise<LicenseHeaderManager> {
    const ig = ignore()
    ig.add(["node_modules", ".git"])

    const ignoreFilePath = join(rootPath, ".licenseignore")

    try {
      await access(ignoreFilePath)
      const content = await readFile(ignoreFilePath, "utf-8")
      ig.add(content)
      console.log("Loaded .licenseignore patterns")
    } catch {
      // .licenseignore doesn't exist, use defaults only
    }

    return new LicenseHeaderManager(rootPath, ig)
  }

  private createModifiedHeader(
    sourceUrl: string,
    sourceLicense: string,
  ): string {
    return `// Modified from ${sourceUrl}
// ${sourceLicense}
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear`
  }

  private hasHeader(content: string): boolean {
    return content.includes("Copyright (c) Qualcomm Technologies, Inc.")
  }

  private isSupportedFile(filePath: string): boolean {
    const ext = extname(filePath)
    const supportedExts = [".ts", ".tsx", ".js", ".jsx", ".mjs"]
    return supportedExts.includes(ext)
  }

  private isIgnored(fullPath: string): boolean {
    const relativePath = relative(this.rootPath, fullPath)
    return this.ig.ignores(relativePath)
  }

  private async addHeaderToFile(
    filePath: string,
    config: AddHeaderConfig,
  ): Promise<boolean> {
    if (!this.isSupportedFile(filePath)) {
      return false
    }

    const content = await readFile(filePath, "utf-8")

    if (this.hasHeader(content)) {
      return false
    }

    const header =
      config.type === "original"
        ? QUALCOMM_HEADER
        : this.createModifiedHeader(config.sourceUrl, config.sourceLicense)

    const newContent = `${header}\n\n${content}`
    await writeFile(filePath, newContent, "utf-8")

    return true
  }

  private async checkHeaderInFile(filePath: string): Promise<boolean> {
    if (!this.isSupportedFile(filePath)) {
      return true
    }

    const content = await readFile(filePath, "utf-8")
    return this.hasHeader(content)
  }

  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = []
    const entries = await readdir(resolve(this.rootPath, dirPath), {
      withFileTypes: true,
    })

    for (const entry of entries) {
      const fullPath = resolve(this.rootPath, dirPath, entry.name)

      if (this.isIgnored(fullPath)) {
        continue
      }

      if (entry.isDirectory()) {
        files.push(...(await this.scanDirectory(fullPath)))
      } else if (entry.isFile() && this.isSupportedFile(fullPath)) {
        files.push(fullPath)
      }
    }

    return files
  }

  async addHeaders(config: AddHeaderConfig): Promise<number> {
    const files = await this.scanDirectory(config.directory)
    let count = 0

    for (const file of files) {
      const modified = await this.addHeaderToFile(file, config)
      if (modified) {
        console.log(`Added header to: ${file}`)
        count++
      }
    }

    return count
  }

  async checkHeaders(directory: string): Promise<string[]> {
    const files = await this.scanDirectory(directory)
    const missingHeaders: string[] = []

    for (const file of files) {
      const hasValidHeader = await this.checkHeaderInFile(file)
      if (!hasValidHeader) {
        const relativePath = relative(directory, file)
        missingHeaders.push(relativePath)
      }
    }

    return missingHeaders
  }
}

const program = new Command()
  .name("license-headers")
  .description("Manage copyright headers in source files")

program
  .command("add")
  .description("Add copyright headers to source files")
  .argument("<directory>", "Directory to scan")
  .option("--modified <source-url>", "Source URL for modified files")
  .option(
    "--license <license>",
    'License of source for modified files (e.g., "MIT License")',
  )
  .action(async (directory, options) => {
    const config: AddHeaderConfig = {directory, type: "original"}

    if (options.modified) {
      if (!options.license) {
        console.error("--license is required when using --modified")
        process.exit(1)
      }
      config.type = "modified"
      config.sourceUrl = options.modified
      config.sourceLicense = options.license
    }

    const manager = await LicenseHeaderManager.create(cwd())
    const count = await manager.addHeaders(config)
    console.log(`\nTotal files modified: ${count}`)
  })

program
  .command("check")
  .description("Check for missing copyright headers")
  .argument("<directory>", "Directory to scan")
  .action(async (directory) => {
    const manager = await LicenseHeaderManager.create(cwd())
    const missingHeaders = await manager.checkHeaders(directory)

    if (missingHeaders.length === 0) {
      console.log("✓ All files have copyright headers")
      process.exit(0)
    } else {
      console.error(
        `✗ ${missingHeaders.length} file(s) missing copyright headers:\n`,
      )
      missingHeaders.forEach((file) => console.error(`  ${file}`))
      process.exit(1)
    }
  })

program.parse()
