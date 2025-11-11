// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type JsxElement,
  type JsxSelfClosingElement,
  Node,
  Project,
  SyntaxKind,
} from "ts-morph"

import {type ImportTransformEntry} from "./types"

export function transformTs(
  filePath: string,
  optionsArray: ImportTransformEntry[],
): boolean {
  const project = new Project({
    manipulationSettings: {
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: false,
      useTrailingCommas: true,
    },
  })
  const sourceFile = project.addSourceFileAtPath(filePath)

  const allImports = sourceFile.getImportDeclarations()
  const leadingTrivia =
    allImports.length > 0
      ? sourceFile.getFullText().substring(0, allImports[0].getStart())
      : ""

  let needsSave = false

  for (const options of optionsArray) {
    const {
      imports,
      importsToRemove,
      jsxWrappers,
      sourcePackage,
      targetPackage,
      variableTransformers,
    } = options

    const importDeclarations = sourceFile
      .getImportDeclarations()
      .filter(
        (importDecl) => importDecl.getModuleSpecifierValue() === sourcePackage,
      )

    const importedNamesFromSource = new Set<string>()
    for (const importDecl of importDeclarations) {
      for (const namedImport of importDecl.getNamedImports()) {
        importedNamesFromSource.add(namedImport.getName())
      }
    }

    const shouldMoveAll = !imports || imports.length === 0

    for (const importDecl of importDeclarations) {
      const namedImports = importDecl.getNamedImports()
      const defaultImport = importDecl.getDefaultImport()
      const namespaceImport = importDecl.getNamespaceImport()

      if (namedImports.length === 0 && !defaultImport && !namespaceImport) {
        continue
      }

      const importsToMove: typeof namedImports = []
      const importsToKeep: typeof namedImports = []

      for (const namedImport of namedImports) {
        const name = namedImport.getName()
        if (importsToRemove?.includes(name)) {
          continue
        }
        const shouldMove =
          shouldMoveAll ||
          imports.some((imp) =>
            typeof imp === "string" ? imp === name : imp.name === name,
          )
        if (shouldMove) {
          importsToMove.push(namedImport)
        } else {
          importsToKeep.push(namedImport)
        }
      }

      const removedCount =
        namedImports.length - importsToMove.length - importsToKeep.length
      if (importsToMove.length === 0 && removedCount === 0) {
        continue
      }

      const importIndex = sourceFile.getImportDeclarations().indexOf(importDecl)
      const moveImportStructures = importsToMove.map((imp) => {
        const name = imp.getName()
        const existingAlias = imp.getAliasNode()?.getText()
        const importConfig = imports?.find(
          (impConfig) =>
            typeof impConfig === "object" && impConfig.name === name,
        )
        return {
          isTypeOnly: imp.isTypeOnly(),
          name:
            typeof importConfig === "object" && importConfig.renameTo
              ? importConfig.renameTo
              : name,
          ...(existingAlias && {alias: existingAlias}),
        }
      })

      const seenImports = new Map<
        string,
        {alias?: string; isTypeOnly: boolean; name: string}
      >()
      for (const item of moveImportStructures) {
        const key = `${item.name}::${item.alias ?? ""}`
        const existing = seenImports.get(key)
        if (!existing) {
          seenImports.set(key, item)
        } else if (!item.isTypeOnly) {
          existing.isTypeOnly = false
        }
      }
      const uniqueMoveImportStructures = Array.from(seenImports.values())

      const newImports = []
      if (uniqueMoveImportStructures.length > 0) {
        newImports.push({
          moduleSpecifier: targetPackage,
          namedImports: uniqueMoveImportStructures,
        })
      }
      if (importsToKeep.length > 0 || defaultImport || namespaceImport) {
        const keepImportDecl: any = {
          moduleSpecifier: sourcePackage,
          namedImports: importsToKeep.map((imp) => ({
            alias: imp.getAliasNode()?.getText(),
            isTypeOnly: imp.isTypeOnly(),
            name: imp.getName(),
          })),
        }
        if (defaultImport) {
          keepImportDecl.defaultImport = defaultImport.getText()
        }
        if (namespaceImport) {
          keepImportDecl.namespaceImport = namespaceImport.getText()
        }
        newImports.push(keepImportDecl)
      }

      importDecl.remove()
      for (let i = 0; i < newImports.length; i++) {
        const decl = sourceFile.insertImportDeclaration(
          importIndex,
          newImports[i],
        )
        decl.formatText({semicolons: "remove" as any})
      }
      needsSave = true
    }

    if (variableTransformers && variableTransformers.length > 0) {
      for (const transformer of variableTransformers) {
        if (!importedNamesFromSource.has(transformer.name)) {
          continue
        }
        const identifiers = sourceFile.getDescendantsOfKind(
          SyntaxKind.Identifier,
        )
        for (const identifier of identifiers) {
          if (identifier.getText() === transformer.name) {
            if (
              identifier.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)
            ) {
              continue
            }
            identifier.replaceWithText(transformer.renameTo)
            needsSave = true
          }
        }
      }
    }

    if (jsxWrappers && jsxWrappers.length > 0) {
      for (const wrapper of jsxWrappers) {
        if (applyJsxWrapper(sourceFile, wrapper)) {
          needsSave = true
        }
      }
    }
  }

  if (needsSave) {
    mergeImports(sourceFile)
    sourceFile.insertText(0, leadingTrivia)
    sourceFile.saveSync()
  }

  return needsSave
}

