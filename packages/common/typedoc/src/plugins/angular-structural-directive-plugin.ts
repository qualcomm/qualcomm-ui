// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFileSync} from "fs"
import {
  type Application,
  type Context,
  Converter,
  type DeclarationReflection,
  ReflectionKind,
  TypeScript,
} from "typedoc"

import {isInputSignal} from "../guards"

import {pluginFileCache} from "./shared"

export function loadStructuralDirectivePlugin(app: Readonly<Application>) {
  const selectorCache = new Map<string, string>()

  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, decl) => {
    if (decl.kind === ReflectionKind.Class) {
      const selector = extractDirectiveSelectorFromClass(context, decl)
      if (selector) {
        selectorCache.set(decl.name, selector)
      }
    }
  })

  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, decl) => {
    if (!decl.parent || decl.parent.kind !== ReflectionKind.Class) {
      return
    }

    const selector = selectorCache.get(decl.parent.name)
    if (!selector) {
      return
    }

    transformStructuralDirectiveInput(context, decl, selector)
  })
}

function extractDirectiveSelectorFromClass(
  context: Context,
  decl: DeclarationReflection,
): string | undefined {
  const symbol = context.getSymbolFromReflection(decl)
  if (!symbol) {
    return undefined
  }

  const declaration = symbol.valueDeclaration
  if (!declaration) {
    return undefined
  }

  if (!TypeScript.isClassDeclaration(declaration)) {
    return undefined
  }

  const targetSource = decl.sources?.[0]
  if (!targetSource) {
    return undefined
  }

  let cachedFile: string[] = pluginFileCache[targetSource.fullFileName]
  if (!cachedFile) {
    cachedFile = readFileSync(targetSource.fullFileName, "utf-8")?.split("\n")
    pluginFileCache[targetSource.fullFileName] = cachedFile
  }

  const classLine = targetSource.line - 1

  for (let i = classLine - 1; i >= 0; i--) {
    const line = cachedFile[i]

    if (line.includes("@Directive")) {
      for (let j = i; j < Math.min(cachedFile.length, i + 10); j++) {
        const selectorMatch = cachedFile[j].match(
          /selector:\s*["']\[([^\]]+)\]["']/,
        )
        if (selectorMatch) {
          return selectorMatch[1]
        }
      }
    }
  }

  return undefined
}

function transformStructuralDirectiveInput(
  context: Context,
  decl: DeclarationReflection,
  selector: string,
) {
  const symbol = context.getSymbolFromReflection(decl)
  if (!symbol) {
    return
  }

  const declaration = symbol.valueDeclaration
  if (!declaration) {
    return
  }

  if (!TypeScript.isPropertyDeclaration(declaration)) {
    return
  }

  if (decl.type?.type !== "reference" || !isInputSignal(decl.type.name)) {
    return
  }

  if (decl.name.startsWith(selector)) {
    const suffix = decl.name.slice(selector.length)

    if (!suffix) {
      // Input name matches selector exactly, i.e. `*renderCell` and `renderCell`
      // find first capital letter and lowercase it. Then omit the prefix.
      // renderCell -> cell
      const match = selector.match(/[A-Z][a-z]*/)
      if (match) {
        const coreName = match[0].toLowerCase()
        decl.name = coreName
      }
    } else {
      // Input has suffix: renderCellComponentInput → componentInput
      const microsyntaxName = suffix.charAt(0).toLowerCase() + suffix.slice(1)
      decl.name = microsyntaxName
    }
  }
}
