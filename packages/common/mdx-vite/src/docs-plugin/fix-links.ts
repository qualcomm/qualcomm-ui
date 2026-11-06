// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import chalk from "chalk"
import {glob} from "glob"
import type {Link} from "mdast"
import {readFile, writeFile} from "node:fs/promises"
import {relative, resolve} from "node:path"
import {cwd} from "node:process"
import {visit} from "unist-util-visit"

import {ConfigLoader} from "./config/index.js"
import {getFileLinkSuggestion, resolveLink} from "./link-validator.js"
import {createRemarkProcessor} from "./markdown/index.js"
import {isInRoutesDir, isMdxFileLink} from "./mdx-file-links.js"
import {fixPath} from "./path-utils.js"
import {SearchIndexer} from "./search-indexer.js"

export interface FileLinkFix {
  from: string
  line: number
  to: string
}

export interface FileLinkFixResult {
  contents: string
  fixes: FileLinkFix[]
  /**
   * Links with a suggestion whose destination could not be located verbatim in
   * the source, e.g. because it contains escapes or character references.
   */
  skipped: FileLinkFix[]
}

/**
 * Rewrites URL-path links to MDX pages as relative `.mdx` file links. Only the
 * link destination is replaced, so the rest of the file is left untouched.
 *
 * @param pageFiles MDX source file path for each page pathname.
 */
export function fixFileLinks(
  contents: string,
  sourceFile: string,
  sourcePathname: string,
  pageFiles: Readonly<Record<string, string>>,
): FileLinkFixResult {
  const tree = createRemarkProcessor({
    frontmatter: true,
    gfm: true,
    mdx: true,
  }).parse(contents)

  const edits: {end: number; start: number; to: string}[] = []
  const fixes: FileLinkFix[] = []
  const skipped: FileLinkFix[] = []

  visit(tree, "link", (node: Link) => {
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    if (start === undefined || end === undefined || isMdxFileLink(node.url)) {
      return
    }

    const resolved = resolveLink(node.url, sourcePathname)
    if (!resolved) {
      return
    }

    const suggestion = getFileLinkSuggestion(
      {
        fragment: resolved.fragment,
        sourceFile,
        sourcePathname,
        targetPathname: resolved.pathname,
        url: node.url,
      },
      pageFiles,
    )
    if (!suggestion) {
      return
    }

    const fix = {
      from: node.url,
      line: node.position!.start.line,
      to: suggestion,
    }
    const source = contents.slice(start, end)
    const destinationOpen = source.lastIndexOf("](")
    const urlIndex =
      destinationOpen === -1
        ? -1
        : source.indexOf(node.url, destinationOpen + 2)
    const prefix =
      urlIndex === -1 ? "" : source.slice(destinationOpen + 2, urlIndex).trim()
    if (urlIndex === -1 || (prefix !== "" && prefix !== "<")) {
      skipped.push(fix)
      return
    }

    edits.push({
      end: start + urlIndex + node.url.length,
      start: start + urlIndex,
      to: suggestion,
    })
    fixes.push(fix)
  })

  // edits are collected in document order; apply from the end to keep offsets valid
  let output = contents
  for (const edit of edits.reverse()) {
    output = output.slice(0, edit.start) + edit.to + output.slice(edit.end)
  }

  return {contents: output, fixes, skipped}
}

export function addFixLinksCommand(): void {
  program
    .command("fix-links")
    .description(
      "Rewrites URL-path links to MDX pages as relative .mdx file links, which also resolve in GitHub's markdown viewer",
    )
    .option(
      "-c, --config-file <configFile>",
      "Path to the qui-docs.config.ts config file",
    )
    .option("--dry-run", "Report the changes without writing files")
    .action(async (options) => {
      try {
        const resolvedConfig = new ConfigLoader({
          configFile: options.configFile,
        }).loadConfig()
        const routesDir = fixPath(
          resolve(resolvedConfig.appDirectory, resolvedConfig.pageDirectory),
        )
        const indexer = new SearchIndexer({
          ...resolvedConfig,
          lint: {brokenLinks: "off", fileLinks: "off", pageTitle: "off"},
          srcDir: fixPath(resolve(cwd(), resolvedConfig.appDirectory)),
          typeDocProps: {},
        })
        const files = await glob(
          [`${routesDir}/**/*.mdx`, `${routesDir}/**/*.tsx`],
          {absolute: true, cwd: cwd()},
        )
        indexer.buildIndex(files, false)

        const pageFiles = indexer.pageFiles
        let fixCount = 0
        let fileCount = 0
        const skipped: string[] = []
        const sharedFiles: string[] = []

        await Promise.all(
          Object.entries(pageFiles).map(async ([pathname, filePath]) => {
            const displayPath = fixPath(relative(cwd(), filePath))
            if (!isInRoutesDir(filePath, indexer.fileLinkRoutesDir)) {
              sharedFiles.push(displayPath)
              return
            }

            const contents = await readFile(filePath, "utf-8")
            const result = fixFileLinks(contents, filePath, pathname, pageFiles)

            for (const fix of result.skipped) {
              skipped.push(`${displayPath}:${fix.line} ${fix.from}`)
            }
            if (!result.fixes.length) {
              return
            }

            fixCount += result.fixes.length
            fileCount++
            if (!options.dryRun) {
              await writeFile(filePath, result.contents, "utf-8")
            }

            const lines = [`\n  ${chalk.blueBright.bold(displayPath)}`]
            for (const fix of result.fixes) {
              lines.push(
                `    ${chalk.dim(`${fix.line}:`)} ${fix.from} -> ${chalk.greenBright(fix.to)}`,
              )
            }
            console.log(lines.join("\n"))
          }),
        )

        const verb = options.dryRun ? "Would fix" : "Fixed"
        console.log(
          `\n${chalk.bold(`${verb} ${fixCount} link${fixCount === 1 ? "" : "s"} in ${fileCount} file${fileCount === 1 ? "" : "s"}.`)}`,
        )

        if (sharedFiles.length) {
          console.log(
            `\n${chalk.yellowBright.bold(`Skipped ${sharedFiles.length} page${sharedFiles.length === 1 ? "" : "s"} symlinked from outside the routes directory. Shared pages must keep using URL paths:`)}`,
          )
          for (const file of sharedFiles.sort()) {
            console.log(`  ${file}`)
          }
        }

        if (skipped.length) {
          console.log(
            `\n${chalk.yellowBright.bold(`Skipped ${skipped.length} link${skipped.length === 1 ? "" : "s"} that could not be rewritten automatically:`)}`,
          )
          for (const entry of skipped.sort()) {
            console.log(`  ${entry}`)
          }
        }
      } catch (error) {
        console.error(
          "Fix Links Error:",
          error instanceof Error ? error.message : String(error),
        )
        process.exit(1)
      }
    })
}