function applyJsxWrapper(
  sourceFile: any,
  wrapper: {name: string; wrapWith: string[]},
): boolean {
  let madeChanges = false
  while (true) {
    const jsxElements: JsxElement[] = sourceFile.getDescendantsOfKind(
      SyntaxKind.JsxElement,
    )
    const element = jsxElements.find((el) => {
      const openingElement = el.getOpeningElement()
      const tagName = openingElement.getTagNameNode()
      if (tagName.getText() !== wrapper.name) {
        return false
      }
      const parent = el.getParent()
      if (parent && Node.isJsxElement(parent)) {
        const parentTag = parent.getOpeningElement().getTagNameNode().getText()
        if (wrapper.wrapWith.includes(parentTag)) {
          return false
        }
      }
      return true
    })
    if (!element) {
      break
    }
    const rawText = element.getText()
    const lines = rawText.split("\n")
    const childIndents = lines
      .slice(1)
      .filter((line: string) => line.trimStart().length > 0)
      .map((line: string) => line.length - line.trimStart().length)
    const minChildIndent =
      childIndents.length > 0 ? Math.min(...childIndents) : 0
    let text = lines
      .map((line: string, i: number) =>
        i === 0 ? line : line.slice(minChildIndent),
      )
      .join("\n")
    for (let i = wrapper.wrapWith.length - 1; i >= 0; i--) {
      const wrapTag = wrapper.wrapWith[i]
      const textLines = text.split("\n")
      const indented = textLines.map((line: string) => `  ${line}`).join("\n")
      text = `<${wrapTag}>\n${indented}\n</${wrapTag}>`
    }
    element.replaceWithText(text)
    madeChanges = true
  }
  while (true) {
    const selfClosingElements: JsxSelfClosingElement[] =
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
    const element = selfClosingElements.find((el) => {
      const tagName = el.getTagNameNode()
      if (tagName.getText() !== wrapper.name) {
        return false
      }
      const parent = el.getParent()
      if (parent && Node.isJsxElement(parent)) {
        const parentTag = parent.getOpeningElement().getTagNameNode().getText()
        if (wrapper.wrapWith.includes(parentTag)) {
          return false
        }
      }
      return true
    })
    if (!element) {
      break
    }
    let text = element.getText()
    for (let i = wrapper.wrapWith.length - 1; i >= 0; i--) {
      const wrapTag = wrapper.wrapWith[i]
      text = `<${wrapTag}>\n${text}\n</${wrapTag}>`
    }
    element.replaceWithText(text)
    madeChanges = true
  }
  return madeChanges
}

function mergeImports(sourceFile: any): void {
  const fullText = sourceFile.getFullText()
  const allImports = sourceFile.getImportDeclarations()
  if (allImports.length === 0) {
    return
  }

  const firstImport = allImports[0]
  const lastImport = allImports[allImports.length - 1]

  const restOfFile = fullText.substring(lastImport.getEnd())

  const importsByModule = new Map<
    string,
    {
      defaultImport?: string
      namedImports: Array<{alias?: string; isTypeOnly: boolean; name: string}>
      namespaceImport?: string
    }
  >()
  const moduleOrder: string[] = []

  for (const importDecl of allImports) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue()
    if (!importsByModule.has(moduleSpecifier)) {
      importsByModule.set(moduleSpecifier, {namedImports: []})
      moduleOrder.push(moduleSpecifier)
    }

    const moduleData = importsByModule.get(moduleSpecifier)!

    const defaultImport = importDecl.getDefaultImport()
    if (defaultImport && !moduleData.defaultImport) {
      moduleData.defaultImport = defaultImport.getText()
    }

    const namespaceImport = importDecl.getNamespaceImport()
    if (namespaceImport && !moduleData.namespaceImport) {
      moduleData.namespaceImport = namespaceImport.getText()
    }

    for (const namedImport of importDecl.getNamedImports()) {
      const name = namedImport.getName()
      const alias = namedImport.getAliasNode()?.getText()
      const isTypeOnly = namedImport.isTypeOnly()
      const isDuplicate = moduleData.namedImports.some(
        (imp) => imp.name === name && imp.alias === alias,
      )
      if (!isDuplicate) {
        moduleData.namedImports.push({alias, isTypeOnly, name})
      }
    }
  }

  const tempProject = new Project()
  const tempFile = tempProject.createSourceFile("temp.ts", "")

  for (let i = 0; i < moduleOrder.length; i++) {
    const moduleSpecifier = moduleOrder[i]
    const moduleData = importsByModule.get(moduleSpecifier)!
    if (
      moduleData.namedImports.length === 0 &&
      !moduleData.defaultImport &&
      !moduleData.namespaceImport
    ) {
      continue
    }

    const importStructure: any = {
      moduleSpecifier,
    }
    if (moduleData.defaultImport) {
      importStructure.defaultImport = moduleData.defaultImport
    }
    if (moduleData.namespaceImport) {
      importStructure.namespaceImport = moduleData.namespaceImport
    }
    if (moduleData.namedImports.length > 0) {
      importStructure.namedImports = moduleData.namedImports
    }
    const newDecl = tempFile.insertImportDeclaration(i, importStructure)
    newDecl.formatText({semicolons: "remove" as any})
  }

  const importsText = tempFile.getFullText()
  const newContent = importsText + restOfFile
  sourceFile.replaceText([firstImport.getStart(), fullText.length], newContent)
}
