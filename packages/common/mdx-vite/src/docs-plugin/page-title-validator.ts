// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import chalk from "chalk"
import type {Root, RootContent} from "mdast"

import type {LintSeverity} from "./config/index.js"

export interface PageTitleIssue {
  line?: number
  reason: "extra-h1" | "missing-title"
  sourceFile: string
  sourcePathname: string
}

/**
 * Frontmatter and ESM statements are allowed before the page title.
 */
function isPreamble(node: RootContent): boolean {
  return node.type === "yaml" || node.type === "mdxjsEsm"
}

/**
 * Validates that the page starts with a single h1 title, like
 * `# {frontmatter.title}`, and that no other h1 headings follow it. Expects the
 * raw MDX tree, before JSX is removed, so that JSX placed above the title is
 * reported.
 */
export function validatePageTitle(
  tree: Root,
  sourceFile: string,
  sourcePathname: string,
): PageTitleIssue[] {
  const content = tree.children.filter((node) => !isPreamble(node))
  const [first, ...rest] = content
  if (!first) {
    return []
  }

  const issues: PageTitleIssue[] = []
  const hasTitle = first.type === "heading" && first.depth === 1

  if (!hasTitle) {
    issues.push({
      line: first.position?.start.line,
      reason: "missing-title",
      sourceFile,
      sourcePathname,
    })
  }

  for (const node of hasTitle ? rest : content) {
    if (node.type === "heading" && node.depth === 1) {
      issues.push({
        line: node.position?.start.line,
        reason: "extra-h1",
        sourceFile,
        sourcePathname,
      })
    }
  }

  return issues
}

/**
 * Logs page title issues to the console grouped by source file.
 */
export function reportPageTitleIssues(
  issues: PageTitleIssue[],
  severity: LintSeverity,
): void {
  if (issues.length === 0) {
    return
  }

  const color = severity === "error" ? chalk.redBright : chalk.yellowBright
  console.debug(
    `\n${color.bold(`Found ${issues.length} page title issue${issues.length === 1 ? "" : "s"}:`)}`,
  )

  const grouped = new Map<string, PageTitleIssue[]>()
  for (const issue of issues) {
    const existing = grouped.get(issue.sourceFile) ?? []
    existing.push(issue)
    grouped.set(issue.sourceFile, existing)
  }

  for (const [sourceFile, fileIssues] of grouped) {
    console.debug(`\n  ${chalk.blueBright.bold(fileIssues[0].sourcePathname)}`)
    for (const issue of fileIssues) {
      const location = issue.line ? `${sourceFile}:${issue.line}` : sourceFile
      const reason =
        issue.reason === "missing-title"
          ? "page must start with an h1 title, e.g. `# {frontmatter.title}`"
          : "only the page title may be an h1, use h2 or lower"
      console.debug(`    ${chalk.red("x")} ${location} — ${reason}`)
    }
  }

  console.debug("")
}
