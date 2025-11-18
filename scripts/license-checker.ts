import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  spinner,
  text,
} from "@clack/prompts"
import {Command} from "@commander-js/extra-typings"
import ignore from "ignore"
import {access, readdir, readFile, writeFile} from "node:fs/promises"
import {extname, join, relative, resolve} from "node:path"
import {cwd} from "node:process"
import prettyMilliseconds from "pretty-ms"

interface AddHeadersConfig {
  directory: string
  sourceLicense?: string
  sourceUrl?: string
  type: "original" | "modified"
}

const nonPermissiveLicenses = [
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "SSPL-1.0",
  "EUPL-1.2",
  "LGPL-2.1",
  "LGPL-2.1-only",
  "LGPL-2.1-or-later",
  "LGPL-3.0",
  "LGPL-3.0-only",
  "LGPL-3.0-or-later",
  "MPL-2.0",
  "EPL-2.0",
  "CPL-1.0",
  "CDDL-1.0",
  "OSL-3.0",
  "CC-BY-SA-4.0",
  "RPL-1.5",
  "APSL-2.0",
]

interface LintResult {
  file: string
  hasCopyright: boolean
  hasLicense: boolean
  hasNonPermissiveLicense: boolean
  passed: boolean
}

interface LintResultMetrics {
  fileCount: number
  missingCopyrightCount: number
  missingLicenseCount: number
  nonPermissiveLicenseCount: number
  validCopyrightCount: number
  validLicenseCount: number
}

const QUALCOMM_COPYRIGHT =
  "Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries."
const REPO_LICENSE = "SPDX-License-Identifier: BSD-3-Clause-Clear"
const QUALCOMM_HEADER = `// ${QUALCOMM_COPYRIGHT}
// ${REPO_LICENSE}`

