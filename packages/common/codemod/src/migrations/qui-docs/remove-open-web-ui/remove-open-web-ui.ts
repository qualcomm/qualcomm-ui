// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Node, type ObjectLiteralExpression, SyntaxKind} from "ts-morph"

import type {Codemod} from "../../types.js"
import {
  applyEdits,
  type ConfigEdit,
  type ConfigTransformResult,
  describeConfigResult,
  findProperty,
  getPropertyName,
  getPropertyRemoval,
  getStatus,
  parseConfig,
  runConfigTransform,
} from "../config-object.js"

/**
 * Whether `object` is the value of a `knowledge` property.
 */
function isKnowledgeConfig(object: ObjectLiteralExpression): boolean {
  const parent = object.getParent()
  return (
    Node.isPropertyAssignment(parent) && getPropertyName(parent) === "knowledge"
  )
}

/**
 * Removes `knowledge.integrations` from a qui-docs config. Open WebUI was its
 * only integration, so the whole field is removed. Edited objects aren't
 * reformatted.
 */
export function transformQuiDocsConfig(
  content: string,
  filePath = "qui-docs.config.ts",
): ConfigTransformResult {
  const sourceFile = parseConfig(content, filePath)
  const changed: string[] = []
  const manual: string[] = []
  const edits: ConfigEdit[] = []

  const integrationsProperties = sourceFile
    .getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
    .flatMap((object) => {
      const prop = findProperty(object, "integrations")
      if (!prop) {
        return []
      }
      const initializer = Node.isPropertyAssignment(prop)
        ? prop.getInitializer()
        : undefined
      const hasOpenWebUi =
        Node.isObjectLiteralExpression(initializer) &&
        !!findProperty(initializer, "openWebUi")
      return isKnowledgeConfig(object) || hasOpenWebUi ? [prop] : []
    })

  for (const prop of integrationsProperties) {
    const initializer = Node.isPropertyAssignment(prop)
      ? prop.getInitializer()
      : undefined
    if (!Node.isObjectLiteralExpression(initializer)) {
      manual.push(
        `remove knowledge.integrations (line ${prop.getStartLineNumber()})`,
      )
      continue
    }
    const unknown = initializer
      .getProperties()
      .map(getPropertyName)
      .filter((name) => name !== "openWebUi")
    if (unknown.length) {
      manual.push(
        `remove knowledge.integrations (line ${prop.getStartLineNumber()}), it has unsupported properties: ${unknown.join(", ")}`,
      )
      continue
    }
    edits.push(getPropertyRemoval(content, prop))
    changed.push("knowledge.integrations")
  }

  const typeReferences = sourceFile
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((node) => node.getText() === "OpenWebUiIntegration")
  if (typeReferences.length) {
    manual.push(
      `remove references to the OpenWebUiIntegration type (line ${typeReferences[0].getStartLineNumber()})`,
    )
  }

  return {
    changed,
    content: applyEdits(content, edits),
    manual,
    status: getStatus(changed, manual),
  }
}

export const removeOpenWebUi: Codemod<"@qualcomm-ui/mdx-vite"> = {
  name: "remove-open-web-ui",
  noMatchMessage: "no Open WebUI usage found, nothing to change",
  run: (ctx) =>
    runConfigTransform(ctx, transformQuiDocsConfig, (result) =>
      describeConfigResult(
        result,
        ctx.dryRun ? "would remove" : "removed",
        "no Open WebUI usage found",
      ),
    ),
  title: "Remove the Open WebUI knowledge integration",
  versions: {
    "@qualcomm-ui/mdx-vite": {from: 4, to: 4},
  },
}
