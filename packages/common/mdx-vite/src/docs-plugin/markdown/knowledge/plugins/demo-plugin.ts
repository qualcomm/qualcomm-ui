// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Code, Parent} from "mdast"
import type {MdxJsxAttribute, MdxJsxFlowElement} from "mdast-util-mdx-jsx"
import {readFile} from "node:fs/promises"
import {basename, extname, join} from "node:path"
import type {Plugin} from "unified"
import {visit} from "unist-util-visit"

import {kebabCase} from "@qualcomm-ui/utils/change-case"

import type {ImportedModule} from "../types"
import {
  exists,
  extractRelativeImports,
  removePreviewLines,
  resolveModulePath,
} from "../utils"

async function collectDemoImports(
  demoCode: string,
  demoFilePath: string,
  visited: Set<string> = new Set(),
  verbose?: boolean,
): Promise<ImportedModule[]> {
  const modules: ImportedModule[] = []
  const relativeImports = extractRelativeImports(demoCode)

  for (const importPath of relativeImports) {
    const resolvedPath = await resolveModulePath(importPath, demoFilePath)
    if (!resolvedPath || visited.has(resolvedPath)) {
      continue
    }
    visited.add(resolvedPath)

    try {
      const importContent = await readFile(resolvedPath, "utf-8")
      modules.push({
        content: importContent,
        path: resolvedPath,
      })
      const nestedModules = await collectDemoImports(
        importContent,
        resolvedPath,
        visited,
        verbose,
      )
      modules.push(...nestedModules)
    } catch {
      if (verbose) {
        console.log(`  Could not read import: ${resolvedPath}`)
      }
    }
  }

  return modules
}

/**
 * Creates a remark plugin that replaces demo JSX elements (QdsDemo, CodeDemo,
 * Demo) with code blocks containing the demo source code from the demos folder.
 * Imported files are added as sibling code blocks immediately after the demo.
 */
export function formatDemos(
  demosFolder: string | undefined,
  verbose?: boolean,
): Plugin {
  return () => async (tree) => {
    const promises: Promise<void>[] = []

    visit(
      tree,
      "mdxJsxFlowElement",
      (
        node: MdxJsxFlowElement,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (
          !node?.name ||
          !["QdsDemo", "CodeDemo", "Demo"].includes(node.name)
        ) {
          return
        }

        const nameAttr = node.attributes?.find(
          (attr): attr is MdxJsxAttribute =>
            attr.type === "mdxJsxAttribute" && attr.name === "name",
        )

        const nodeAttr = node.attributes?.find(
          (attr): attr is MdxJsxAttribute =>
            attr.type === "mdxJsxAttribute" && attr.name === "node",
        )

        let demoName: string | undefined

        if (nameAttr && typeof nameAttr.value === "string") {
          demoName = nameAttr.value
        } else if (nodeAttr?.value && typeof nodeAttr.value !== "string") {
          const estree = nodeAttr.value.data?.estree
          if (estree?.body?.[0]?.type === "ExpressionStatement") {
            const expression = estree.body[0].expression
            if (
              expression.type === "MemberExpression" &&
              expression.object.type === "Identifier" &&
              expression.object.name === "Demo" &&
              expression.property.type === "Identifier"
            ) {
              demoName = expression.property.name
            }
          }
        }

        if (!demoName) {
          if (parent && index !== undefined) {
            parent.children.splice(index, 1)
          }
          return
        }

        promises.push(
          (async () => {
            const kebabName = kebabCase(demoName)
            let filePath = `${kebabName}.tsx`

            if (!demosFolder) {
              if (verbose) {
                console.log(`  No demos folder for ${demoName}`)
              }
              if (parent && index !== undefined) {
                parent.children.splice(index, 1)
              }
              return
            }

            let demoFilePath = join(demosFolder, filePath)
            let isAngularDemo = false

            if (!(await exists(demoFilePath))) {
              demoFilePath = join(demosFolder, `${kebabName}.ts`)
              if (await exists(demoFilePath)) {
                isAngularDemo = true
                filePath = `${kebabCase(demoName).replace("-component", ".component")}.ts`
                demoFilePath = join(demosFolder, filePath)
              } else {
                console.log(`  Demo not found ${demoName}`)
                if (parent && index !== undefined) {
                  parent.children.splice(index, 1)
                }
                return
              }
            }

            try {
              const demoCode = await readFile(demoFilePath, "utf-8")
              const cleanedCode = removePreviewLines(demoCode)

              if (verbose) {
                console.log(`  Replaced demo ${demoName} with source code`)
              }

              const demoCodeBlock: Code = {
                lang: isAngularDemo ? "angular-ts" : "tsx",
                meta: null,
                type: "code",
                value: cleanedCode,
              }

              const importedModules = await collectDemoImports(
                demoCode,
                demoFilePath,
                new Set(),
                verbose,
              )

              if (
                importedModules.length === 0 ||
                !parent ||
                index === undefined
              ) {
                Object.assign(node, demoCodeBlock)
              } else {
                const nodesToInsert: Code[] = [demoCodeBlock]

                for (const importedModule of importedModules) {
                  const ext = extname(importedModule.path).slice(1)
                  const filename = basename(importedModule.path)
                  nodesToInsert.push({
                    lang: ext,
                    meta: `title="${filename}"`,
                    type: "code",
                    value: importedModule.content,
                  })
                }

                parent.children.splice(index, 1, ...nodesToInsert)

                if (verbose) {
                  console.log(
                    `  Added ${importedModules.length} imported file(s) after demo`,
                  )
                }
              }
            } catch (error) {
              if (verbose) {
                console.log(`Error reading demo ${demoName}`, error)
              }
              if (parent && index !== undefined) {
                parent.children.splice(index, 1)
              }
            }
          })(),
        )
      },
    )

    await Promise.all(promises)
  }
}
