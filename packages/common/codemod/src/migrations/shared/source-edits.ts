// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Node, Project, type SourceFile, SyntaxKind} from "ts-morph"

export interface Edit {
  end: number
  start: number
  text: string
}

/**
 * Applies non-overlapping edits to `content`, from the last one to the first so
 * that earlier offsets stay valid.
 */
export function applyEdits(content: string, edits: Edit[]): string {
  let result = content
  for (const edit of [...edits].sort((a, b) => b.start - a.start)) {
    result = `${result.slice(0, edit.start)}${edit.text}${result.slice(edit.end)}`
  }
  return result
}

/**
 * Returns the 1-based line number of `offset` in `content`.
 */
export function getLineNumber(content: string, offset: number): number {
  let line = 1
  for (let i = 0; i < offset; i++) {
    if (content[i] === "\n") {
      line++
    }
  }
  return line
}

export function parseSource(content: string, filePath: string): SourceFile {
  return new Project({
    manipulationSettings: {
      insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: false,
    },
    useInMemoryFileSystem: true,
  }).createSourceFile(filePath, content, {overwrite: true})
}

export function getTopLevelBindings(sourceFile: SourceFile): Set<string> {
  const names = new Set<string>()
  for (const decl of sourceFile.getImportDeclarations()) {
    for (const specifier of decl.getNamedImports()) {
      names.add(specifier.getAliasNode()?.getText() ?? specifier.getName())
    }
    const namespace = decl.getNamespaceImport()?.getText()
    if (namespace) {
      names.add(namespace)
    }
    const defaultImport = decl.getDefaultImport()?.getText()
    if (defaultImport) {
      names.add(defaultImport)
    }
  }
  for (const statement of sourceFile.getStatements()) {
    if (Node.isVariableStatement(statement)) {
      for (const declaration of statement.getDeclarations()) {
        names.add(declaration.getName())
      }
    } else if (
      Node.isFunctionDeclaration(statement) ||
      Node.isClassDeclaration(statement) ||
      Node.isInterfaceDeclaration(statement) ||
      Node.isTypeAliasDeclaration(statement) ||
      Node.isEnumDeclaration(statement)
    ) {
      const name = statement.getName()
      if (name) {
        names.add(name)
      }
    }
  }
  return names
}

/**
 * Renames every reference to an import binding. Shorthand properties and local
 * exports keep their original key and exported name, so the file's own API
 * doesn't change.
 */
export function renameReferences(
  nameNode: Node,
  oldName: string,
  newName: string,
  edits: Edit[],
): void {
  const sourceFile = nameNode.getSourceFile()
  for (const node of nameNode
    .asKindOrThrow(SyntaxKind.Identifier)
    .findReferencesAsNodes()) {
    if (
      node.getSourceFile() !== sourceFile ||
      node.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)
    ) {
      continue
    }
    const parent = node.getParent()
    let text = newName
    if (Node.isShorthandPropertyAssignment(parent)) {
      text = `${oldName}: ${newName}`
    } else if (Node.isExportSpecifier(parent) && !parent.getAliasNode()) {
      text = `${newName} as ${oldName}`
    }
    edits.push({end: node.getEnd(), start: node.getStart(), text})
  }
}

/**
 * Returns the `ns.Name` property accesses and qualified type names in the file
 * whose namespace is `namespace`.
 */
export function getNamespaceMembers(
  sourceFile: SourceFile,
  namespace: string,
): Node[] {
  const members: Node[] = []
  sourceFile.forEachDescendant((node) => {
    if (
      Node.isPropertyAccessExpression(node) &&
      node.getExpression().getText() === namespace
    ) {
      members.push(node.getNameNode())
    } else if (
      Node.isQualifiedName(node) &&
      node.getLeft().getText() === namespace
    ) {
      members.push(node.getRight())
    }
  })
  return members
}

/**
 * Deprecated export name to replacement name, keyed by module.
 */
export type ExportRenames = Readonly<
  Record<string, Readonly<Record<string, string>>>
>

function getRename(
  renames: ExportRenames,
  module: string,
  name: string,
): string | undefined {
  const names = Object.hasOwn(renames, module) ? renames[module] : undefined
  return names && Object.hasOwn(names, name) ? names[name] : undefined
}

/**
 * Replaces imports and re-exports of renamed exports, and the references to
 * their bindings. Aliased imports and re-exports keep their local or exported
 * name. Returns the number of names replaced.
 */
export function renameImportedNames(
  sourceFile: SourceFile,
  renames: ExportRenames,
  edits: Edit[],
): number {
  const bindings = getTopLevelBindings(sourceFile)
  let renamed = 0

  for (const decl of sourceFile.getImportDeclarations()) {
    const module = decl.getModuleSpecifierValue()
    if (!Object.hasOwn(renames, module)) {
      continue
    }

    const namespace = decl.getNamespaceImport()?.getText()
    if (namespace) {
      for (const member of getNamespaceMembers(sourceFile, namespace)) {
        const newName = getRename(renames, module, member.getText())
        if (newName) {
          edits.push({
            end: member.getEnd(),
            start: member.getStart(),
            text: newName,
          })
          renamed++
        }
      }
      continue
    }

    for (const specifier of decl.getNamedImports()) {
      const name = specifier.getName()
      const newName = getRename(renames, module, name)
      if (!newName) {
        continue
      }
      const nameNode = specifier.getNameNode()
      let text = newName
      if (!specifier.getAliasNode()) {
        if (bindings.has(newName)) {
          // The new name is already bound in this file, so keep the old one.
          text = `${newName} as ${name}`
        } else {
          renameReferences(nameNode, name, newName, edits)
        }
      }
      edits.push({end: nameNode.getEnd(), start: nameNode.getStart(), text})
      renamed++
    }
  }

  for (const decl of sourceFile.getExportDeclarations()) {
    const module = decl.getModuleSpecifierValue()
    if (!module) {
      continue
    }
    for (const specifier of decl.getNamedExports()) {
      const name = specifier.getName()
      const newName = getRename(renames, module, name)
      if (!newName) {
        continue
      }
      const nameNode = specifier.getNameNode()
      // Keep the exported name so this file's own API doesn't change.
      edits.push({
        end: nameNode.getEnd(),
        start: nameNode.getStart(),
        text: specifier.getAliasNode() ? newName : `${newName} as ${name}`,
      })
      renamed++
    }
  }

  return renamed
}

/**
 * Whether the file imports or re-exports from any of `modules`.
 */
export function referencesModule(
  sourceFile: SourceFile,
  modules: (module: string) => boolean,
): boolean {
  return [
    ...sourceFile.getImportDeclarations(),
    ...sourceFile.getExportDeclarations(),
  ].some((decl) => {
    const module = decl.getModuleSpecifierValue()
    return module !== undefined && modules(module)
  })
}
