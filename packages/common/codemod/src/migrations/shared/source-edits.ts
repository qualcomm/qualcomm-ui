// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ImportDeclaration,
  Node,
  Project,
  type SourceFile,
  SyntaxKind,
} from "ts-morph"

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

export interface NamedImport {
  alias?: string | undefined
  isTypeOnly?: boolean | undefined
  name: string
}

function printSpecifier(
  {alias, isTypeOnly, name}: NamedImport,
  typePrefix: boolean,
): string {
  return `${typePrefix && isTypeOnly ? "type " : ""}${name}${alias ? ` as ${alias}` : ""}`
}

/**
 * Appends specifiers after the last named import, one per line if the import
 * is already split across lines. Specifiers that are already imported are
 * skipped.
 */
export function addSpecifiers(
  target: ImportDeclaration,
  specifiers: NamedImport[],
): Edit | undefined {
  const named = target.getNamedImports()
  const existing = new Set(
    named.map((s) => `${s.getName()} as ${s.getAliasNode()?.getText()}`),
  )
  const additions = specifiers
    .filter((s) => !existing.has(`${s.name} as ${s.alias}`))
    .map((s) => printSpecifier(s, !target.isTypeOnly()))
  if (!additions.length) {
    return
  }
  const last = named[named.length - 1]
  const indent = target
    .getSourceFile()
    .getFullText()
    .slice(last.getStartLinePos(), last.getStart())
  const separator = /^\s*$/.test(indent) ? `,\n${indent}` : ", "
  return {
    end: last.getEnd(),
    start: last.getEnd(),
    text: `${separator}${additions.join(separator)}`,
  }
}

/**
 * Moves the named imports matched by `shouldMove` from `from` to `to`, merging
 * them into an existing import of `to` and dropping duplicates. Imports left
 * empty are removed. Returns `undefined` if there's nothing to move.
 *
 * A new import of `to` goes before the first import of `from`, so sorted
 * imports stay sorted when `to` sorts before `from`.
 */
export function moveNamedImports(
  sourceFile: SourceFile,
  from: string,
  to: string,
  shouldMove: (name: string) => boolean,
): string | undefined {
  const moved: NamedImport[] = []
  const emptied: ImportDeclaration[] = []
  let first: ImportDeclaration | undefined

  for (const decl of sourceFile.getImportDeclarations()) {
    if (decl.getModuleSpecifierValue() !== from) {
      continue
    }
    for (const specifier of decl.getNamedImports()) {
      if (!shouldMove(specifier.getName())) {
        continue
      }
      moved.push({
        alias: specifier.getAliasNode()?.getText(),
        isTypeOnly: specifier.isTypeOnly() || decl.isTypeOnly(),
        name: specifier.getName(),
      })
      first ??= decl
      specifier.remove()
    }
    if (!decl.getNamedImports().length && !decl.getDefaultImport()) {
      emptied.push(decl)
    }
  }

  if (!first) {
    return
  }

  const content = sourceFile.getFullText()
  const edits: Edit[] = []
  const toDecls = sourceFile
    .getImportDeclarations()
    .filter((decl) => decl.getModuleSpecifierValue() === to)
  const imported = new Set(
    toDecls.flatMap((decl) =>
      decl
        .getNamedImports()
        .map((s) => `${s.getName()} as ${s.getAliasNode()?.getText()}`),
    ),
  )
  const added = moved.filter((s) => !imported.has(`${s.name} as ${s.alias}`))
  const hasValue = added.some((specifier) => !specifier.isTypeOnly)
  const target = toDecls.find(
    (decl) =>
      decl.getNamedImports().length > 0 && (!hasValue || !decl.isTypeOnly()),
  )

  // If every moved name is already imported, only the emptied imports change.
  let replacement: string | undefined
  if (added.length && target) {
    const edit = addSpecifiers(target, added)
    if (edit) {
      edits.push(edit)
    }
  } else if (added.length) {
    const specifiers = added.map((s) => printSpecifier(s, hasValue))
    replacement = `import ${hasValue ? "" : "type "}{${specifiers.join(", ")}} from "${to}"`
    if (!emptied.includes(first)) {
      const start = first.getStart()
      edits.push({end: start, start, text: `${replacement}\n`})
    }
  }

  for (const decl of emptied) {
    if (decl === first && replacement) {
      edits.push({
        end: decl.getEnd(),
        start: decl.getStart(),
        text: replacement,
      })
    } else {
      // Include the trailing newline so that no blank line is left behind.
      const end = decl.getEnd()
      edits.push({
        end: content[end] === "\n" ? end + 1 : end,
        start: decl.getStart(),
        text: "",
      })
    }
  }

  return applyEdits(content, edits)
}
