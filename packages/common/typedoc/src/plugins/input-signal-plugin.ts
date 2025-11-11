// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFileSync} from "fs"
import {
  type Application,
  type Context,
  Converter,
  DeclarationReflection,
  ReflectionFlag,
  TypeScript,
} from "typedoc"

import {isInputSignal, isModelSignal, isOutputSignal} from "../guards"

import {pluginFileCache} from "./shared"

/**
 * typedoc removed decorator output in a recent version. We hook into the
 * serialization process via this plugin and manually add them here.
 */
export function loadInputSignalPlugin(app: Readonly<Application>) {
  app.converter.on(
    Converter.EVENT_CREATE_DECLARATION,
    addInputSignalRequiredFlags,
  )

  // Add decorator info to serialized json
  app.serializer.addSerializer({
    priority: 0,
    supports(item) {
      return item instanceof DeclarationReflection
    },
    toObject(item, obj, _ser) {
      if ("decorators" in item) {
        ;(obj as any).decorators = item.decorators
      }
      return obj
    },
  })
}

function extractInputAlias(
  lines: string[],
  startLine: number,
): string | undefined {
  for (let i = 0; i < 5 && startLine + i < lines.length; i++) {
    const line = lines[startLine + i]
    const aliasMatch = line.match(/alias:\s*["']([^"']+)["']/)
    if (aliasMatch) {
      return aliasMatch[1]
    }
    if (line.includes("})")) {
      break
    }
  }
  return undefined
}

/**
 * Special case for input signals, which are difficult to account for. There's no
 * way to determine if the input signal's `.required` syntax is supplied apart from
 * inspecting the raw source code.
 */
function addInputSignalRequiredFlags(
  context: Context,
  decl: DeclarationReflection & {decorators?: string[]},
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

  if (decl.type?.type === "reference") {
    if (isOutputSignal(decl.type.name)) {
      decl.setFlag(ReflectionFlag.Optional, true)
    } else if (isInputSignal(decl.type.name)) {
      // TODO: set decl.name to alias
      const targetSource = decl.sources?.[0]
      if (!targetSource) {
        return
      }
      let cachedFile: string[] = pluginFileCache[targetSource.fullFileName]
      if (!cachedFile) {
        cachedFile = readFileSync(targetSource.fullFileName, "utf-8")?.split(
          "\n",
        )
        pluginFileCache[targetSource.fullFileName] = cachedFile
      }

      const lineIndex = targetSource.line - 1
      const line = cachedFile[targetSource.line - 1]

      decl.setFlag(ReflectionFlag.Optional, !line.includes("input.required"))

      const alias = extractInputAlias(cachedFile, lineIndex)
      if (alias) {
        decl.name = alias
      }
    } else if (isModelSignal(decl.type.name)) {
      const targetSource = decl.sources?.[0]
      if (!targetSource) {
        return
      }
      let cachedFile: string[] = pluginFileCache[targetSource.fullFileName]
      if (!cachedFile) {
        cachedFile = readFileSync(targetSource.fullFileName, "utf-8")?.split(
          "\n",
        )
        pluginFileCache[targetSource.fullFileName] = cachedFile
      }

      const line = cachedFile[targetSource.line - 1]

      decl.setFlag(ReflectionFlag.Optional, !line.includes("model.required"))
    }
  }
}
