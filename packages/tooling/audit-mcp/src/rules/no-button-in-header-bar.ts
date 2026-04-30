// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type JsxElement, type JsxSelfClosingElement, SyntaxKind} from "ts-morph"

import type {QuiAuditRule, RuleContext, RuleFinding} from "./types"

const HEADER_BAR_ANCESTOR_TAGS = ["HeaderBar", "HeaderBar.Root"] as const

const REPLACEMENT_TAG = "HeaderBar.ActionButton"

export const noButtonInHeaderBar: QuiAuditRule = {
  category: "composition",
  check(context: RuleContext): RuleFinding[] {
    const findings: RuleFinding[] = []

    for (const sourceFile of context.project.getSourceFiles()) {
      for (const element of iterateJsxHosts(sourceFile)) {
        const tag = context.resolveQuiTag(element)
        if (tag !== "Button") {
          continue
        }
        if (
          !context.hasAncestor(element, HEADER_BAR_ANCESTOR_TAGS, {
            followWrappers: true,
          })
        ) {
          continue
        }

        const fix = context.replaceTag(element, REPLACEMENT_TAG)
        findings.push({
          fix,
          violation: context.violation({
            fixable: true,
            message:
              "Use HeaderBar.ActionButton for action buttons inside HeaderBar. " +
              "Button miss the HeaderBar-specific size, density, and divider wiring.",
            node: element,
          }),
        })
      }
    }

    return findings
  },
  eslintAvailable: true,
  id: "no-button-in-header-bar",
  severity: "error",
  since: "1.0.0",
  title: "Use HeaderBar.ActionButton inside HeaderBar",
}

function* iterateJsxHosts(
  sourceFile: import("ts-morph").SourceFile,
): Iterable<JsxElement | JsxSelfClosingElement> {
  for (const node of sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)) {
    yield node
  }
  for (const node of sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement,
  )) {
    yield node
  }
}
