// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Project} from "ts-morph"

import {
  allRules,
  buildRenderGraph,
  createRuleContext,
  type FixEdit,
  type QuiAuditRule,
  type Violation,
} from "@qualcomm-ui/audit-mcp/rules"

export interface AuditInput {
  /**
   * Either an existing ts-morph project (preferred when already configured),
   * or a file map used to build an in-memory project for ad-hoc audits.
   */
  project: Project
  /** Optional filter: only run rules whose id is in the list. */
  ruleIds?: readonly string[]
  /** Optional rule override. Defaults to the bundled rules. */
  rules?: readonly QuiAuditRule[]
}

export interface AuditResult {
  /** Millisecond wall-clock duration for the audit. */
  elapsedMs: number
  /** Auto-fix edits, indexed by ruleId then by violation start-offset. */
  fixesByViolation: Map<string, FixEdit[]>
  /** Files the project saw (both user-declared and resolved by ts-morph). */
  scannedFiles: string[]
  violations: Violation[]
}

/**
 * Run the QUI audit rules against a ts-morph project. Returns violations and
 * their associated auto-fix edits.
 */
export function audit(input: AuditInput): AuditResult {
  const start = performance.now()
  const rules = selectRules(input.rules ?? allRules, input.ruleIds)
  const renderGraph = buildRenderGraph(input.project)

  const violations: Violation[] = []
  const fixesByViolation = new Map<string, FixEdit[]>()

  for (const rule of rules) {
    const context = createRuleContext({
      project: input.project,
      renderGraph,
      rule,
    })
    for (const finding of rule.check(context)) {
      violations.push(finding.violation)
      if (finding.fix && finding.fix.length > 0) {
        fixesByViolation.set(violationKey(finding.violation), finding.fix)
      }
    }
  }

  return {
    elapsedMs: performance.now() - start,
    fixesByViolation,
    scannedFiles: input.project
      .getSourceFiles()
      .map((source) => source.getFilePath()),
    violations,
  }
}

function selectRules(
  rules: readonly QuiAuditRule[],
  ruleIds: readonly string[] | undefined,
): readonly QuiAuditRule[] {
  if (!ruleIds || ruleIds.length === 0) {
    return rules
  }
  const allowed = new Set(ruleIds)
  return rules.filter((rule) => allowed.has(rule.id))
}

export function violationKey(violation: Violation): string {
  return `${violation.ruleId}@${violation.file}:${violation.nodeStart}`
}
