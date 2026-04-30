// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {ModuleKind, Project, ScriptTarget} from "ts-morph"

import {applyFixEdits} from "../../src/apply-fixes"
import {createRuleContext} from "../../src/rules/context"
import {buildRenderGraph} from "../../src/rules/render-graph"
import type {FixEdit, QuiAuditRule, RuleFinding} from "../../src/rules/types"

export interface RunRuleResult {
  findings: RuleFinding[]
  project: Project
}

/**
 * Runs a single rule against a set of in-memory source files. Returns the
 * rule's findings (violation + optional fix edits) for assertion.
 *
 * File paths may be relative; an in-memory project is built rooted at `/`.
 */
export function runRule(
  rule: QuiAuditRule,
  files: Record<string, string>,
): RunRuleResult {
  const project = new Project({
    compilerOptions: {
      jsx: 2,
      module: ModuleKind.ESNext,
      strict: true,
      target: ScriptTarget.ES2022,
    },
    skipFileDependencyResolution: true,
    useInMemoryFileSystem: true,
  })

  for (const [path, source] of Object.entries(files)) {
    const normalized = path.startsWith("/") ? path : `/${path}`
    project.createSourceFile(normalized, source)
  }

  const renderGraph = buildRenderGraph(project)
  const context = createRuleContext({project, renderGraph, rule})
  const findings = rule.check(context)

  return {findings, project}
}

/**
 * Convenience helper for codemod fixtures: runs the rule, collects all fix
 * edits for a given file, applies them, and returns the resulting source.
 */
export function applyAllFixesToFile(
  rule: QuiAuditRule,
  files: Record<string, string>,
  filePath: string,
): string {
  const {findings, project} = runRule(rule, files)
  const normalized = filePath.startsWith("/") ? filePath : `/${filePath}`
  const sourceFile = project.getSourceFileOrThrow(normalized)
  const fileEdits = collectEditsForFile(findings, normalized)
  return applyFixEdits(sourceFile.getFullText(), fileEdits)
}

function collectEditsForFile(
  findings: readonly RuleFinding[],
  filePath: string,
): FixEdit[] {
  const edits: FixEdit[] = []
  for (const finding of findings) {
    if (!finding.fix) {
      continue
    }
    for (const edit of finding.fix) {
      if (edit.file === filePath) {
        edits.push(edit)
      }
    }
  }
  return edits
}