class LicenseHeaderManager {
  private ig: ReturnType<typeof ignore>
  private readonly rootPath: string

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
    } catch {}
    return new LicenseHeaderManager(rootPath, ig)
  }

  private createModifiedHeader(
    sourceUrl: string,
    sourceLicense: string,
  ): string {
    return `// Modified from ${sourceUrl}
// ${sourceLicense}
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// ${QUALCOMM_COPYRIGHT}
// ${REPO_LICENSE}`
  }

  private hasCopyright(content: string): boolean {
    return content.includes(QUALCOMM_COPYRIGHT)
  }

  private hasLicense(content: string): boolean {
    return content.includes(REPO_LICENSE)
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

  private parseFileForInsertion(content: string): {
    body: string
    prefix: string
  } {
    const lines = content.split("\n")
    let idx = 0

    if (lines[idx]?.startsWith("#!")) {
      idx++
    }

    while (idx < lines.length) {
      const trimmed = lines[idx].trim()
      if (trimmed === "" || trimmed.match(/^["']use .*["'];?$/)) {
        idx++
      } else {
        break
      }
    }

    const prefix = lines.slice(0, idx).join("\n")
    const body = lines.slice(idx).join("\n")

    return {body, prefix}
  }

  private stripExistingHeader(content: string): string {
    const lines = content.split("\n")
    const filteredLines = lines.filter(
      (line) =>
        !line.includes(QUALCOMM_COPYRIGHT) && !line.includes(REPO_LICENSE),
    )
    return filteredLines.join("\n")
  }

  private async addHeaderToFile(
    filePath: string,
    config: AddHeadersConfig,
  ): Promise<boolean> {
    if (!this.isSupportedFile(filePath)) {
      return false
    }

    const content = await readFile(filePath, "utf-8")

    if (this.hasCopyright(content) && this.hasLicense(content)) {
      return false
    }

    if (this.hasNonPermissiveLicense(content)) {
      console.error("Can't modify non-permissive license.")
      return false
    }

    const strippedContent = this.stripExistingHeader(content)

    const header =
      config.type === "original"
        ? QUALCOMM_HEADER
        : this.createModifiedHeader(config.sourceUrl, config.sourceLicense)

    const {body, prefix} = this.parseFileForInsertion(strippedContent)

    const newContent = prefix
      ? `${prefix}\n${header}\n\n${body}`
      : `${header}\n\n${body}`

    await writeFile(filePath, newContent, "utf-8")
    return true
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

  async addHeaders(config: AddHeadersConfig): Promise<number> {
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

  async addHeadersToFiles(
    files: string[],
    config: AddHeadersConfig,
  ): Promise<number> {
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

  private hasNonPermissiveLicense(fileContents: string) {
    return nonPermissiveLicenses.some((license) =>
      fileContents.includes(license),
    )
  }

  async getFilesWithoutHeaders(directory: string): Promise<string[]> {
    const lintedFiles = await this.lintFiles(directory)
    return lintedFiles.metrics.missingLicenseCount ||
      lintedFiles.metrics.missingCopyrightCount
      ? lintedFiles.results
          .filter((result) => !result.hasLicense || !result.hasCopyright)
          .map((result) => result.file)
      : []
  }

  async lintFiles(directory: string): Promise<{
    metrics: LintResultMetrics
    results: LintResult[]
  }> {
    const files = await this.scanDirectory(directory)
    const results: LintResult[] = []
    const metrics: LintResultMetrics = {
      fileCount: 0,
      missingCopyrightCount: 0,
      missingLicenseCount: 0,
      nonPermissiveLicenseCount: 0,
      validCopyrightCount: 0,
      validLicenseCount: 0,
    }

    for (const file of files) {
      metrics.fileCount++
      if (!this.isSupportedFile(file)) {
        continue
      }
      const content = await readFile(file, "utf-8")
      const result: LintResult = {
        file,
        hasCopyright: this.hasCopyright(content),
        hasLicense: this.hasLicense(content),
        hasNonPermissiveLicense: this.hasNonPermissiveLicense(content),
        passed: false,
      }

      if (result.hasNonPermissiveLicense) {
        metrics.nonPermissiveLicenseCount++
      }
      if (result.hasLicense) {
        metrics.validLicenseCount++
      } else {
        metrics.missingLicenseCount++
      }
      if (!result.hasCopyright) {
        metrics.missingCopyrightCount++
      } else {
        metrics.validCopyrightCount++
      }

      result.passed =
        !result.hasNonPermissiveLicense &&
        result.hasLicense &&
        result.hasCopyright
      results.push(result)
    }
    return {
      metrics,
      results,
    }
  }
}

const program = new Command()
  .name("license-headers")
  .description("Manage copyright headers in source files")

program
  .command("fix")
  .description("Add copyright headers to source files")
  .option("--directory <directory>", "Directory to scan", ".")
  .option("--modified <source-url>", "Source URL for modified files")
  .option(
    "--license <license>",
    'License of source for modified files (e.g., "MIT License")',
  )
  .option("--interactive", "Interactively select files")
  .action(async (options) => {
    const manager = await LicenseHeaderManager.create(cwd())
    if (options.interactive) {
      intro("License Header Manager")
      const invalidFiles = await manager.getFilesWithoutHeaders(
        options.directory,
      )
      if (invalidFiles.length === 0) {
        outro("All files already have headers")
        return
      }
      const selected = await multiselect({
        message: "Select files to add headers:",
        options: invalidFiles.map((file) => ({
          label: relative(options.directory, file),
          value: file,
        })),
        required: false,
      })
      if (isCancel(selected) || selected.length === 0) {
        cancel("Operation cancelled")
        process.exit(0)
      }
      let isModified: boolean | symbol = !!options.modified
      if (!isModified) {
        isModified = await confirm({
          initialValue: options.modified !== undefined,
          message: "Is this modified from another source?",
        })
        if (isCancel(isModified)) {
          cancel("Operation cancelled")
          process.exit(0)
        }
      }
      const config: AddHeadersConfig = {
        directory: options.directory,
        type: "original",
      }
      if (isModified) {
        const sourceUrl = await text({
          initialValue: options.modified,
          message: "Source URL:",
          placeholder: "https://github.com/example/repo",
          validate: (value) => {
            if (value.length === 0) {
              return "Source URL is required"
            }
            try {
              new URL(value)
              return undefined
            } catch {
              return "Invalid URL format"
            }
          },
        })
        if (isCancel(sourceUrl)) {
          cancel("Operation cancelled")
          process.exit(0)
        }
        const urlSpinner = spinner()
        urlSpinner.start("Verifying source URL")
        try {
          const response = await fetch(sourceUrl, {
            method: "HEAD",
            signal: AbortSignal.timeout(5000),
          })
          if (!response.ok) {
            urlSpinner.stop(`Warning: Source URL returned ${response.status}`)
          } else {
            urlSpinner.stop("Source URL verified")
          }
        } catch (error) {
          urlSpinner.stop(
            `Warning: Could not verify source URL (${error instanceof Error ? error.message : "unknown error"})`,
          )
        }
        const license = await text({
          initialValue: options.license,
          message: "Source license:",
          placeholder: "MIT License",
          validate: (value) =>
            value.length === 0 ? "License is required" : undefined,
        })
        if (isCancel(license)) {
          cancel("Operation cancelled")
          process.exit(0)
        }
        config.type = "modified"
        config.sourceUrl = sourceUrl
        config.sourceLicense = license
      }
      const clackSpinner = spinner()
      clackSpinner.start("Adding headers")
      const count = await manager.addHeadersToFiles(selected, config)
      clackSpinner.stop("Done")
      outro(`Modified ${count} file(s)`)
    } else {
      const config: AddHeadersConfig = {
        directory: options.directory,
        type: "original",
      }
      if (options.modified) {
        if (!options.license) {
          console.error("--license is required when using --modified")
          process.exit(1)
        }
        config.type = "modified"
        config.sourceUrl = options.modified
        config.sourceLicense = options.license
      }
      const count = await manager.addHeaders(config)
      console.log(`\nTotal files modified: ${count}`)
    }
  })

program
  .command("lint")
  .description("Check for missing copyright headers")
  .option("--directory <directory>", "Directory to scan", ".")
  .action(async ({directory}) => {
    const manager = await LicenseHeaderManager.create(cwd())
    const now = performance.mark("Checking headers")
    const {metrics, results} = await manager.lintFiles(directory)
    const headerCheckTime = performance.measure(
      "Checking headers",
      now,
    ).duration

    if (
      metrics.missingCopyrightCount === 0 &&
      metrics.missingLicenseCount === 0
    ) {
      console.log(
        `✓ Validated ${metrics.fileCount} files in ${prettyMilliseconds(headerCheckTime)}`,
      )
      process.exit(0)
    } else {
      const invalidFiles = results.filter((res) => !res.passed)
      console.error(`✗ ${invalidFiles.length} file(s):\n`)
      invalidFiles.forEach((result) =>
        console.error(`  ./${relative(directory, result.file)}`),
      )
      process.exit(1)
    }
  })

program.parse()
