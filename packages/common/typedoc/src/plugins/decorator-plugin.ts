// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Application,
  type Context,
  Converter,
  DeclarationReflection,
  TypeScript,
} from "typedoc"

/**
 * typedoc removed decorator output in a recent version. We hook into the
 * serialization process via this plugin and manually add them here.
 */
export function loadDecoratorPlugin(app: Readonly<Application>) {
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, addDecoratorInfo)

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

/**
 * Adds support for Angular Input and Output decorators.
 */
function addDecoratorInfo(
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
  if (
    !TypeScript.isPropertyDeclaration(declaration) &&
    !TypeScript.isMethodDeclaration(declaration) &&
    !TypeScript.isSetAccessor(declaration) &&
    !TypeScript.isClassDeclaration(declaration)
  ) {
    return
  }

  const decorators = declaration.modifiers?.filter(TypeScript.isDecorator)

  decl.decorators = decorators?.length
    ? decorators?.map((d) => d.getText())
    : undefined
}
