// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import ts from "typescript"

import type {
  QuiComment,
  QuiPropDeclaration,
  QuiPropTypes,
  InlineRefDecision,
  SerializedParameters,
  SerializedType,
} from "@qualcomm-ui/typedoc-common"

import type {
  ImportReference,
  ImportResolverFn,
  ImportResolverParams,
} from "../types.js"

import {
  analyzeMember,
  getDecorators,
  getSignalCall,
  getStructuralSelector,
  isAngularEntity,
  toMicrosyntaxName,
} from "./angular.js"
import {
  type Entity,
  isExternalMember,
  isFunctionValued,
  isHidden,
} from "./collect.js"
import {
  findTag,
  getDefaultValue,
  getParamComment,
  getSymbolComment,
  hasComment,
  type ParsedComment,
  toDisplayParts,
  toQuiComment,
} from "./comments.js"
import type {PackageResolver} from "./package-info.js"
import {
  namedParameters,
  prettyType,
  prettyTypeWithSpans,
  withoutNamedParameters,
} from "./pretty.js"
import {kindOf, kindOfType, kindOfTypeNode} from "./type-kind.js"
import {
  isSignalName,
  type PrintOptions,
  removeUndefined,
  type TypePrinter,
} from "./type-printer.js"

export interface SerializerParams {
  checker: ts.TypeChecker
  entities: Entity[]
  importResolver?: ImportResolverFn
  packages: PackageResolver
  printer: TypePrinter
  referenceLinks?: Record<string, string>
}

interface NamedReference {
  name: string
  symbol: ts.Symbol
  typeArguments: TypeArgument[]
}

interface TypeArgument {
  node?: ts.TypeNode
  type: ts.Type
}

interface ValueParams {
  comment: ParsedComment
  name: string
  optional?: boolean
  /**
   * The value type written as the type argument of a signal initializer, such
   * as `Direction` in `input<Direction | undefined>()`.
   */
  signalArgument?: ts.TypeNode
  /**
   * The member is the alias declaration itself, so its body is printed.
   */
  skipOwnAlias?: boolean
  type: ts.Type
  typeNode?: ts.TypeNode
  typeParameters?: SerializedParameters[]
}

const signalWrapper =
  /^(?:InputSignal|ModelSignal|OutputEmitterRef)<([\s\S]*)>$/

function shiftDecisions(
  decisions: InlineRefDecision[],
  offset: number,
): InlineRefDecision[] {
  return decisions.map((decision) => ({
    ...decision,
    end: decision.end + offset,
    start: decision.start + offset,
  }))
}

/**
 * Formats a printed type for display and moves the offsets of its inline ref
 * decisions from the printed type to the formatted type.
 */
async function prettyTypeWithDecisions(
  type: string,
  decisions: InlineRefDecision[],
): Promise<{
  inlineRefs: InlineRefDecision[] | undefined
  prettyType: string
}> {
  const result = await prettyTypeWithSpans(type, decisions)
  return {
    inlineRefs: nonEmpty(
      decisions.flatMap((decision, index) => {
        const span = result.spans[index]
        return span ? [{...decision, ...span}] : []
      }),
    ),
    prettyType: result.prettyType,
  }
}

/**
 * The forms of a type with every inline ref kept by name, for types that
 * inlined at least one ref. `print` prints the type like the displayed one, and
 * `display` derives the formatted form from it like {@link prettyType}.
 */
async function collapsedTypesOf(
  decisions: InlineRefDecision[],
  print: () => string,
  display: (printed: string) => string = (printed) => printed,
): Promise<{collapsedPrettyType?: string; collapsedType?: string}> {
  if (!decisions.some((decision) => decision.inlined)) {
    return {}
  }
  const printed = print()
  return {
    collapsedPrettyType: await prettyType(display(printed)),
    collapsedType: withoutNamedParameters(printed),
  }
}

const polymorphicAsType = "ElementType | ComponentType"

function printsName(printed: string, name: string): boolean {
  const escaped = name.replace(/[$.]/g, "\\$&")
  return new RegExp(`^(\\w+\\.)*${escaped}\\b`).test(printed)
}

/**
 * Whether a printed type refers to `name` outside of string literals and
 * qualified names.
 */
function mentionsName(printed: string, name: string): boolean {
  const escaped = name.replace(/\$/g, "\\$&")
  return new RegExp(`(?<![\\w$.])${escaped}(?![\\w$])`).test(
    printed.replace(/'(?:[^'\\]|\\.)*'/g, "''"),
  )
}

function omitUndefined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T
}

function nonEmpty<T>(items: T[] | undefined): T[] | undefined {
  return items?.length ? items : undefined
}

/**
 * Normalizes a type as written in source for display: whitespace collapses and
 * string literals use single quotes.
 */
const nodePrinter = ts.createPrinter({removeComments: true})

function nodeText(node: ts.TypeNode): string {
  return nodePrinter
    .printNode(ts.EmitHint.Unspecified, node, node.getSourceFile())
    .replace(/\s+/g, " ")
    .replace(/"([^"\\]*)"/g, "'$1'")
}

function typeNodeOf(declaration: ts.Declaration | undefined) {
  if (!declaration) {
    return undefined
  }
  if (ts.isSetAccessorDeclaration(declaration)) {
    return declaration.parameters[0]?.type
  }
  if (
    ts.isPropertySignature(declaration) ||
    ts.isPropertyDeclaration(declaration) ||
    ts.isGetAccessorDeclaration(declaration) ||
    ts.isParameter(declaration) ||
    ts.isVariableDeclaration(declaration) ||
    ts.isTypeAliasDeclaration(declaration)
  ) {
    return declaration.type
  }
  return undefined
}

/**
 * Type syntax that the checker resolves to a simpler type, such as
 * `Classes['root']` resolving to a string literal. The kind comes from the
 * resolved type.
 */
const resolvedKinds = new Set(["indexedAccess", "query", "typeOperator"])

function withoutUndefined(type: ts.Type): ts.Type {
  if (!type.isUnion()) {
    return type
  }
  const members = removeUndefined(type)
  return members.length === 1 ? members[0] : type
}

/**
 * TypeDoc reports an optional `T | undefined` as the kind of `T`.
 */
function withoutUndefinedNode(
  node: ts.TypeNode | undefined,
): ts.TypeNode | undefined {
  if (!node || !ts.isUnionTypeNode(node)) {
    return node
  }
  const members = node.types.filter(
    (member) => member.kind !== ts.SyntaxKind.UndefinedKeyword,
  )
  return members.length === 1 ? members[0] : node
}

/**
 * The named type of `Placement | undefined` or `Point | null`, for its import.
 */
function isHeritageOwner(
  node: ts.Node,
): node is ts.ClassLikeDeclaration | ts.InterfaceDeclaration {
  return ts.isClassLike(node) || ts.isInterfaceDeclaration(node)
}

function withoutNullishNode(
  node: ts.TypeNode | undefined,
): ts.TypeNode | undefined {
  if (!node || !ts.isUnionTypeNode(node)) {
    return node
  }
  const members = node.types.filter(
    (member) =>
      member.kind !== ts.SyntaxKind.UndefinedKeyword &&
      !(
        ts.isLiteralTypeNode(member) &&
        member.literal.kind === ts.SyntaxKind.NullKeyword
      ),
  )
  return members.length === 1 ? members[0] : node
}

function isObjectLiteralAlias(declaration: ts.TypeAliasDeclaration): boolean {
  const body = declaration.type
  return (
    ts.isTypeLiteralNode(body) &&
    body.members.length > 0 &&
    body.members.every(
      (member) =>
        ts.isPropertySignature(member) || ts.isMethodSignature(member),
    )
  )
}

/**
 * TypeDoc groups members by kind, then sorts them by name.
 */
function memberRank(symbol: ts.Symbol): number {
  if (symbol.flags & ts.SymbolFlags.Method) {
    return 2
  }
  if (symbol.flags & ts.SymbolFlags.Accessor) {
    return 1
  }
  return 0
}

function isNonPublic(declaration: ts.Declaration | undefined): boolean {
  if (!declaration) {
    return false
  }
  return !!(
    ts.getCombinedModifierFlags(declaration) &
    (ts.ModifierFlags.Private | ts.ModifierFlags.Protected)
  )
}

/**
 * Builds the documentation model for each collected entity.
 */
export class Serializer {
  private readonly checker: ts.TypeChecker
  private readonly docLinks = new Map<ts.Symbol, string | undefined>()
  private readonly entitiesByName: Map<string, Entity>
  private readonly memberComments = new Map<ts.Symbol, ParsedComment>()
  private readonly importResolver: ImportResolverFn | undefined
  private readonly packages: PackageResolver
  private readonly printer: TypePrinter
  private readonly referenceLinks: Record<string, string>

  constructor(params: SerializerParams) {
    this.checker = params.checker
    this.entitiesByName = new Map(
      params.entities.map((entity) => [entity.name, entity]),
    )
    this.importResolver = params.importResolver
    this.packages = params.packages
    this.printer = params.printer
    this.referenceLinks = params.referenceLinks ?? {}
  }

  async serializeEntity(entity: Entity): Promise<QuiPropTypes> {
    const comment = this.comment(
      entity.kind === "class"
        ? this.inheritedComment(entity.symbol, entity.comment)
        : entity.comment,
    )
    const {declaration, name, symbol} = entity

    switch (entity.kind) {
      case "class":
      case "interface":
      case "enum":
        return this.serializeObjectEntity(entity, comment)
      case "typeAlias": {
        // TypeDoc documents aliases of object literals like interfaces.
        if (
          entity.comment.modifiers.has("@interface") ||
          isObjectLiteralAlias(entity.declaration as ts.TypeAliasDeclaration)
        ) {
          return this.serializeObjectEntity(entity, comment)
        }
        const typeNode = (declaration as ts.TypeAliasDeclaration).type
        return omitUndefined({
          comment,
          name,
          resolvedType: await this.serializeValue({
            comment: entity.comment,
            name,
            skipOwnAlias: true,
            type: this.checker.getDeclaredTypeOfSymbol(symbol),
            typeNode,
            typeParameters: this.typeParameters(declaration, entity.comment),
          }),
          type: kindOfTypeNode(typeNode),
        })
      }
      case "function": {
        const [signature] = this.checker.getSignaturesOfType(
          this.checker.getTypeOfSymbol(symbol),
          ts.SignatureKind.Call,
        )
        return omitUndefined({
          comment,
          name,
          resolvedType: await this.serializeSignature(
            signature,
            name,
            entity.comment,
          ),
        })
      }
      case "variable": {
        const type = this.checker.getTypeOfSymbol(symbol)
        const typeNode = typeNodeOf(declaration)
        return omitUndefined({
          comment,
          name,
          resolvedType: await this.serializeValue({
            comment: entity.comment,
            name,
            type,
            typeNode,
          }),
          type: kindOf(typeNode, type, this.checker),
        })
      }
    }
  }

  /**
   * Prints the structure of an entity's type, such as the members of an
   * interface.
   */
  printEntityType(entity: Entity): string {
    if (entity.kind === "function" || entity.kind === "variable") {
      return withoutNamedParameters(
        this.printer.print(this.checker.getTypeOfSymbol(entity.symbol)),
      )
    }
    const type = this.checker.getDeclaredTypeOfSymbol(entity.symbol)
    return withoutNamedParameters(
      entity.kind === "typeAlias"
        ? this.printer.print(type, {skipOwnAlias: true})
        : this.printer.printObjectMembers(type),
    )
  }

  /**
   * Classes without their own comment take the comment of the nearest base
   * class that has one, as TypeDoc does.
   */
  private inheritedComment(
    symbol: ts.Symbol,
    comment: ParsedComment,
    visited = new Set<ts.Symbol>(),
  ): ParsedComment {
    if (hasComment(comment) || visited.has(symbol)) {
      return comment
    }
    visited.add(symbol)
    const type = this.checker.getDeclaredTypeOfSymbol(symbol)
    if (!type.isClassOrInterface()) {
      return comment
    }
    for (const base of this.checker.getBaseTypes(type)) {
      const baseSymbol = base.symbol
      if (
        !baseSymbol ||
        !(
          baseSymbol.flags &
          (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)
        ) ||
        isExternalMember(baseSymbol)
      ) {
        continue
      }
      const inherited = this.inheritedComment(
        baseSymbol,
        getSymbolComment(baseSymbol),
        visited,
      )
      if (hasComment(inherited)) {
        return inherited
      }
    }
    return comment
  }

  /**
   * Class members without their own comment take the comment of the member
   * they implement or override, such as `disabled` in a directive that
   * `implements SignalifyInput<AccordionItemApiProps>`.
   */
  private memberComment(member: ts.Symbol): ParsedComment {
    const own = getSymbolComment(member)
    const declaration = member.valueDeclaration
    if (
      hasComment(own) ||
      !declaration ||
      !isHeritageOwner(declaration.parent)
    ) {
      return own
    }
    const cached = this.memberComments.get(member)
    if (cached) {
      return cached
    }
    const inherited =
      this.heritageComment(declaration.parent, member.name, new Set()) ?? own
    this.memberComments.set(member, inherited)
    return inherited
  }

  private heritageComment(
    owner: ts.ClassLikeDeclaration | ts.InterfaceDeclaration,
    name: string,
    visited: Set<ts.Node>,
  ): ParsedComment | undefined {
    if (visited.has(owner)) {
      return undefined
    }
    visited.add(owner)
    for (const clause of owner.heritageClauses ?? []) {
      for (const heritage of clause.types) {
        const type = this.checker.getTypeAtLocation(heritage)
        const property = this.checker.getPropertyOfType(type, name)
        if (!property) {
          continue
        }
        const comment = getSymbolComment(property)
        if (hasComment(comment)) {
          return comment
        }
        const baseDeclaration = property.valueDeclaration
        if (baseDeclaration && isHeritageOwner(baseDeclaration.parent)) {
          const found = this.heritageComment(
            baseDeclaration.parent,
            name,
            visited,
          )
          if (found) {
            return found
          }
        }
      }
    }
    return undefined
  }

  private comment(comment: ParsedComment): QuiComment | undefined {
    return toQuiComment(comment, {
      resolveDocLink: (name) => {
        const entity = this.entitiesByName.get(name)
        return entity ? this.docLinkOf(entity.symbol) : undefined
      },
    })
  }

  private docLinkOf(symbol: ts.Symbol | undefined): string | undefined {
    if (!symbol) {
      return undefined
    }
    if (!this.docLinks.has(symbol)) {
      this.docLinks.set(
        symbol,
        findTag(getSymbolComment(symbol), "@docLink")?.text || undefined,
      )
    }
    return this.docLinks.get(symbol)
  }

  private collectMembers(entity: Entity): ts.Symbol[] {
    const {checker} = this
    const members =
      entity.kind === "enum"
        ? [...(entity.symbol.exports?.values() ?? [])]
        : checker.getPropertiesOfType(
            checker.getDeclaredTypeOfSymbol(entity.symbol),
          )

    return members
      .filter((member) => {
        if (
          member.name.startsWith("#") ||
          member.name.startsWith("__#") ||
          isExternalMember(member)
        ) {
          return false
        }
        const declaration = member.valueDeclaration ?? member.declarations?.[0]
        if (isNonPublic(declaration)) {
          return false
        }
        const comment = this.memberComment(member)
        if (isHidden(comment)) {
          return false
        }
        if (
          member.flags & (ts.SymbolFlags.Method | ts.SymbolFlags.Accessor) &&
          !hasComment(comment)
        ) {
          return false
        }
        return true
      })
      .sort(
        (a, b) => memberRank(a) - memberRank(b) || a.name.localeCompare(b.name),
      )
  }

  private async serializeObjectEntity(
    entity: Entity,
    comment: QuiComment | undefined,
  ): Promise<QuiPropTypes> {
    const decorators =
      entity.kind === "class" ? getDecorators(entity.declaration) : []
    const typeParameters = this.typeParameters(
      entity.declaration,
      entity.comment,
    )
    const members = this.collectMembers(entity)
    const props = await Promise.all(
      members.map((member) =>
        this.serializeMember(
          member,
          entity.kind,
          typeParameters,
          entity.declaration,
        ),
      ),
    )

    if (entity.kind === "class" && isAngularEntity(entity.declaration)) {
      return omitUndefined({
        comment,
        decorators,
        name: entity.name,
        ...this.groupAngularMembers(entity, members, props),
      })
    }

    if (!props.length) {
      const type = this.checker.getDeclaredTypeOfSymbol(entity.symbol)
      const printed =
        entity.kind === "typeAlias"
          ? this.printer.print(type, {skipOwnAlias: true})
          : this.printer.printObjectMembers(type)
      return omitUndefined({
        comment,
        decorators: nonEmpty(decorators),
        name: entity.name,
        resolvedType: {
          name: entity.name,
          prettyType: await prettyType(printed),
          type: withoutNamedParameters(printed),
        },
      })
    }

    return omitUndefined({
      comment,
      decorators: nonEmpty(decorators),
      name: entity.name,
      props,
      typeParameters: nonEmpty(typeParameters),
    })
  }

  private groupAngularMembers(
    entity: Entity,
    members: ts.Symbol[],
    props: QuiPropDeclaration[],
  ) {
    const selector = getStructuralSelector(entity.declaration)
    const input: QuiPropDeclaration[] = []
    const output: QuiPropDeclaration[] = []
    const publicMethods: QuiPropDeclaration[] = []

    for (const [index, prop] of props.entries()) {
      const {parameters: _parameters, ...resolvedType} = prop.resolvedType
      const declaration =
        members[index].valueDeclaration ?? members[index].declarations?.[0]
      if (resolvedType.type === "signature") {
        publicMethods.push({...prop, resolvedType})
        continue
      }
      if (!declaration) {
        continue
      }
      const member = analyzeMember(declaration, resolvedType.type ?? undefined)
      if (!member.group) {
        continue
      }
      let name = member.publicName ?? prop.name
      if (selector && member.group === "input") {
        name = toMicrosyntaxName(selector, name)
      }
      const result = {
        ...prop,
        name,
        resolvedType: omitUndefined({
          ...resolvedType,
          name,
          required: member.required || undefined,
        }),
      }
      ;(member.group === "input" ? input : output).push(result)
    }

    return {
      input: nonEmpty(input),
      output: nonEmpty(output),
      publicMethods: nonEmpty(publicMethods),
    }
  }

  private async serializeMember(
    symbol: ts.Symbol,
    ownerKind: Entity["kind"],
    typeParameters: SerializedParameters[],
    owner?: ts.Declaration,
  ): Promise<QuiPropDeclaration> {
    const {checker} = this
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
    const comment = this.memberComment(symbol)
    const name = symbol.name
    const decorators =
      ownerKind === "class" ? nonEmpty(getDecorators(declaration)) : undefined
    const defaultText = getDefaultValue(comment)
    const defaultValue = defaultText ? await prettyType(defaultText) : undefined
    const type = this.memberType(symbol, declaration, owner)

    if (symbol.flags & ts.SymbolFlags.Method || isFunctionValued(declaration)) {
      const [signature] = checker.getSignaturesOfType(
        checker.getNonNullableType(type),
        ts.SignatureKind.Call,
      )
      return omitUndefined({
        comment: this.comment(comment),
        decorators,
        defaultValue,
        name,
        resolvedType: await this.serializeSignature(signature, name, comment),
      })
    }

    if (ownerKind === "enum") {
      const printed = checker.typeToString(type)
      return {
        comment: this.comment(comment),
        name,
        resolvedType: {
          baseType: "literal",
          name,
          prettyType: printed,
          type: printed,
        },
      }
    }

    const typeNode = this.writtenTypeNode(declaration, owner)
    return omitUndefined({
      comment: this.comment(comment),
      decorators,
      defaultValue,
      name,
      resolvedType: await this.serializeValue({
        comment,
        name,
        optional: !!(symbol.flags & ts.SymbolFlags.Optional),
        signalArgument: declaration
          ? getSignalCall(declaration)?.typeArgument
          : undefined,
        type,
        typeNode,
        typeParameters,
      }),
    })
  }

  private async serializeValue(params: ValueParams): Promise<SerializedType> {
    const {checker, printer} = this
    const {comment, name, optional, skipOwnAlias, type, typeNode} = params

    const custom = findTag(comment, "@custom")?.text
    const inheritDoc = !!findTag(comment, "@inheritDoc")
    const reference = findTag(comment, "@custom")
      ? undefined
      : this.withSignalArgument(
          this.referenceOf(withoutNullishNode(typeNode), type, skipOwnAlias),
          typeNode ? undefined : params.signalArgument,
        )
    const kindNode = this.expandedNode(
      optional ? withoutUndefinedNode(typeNode) : typeNode,
      inheritDoc,
    )
    const declaredKind =
      kindNode && resolvedKinds.has(kindOfTypeNode(kindNode))
        ? kindOfType(optional ? withoutUndefined(type) : type, checker)
        : kindOf(kindNode, type, checker)

    const printOptions: PrintOptions = {
      keepNames: inheritDoc,
      node: typeNode,
      signalArgument: params.signalArgument,
      skipOwnAlias,
      stripUndefined: optional,
    }
    let printed: string
    const inlineRefs: InlineRefDecision[] = []
    if (custom) {
      printed = custom
    } else if (inheritDoc && typeNode) {
      printed = nodeText(typeNode)
    } else if (name === "as" && type.flags & ts.TypeFlags.TypeParameter) {
      printed = polymorphicAsType
    } else {
      printed = printer.print(type, {...printOptions, inlineRefs})
    }

    // a reference that prints as its body, such as `Extract<...>` or an alias
    // of an alias, renders as the body.
    const valueType = optional ? withoutUndefined(type) : type
    let baseType = declaredKind
    if (name === "as" && printed === polymorphicAsType) {
      baseType = "union"
    } else if (declaredKind === "reference" && checker.isArrayType(valueType)) {
      baseType = "array"
    } else if (
      declaredKind === "reference" &&
      reference &&
      !printsName(printed, reference.name)
    ) {
      baseType = printed.startsWith("{")
        ? "reflection"
        : /^[A-Za-z_$][\w$.]*</.test(printed)
          ? "reference"
          : kindOfType(valueType, checker, true)
    }

    // the import follows the reference as written, even when it prints as the
    // union or function it expands to.
    const isReference =
      !!reference &&
      (baseType === "reference" ||
        kindOf(withoutNullishNode(typeNode), type, checker) === "reference")
    const [firstArgument] = reference?.typeArguments ?? []
    const firstArgumentReference = firstArgument
      ? this.referenceOf(firstArgument.node, firstArgument.type)
      : undefined

    const callSignature = this.functionSignatureOf(type)

    // signal wrappers are displayed as their value type.
    const signal = signalWrapper.exec(printed)
    const pretty = await prettyTypeWithDecisions(
      signal?.[1] ?? printed,
      shiftDecisions(inlineRefs, signal ? -(printed.indexOf("<") + 1) : 0),
    )
    const collapsed = await collapsedTypesOf(
      inlineRefs,
      () => printer.print(type, {...printOptions, collapseRefs: true}),
      (collapsedPrint) =>
        signalWrapper.exec(collapsedPrint)?.[1] ?? collapsedPrint,
    )

    return omitUndefined({
      ...collapsed,
      baseType,
      deprecated: findTag(comment, "@deprecated") ? true : undefined,
      docLink:
        findTag(comment, "@docLink")?.text ||
        this.docLinkOf(reference?.symbol) ||
        (inheritDoc
          ? this.docLinkOf(firstArgumentReference?.symbol)
          : undefined),
      functionArgs:
        callSignature && !custom
          ? await this.serializeFunctionArgs(callSignature, comment)
          : undefined,
      importStatement: isReference
        ? await this.resolveImport(reference)
        : undefined,
      inheritDoc: inheritDoc || undefined,
      inlineRefs: pretty.inlineRefs,
      isCustomOverride: custom ? true : undefined,
      // the docs UI looks up expanded references on the page by type name.
      name:
        reference &&
        !inheritDoc &&
        !skipOwnAlias &&
        typeNode &&
        ts.isTypeReferenceNode(withoutNullishNode(typeNode) ?? typeNode) &&
        this.printer.shouldExpand(reference.symbol)
          ? reference.name
          : name,
      // an alias declares its type parameters, while a member only lists the
      // owner's type parameters that its type mentions.
      parameters:
        baseType === "intrinsic" || baseType === "literal"
          ? undefined
          : nonEmpty(
              skipOwnAlias
                ? params.typeParameters
                : params.typeParameters?.filter((parameter) =>
                    mentionsName(printed, parameter.name),
                  ),
            ),
      prettyType: pretty.prettyType,
      reference:
        reference?.typeArguments.length === 1 &&
        firstArgumentReference &&
        this.printer.isKnown(firstArgumentReference.symbol)
          ? firstArgumentReference.name
          : undefined,
      referenceLink: reference
        ? this.referenceLinks[reference.name]
        : undefined,
      required: optional ? undefined : true,
      type: withoutNamedParameters(printed),
      typeArgs:
        isReference && reference.typeArguments.length
          ? await Promise.all(
              reference.typeArguments.map((argument) =>
                this.serializeTypeArgument(argument),
              ),
            )
          : undefined,
    })
  }

  /**
   * The type of a member as seen from the documented owner. When the owner
   * inherits the member without passing type arguments, as in
   * `class ComboboxRootDirective extends CoreComboboxRootDirective`, the
   * checker fills in the defaults, so `T` becomes `CollectionItem`, which is
   * `any`. The member keeps its declared type in that case. Explicit type
   * arguments, such as `extends Base<HTMLButtonElement>`, are still applied.
   */
  private memberType(
    symbol: ts.Symbol,
    declaration: ts.Declaration | undefined,
    owner: ts.Declaration | undefined,
  ): ts.Type {
    const {checker} = this
    const type = checker.getTypeOfSymbol(symbol)
    const declaringOwner = declaration?.parent
    if (
      !owner ||
      !declaration ||
      !declaringOwner ||
      declaringOwner === owner ||
      !isHeritageOwner(owner) ||
      !isHeritageOwner(declaringOwner) ||
      !this.inheritsWithDefaults(owner, declaringOwner, new Set())
    ) {
      return type
    }
    const name = ts.getNameOfDeclaration(declaration)
    const declared = name ? checker.getSymbolAtLocation(name) : undefined
    return declared ? checker.getTypeOfSymbol(declared) : type
  }

  /**
   * The type of a member as written for the documented owner. A member
   * declared as `endIcon?: TIcon` in `QdsInputApiProps<TIcon>` is written as
   * `LucideIconOrString` by an owner that `extends
   * QdsInputApiProps<LucideIconOrString>`, which keeps its alias and member
   * order.
   */
  private writtenTypeNode(
    declaration: ts.Declaration | undefined,
    owner: ts.Declaration | undefined,
  ): ts.TypeNode | undefined {
    const typeNode = typeNodeOf(declaration)
    const declaringOwner = declaration?.parent
    const valueNode = withoutUndefinedNode(typeNode)
    if (
      !typeNode ||
      !valueNode ||
      !owner ||
      !declaringOwner ||
      declaringOwner === owner ||
      !isHeritageOwner(owner) ||
      !isHeritageOwner(declaringOwner) ||
      !ts.isTypeReferenceNode(valueNode) ||
      !ts.isIdentifier(valueNode.typeName) ||
      valueNode.typeArguments?.length
    ) {
      return typeNode
    }
    const name = valueNode.typeName.text
    const parameter = declaringOwner.typeParameters?.find(
      (candidate) => candidate.name.text === name,
    )
    if (!parameter) {
      return typeNode
    }
    return (
      this.heritageArgument(owner, declaringOwner, parameter, new Set()) ??
      typeNode
    )
  }

  /**
   * The type argument that `owner` passes for `parameter` of `target`, following
   * intermediate bases that forward their own type parameters.
   */
  private heritageArgument(
    owner: ts.ClassLikeDeclaration | ts.InterfaceDeclaration,
    target: ts.ClassLikeDeclaration | ts.InterfaceDeclaration,
    parameter: ts.TypeParameterDeclaration,
    visited: Set<ts.Node>,
  ): ts.TypeNode | undefined {
    if (visited.has(owner)) {
      return undefined
    }
    visited.add(owner)
    for (const clause of owner.heritageClauses ?? []) {
      for (const heritage of clause.types) {
        const base = this.heritageBase(heritage)
        if (!base) {
          continue
        }
        if (base === target) {
          const index = target.typeParameters?.indexOf(parameter) ?? -1
          return index === -1 ? undefined : heritage.typeArguments?.[index]
        }
        const nested = this.heritageArgument(base, target, parameter, visited)
        if (!nested) {
          continue
        }
        // the intermediate base may forward one of its own type parameters.
        const forwarded =
          ts.isTypeReferenceNode(nested) && ts.isIdentifier(nested.typeName)
            ? base.typeParameters?.findIndex(
                (candidate) =>
                  candidate.name.text ===
                  (nested.typeName as ts.Identifier).text,
              )
            : -1
        if (forwarded === undefined || forwarded === -1) {
          return nested
        }
        return heritage.typeArguments?.[forwarded]
      }
    }
    return undefined
  }

  private heritageBase(
    heritage: ts.ExpressionWithTypeArguments,
  ): ts.ClassLikeDeclaration | ts.InterfaceDeclaration | undefined {
    const located = this.checker.getSymbolAtLocation(heritage.expression)
    const symbol =
      located && located.flags & ts.SymbolFlags.Alias
        ? this.checker.getAliasedSymbol(located)
        : located
    return symbol?.declarations?.find(isHeritageOwner)
  }

  /**
   * Whether `owner` reaches `target` through a heritage clause that omits the
   * type arguments of a generic base. `undefined` when `target` is not a base.
   */
  private inheritsWithDefaults(
    owner: ts.ClassLikeDeclaration | ts.InterfaceDeclaration,
    target: ts.Node,
    visited: Set<ts.Node>,
  ): boolean | undefined {
    if (visited.has(owner)) {
      return undefined
    }
    visited.add(owner)
    for (const clause of owner.heritageClauses ?? []) {
      for (const heritage of clause.types) {
        const base = this.heritageBase(heritage)
        if (!base) {
          continue
        }
        const defaulted =
          !heritage.typeArguments?.length && !!base.typeParameters?.length
        if (base === target) {
          return defaulted
        }
        const nested = this.inheritsWithDefaults(base, target, visited)
        if (nested !== undefined) {
          return defaulted || nested
        }
      }
    }
    return undefined
  }

  /**
   * The signal type `InputSignal<'ltr' | 'rtl' | undefined>` no longer names
   * the `Direction` alias, so the written type argument is used to find it.
   */
  private withSignalArgument(
    reference: NamedReference | undefined,
    signalArgument: ts.TypeNode | undefined,
  ): NamedReference | undefined {
    if (
      !reference ||
      !signalArgument ||
      !isSignalName(reference.name) ||
      !reference.typeArguments.length
    ) {
      return reference
    }
    const node = withoutNullishNode(signalArgument) ?? signalArgument
    const [, ...rest] = reference.typeArguments
    return {
      ...reference,
      typeArguments: [
        {node, type: this.checker.getTypeFromTypeNode(node)},
        ...rest,
      ],
    }
  }

  /**
   * References to aliases that print as their body report the kind of the body,
   * so that `dir: Direction` renders as the union it expands to.
   */
  private expandedNode(
    typeNode: ts.TypeNode | undefined,
    inheritDoc: boolean,
  ): ts.TypeNode | undefined {
    let node = typeNode
    // aliases can name other aliases, such as `type Variant = Emphasis`.
    for (
      let i = 0;
      i < 4 && !inheritDoc && node && ts.isTypeReferenceNode(node);
      i++
    ) {
      const reference = this.referenceOf(
        node,
        this.checker.getTypeFromTypeNode(node),
      )
      const declaration =
        reference && this.printer.shouldExpand(reference.symbol)
          ? reference.symbol.declarations?.find(ts.isTypeAliasDeclaration)
          : undefined
      if (!declaration) {
        break
      }
      node = declaration.type
    }
    return node
  }

  private async serializeTypeArgument(
    argument: TypeArgument,
  ): Promise<SerializedType> {
    const reference = this.referenceOf(argument.node, argument.type)
    const baseType = kindOf(argument.node, argument.type, this.checker)
    const printed = argument.node
      ? nodeText(argument.node)
      : this.printer.print(argument.type, {keepNames: true})
    return omitUndefined({
      baseType,
      importStatement:
        baseType === "reference" && reference
          ? await this.resolveImport(reference)
          : undefined,
      name: printed,
      prettyType: await prettyType(printed),
      type: withoutNamedParameters(printed),
    })
  }

  private functionSignatureOf(type: ts.Type): ts.Signature | undefined {
    if (type.isUnion() || !(type.flags & ts.TypeFlags.Object)) {
      return undefined
    }
    if (this.checker.getPropertiesOfType(type).length) {
      return undefined
    }
    return this.checker.getSignaturesOfType(type, ts.SignatureKind.Call)[0]
  }

  private referenceOf(
    typeNode: ts.TypeNode | undefined,
    type: ts.Type,
    skipOwnAlias?: boolean,
  ): NamedReference | undefined {
    const {checker} = this
    if (typeNode && ts.isTypeReferenceNode(typeNode)) {
      const located = checker.getSymbolAtLocation(typeNode.typeName)
      if (!located) {
        return undefined
      }
      const symbol =
        located.flags & ts.SymbolFlags.Alias
          ? checker.getAliasedSymbol(located)
          : located
      return {
        name: ts.isIdentifier(typeNode.typeName)
          ? typeNode.typeName.text
          : typeNode.typeName.right.text,
        symbol,
        typeArguments: (typeNode.typeArguments ?? []).map((node) => ({
          node,
          type: checker.getTypeFromTypeNode(node),
        })),
      }
    }
    if (typeNode && ts.isArrayTypeNode(typeNode)) {
      return this.referenceOf(
        typeNode.elementType,
        checker.getTypeFromTypeNode(typeNode.elementType),
      )
    }
    if (typeNode) {
      return undefined
    }
    if (type.aliasSymbol && !skipOwnAlias) {
      return {
        name: type.aliasSymbol.name,
        symbol: type.aliasSymbol,
        typeArguments: (type.aliasTypeArguments ?? []).map((argument) => ({
          type: argument,
        })),
      }
    }
    const objectFlags = (type as ts.ObjectType).objectFlags ?? 0
    if (
      type.flags & ts.TypeFlags.Object &&
      objectFlags &
        (ts.ObjectFlags.Reference |
          ts.ObjectFlags.Interface |
          ts.ObjectFlags.Class) &&
      type.symbol
    ) {
      const args =
        objectFlags & ts.ObjectFlags.Reference
          ? checker
              .getTypeArguments(type as ts.TypeReference)
              .slice(
                0,
                (type as ts.TypeReference).target.typeParameters?.length ?? 0,
              )
          : []
      return {
        name: type.symbol.name,
        symbol: type.symbol,
        typeArguments: args.map((argument) => ({type: argument})),
      }
    }
    return undefined
  }

  private toImportReference(
    reference: NamedReference,
  ): ImportReference | undefined {
    const {symbol} = reference
    if (symbol.flags & ts.SymbolFlags.TypeParameter) {
      return undefined
    }
    const declaration = symbol.declarations?.[0]
    const sourcePackage = declaration
      ? this.packages.resolve(declaration.getSourceFile().fileName)
      : undefined
    if (!sourcePackage) {
      return undefined
    }
    const qualifiedName = this.printer.qualifiedName(symbol)
    const [namespace, name] = qualifiedName.includes(".")
      ? qualifiedName.split(".")
      : [undefined, qualifiedName]
    return {
      ...sourcePackage,
      name,
      namespace,
      qualifiedName,
      typeArguments: reference.typeArguments.map((argument) => {
        const argumentReference = this.referenceOf(argument.node, argument.type)
        return argumentReference
          ? this.toImportReference(argumentReference)
          : undefined
      }),
    }
  }

  private async resolveImport(
    reference: NamedReference,
  ): Promise<string | undefined> {
    if (!this.importResolver) {
      return undefined
    }
    if (isSignalName(reference.symbol.name)) {
      const [argument] = reference.typeArguments
      const inner = argument
        ? this.referenceOf(argument.node, argument.type)
        : undefined
      if (inner) {
        return this.resolveImport(inner)
      }
    }
    const importReference = this.toImportReference(reference)
    return importReference ? this.callResolver(importReference) : undefined
  }

  private async callResolver(
    reference: ImportReference,
  ): Promise<string | undefined> {
    const params: ImportResolverParams = {
      ...reference,
      resolveImport: (next) => this.callResolver(next),
    }
    return (await this.importResolver?.(params)) ?? undefined
  }

  private typeParameters(
    declaration: ts.Declaration,
    comment: ParsedComment,
  ): SerializedParameters[] {
    const nodes =
      "typeParameters" in declaration
        ? ((declaration.typeParameters as
            | ts.NodeArray<ts.TypeParameterDeclaration>
            | undefined) ?? [])
        : []
    return nodes.map((node) => this.serializeTypeParameter(node, comment))
  }

  private serializeTypeParameter(
    node: ts.TypeParameterDeclaration,
    comment: ParsedComment,
  ): SerializedParameters {
    // aliases keep their names, so `C extends ElementType` does not print as
    // the union of every element name.
    const print = (typeNode: ts.TypeNode | undefined) =>
      typeNode
        ? withoutNamedParameters(
            this.printer.print(this.checker.getTypeFromTypeNode(typeNode), {
              keepNames: true,
              node: typeNode,
            }),
          )
        : undefined
    const defaultValue = print(node.default)
    const constraint = print(node.constraint)
    return omitUndefined({
      constraint,
      defaultValue,
      name: node.name.text,
      required: node.default ? undefined : true,
      summary: getParamComment(comment, "@template", node.name.text),
      type: constraint ?? defaultValue ?? "any",
    })
  }

  private parameterName(parameter: ts.Symbol): string {
    const declaration = parameter.valueDeclaration
    return declaration &&
      ts.isParameter(declaration) &&
      !ts.isIdentifier(declaration.name)
      ? namedParameters
      : parameter.name
  }

  private parameterInfo(parameter: ts.Symbol) {
    const {checker, printer} = this
    const declaration = parameter.valueDeclaration
    const isParameter = !!declaration && ts.isParameter(declaration)
    const rest = isParameter && !!declaration.dotDotDotToken
    const optional =
      isParameter && !rest && checker.isOptionalParameter(declaration)
    const type = checker.getTypeOfSymbol(parameter)
    const typeNode = isParameter ? declaration.type : undefined
    const baseType = kindOf(typeNode, type, checker)
    const reference =
      baseType === "reference" ? this.referenceOf(typeNode, type) : undefined
    const inlineRefs: InlineRefDecision[] = []
    return {
      baseType,
      inlineRefs,
      optional,
      printCollapsed: () =>
        printer.print(type, {collapseRefs: true, stripUndefined: optional}),
      printed: printer.print(type, {inlineRefs, stripUndefined: optional}),
      reference,
      rest,
      type,
    }
  }

  /**
   * Properties of a documented interface that a parameter references, so that
   * option objects can be documented inline.
   */
  private referencedMembers(reference: NamedReference | undefined) {
    if (!reference || !this.printer.isDocumentedInterface(reference.symbol)) {
      return undefined
    }
    return this.checker
      .getPropertiesOfType(
        this.checker.getDeclaredTypeOfSymbol(reference.symbol),
      )
      .filter((member) => !isExternalMember(member))
  }

  private async serializeFunctionArgs(
    signature: ts.Signature,
    comment: ParsedComment,
  ): Promise<SerializedParameters[]> {
    return Promise.all(
      signature.getParameters().map(async (parameter) => {
        const name = this.parameterName(parameter)
        const info = this.parameterInfo(parameter)
        const members = this.referencedMembers(info.reference)
        return omitUndefined({
          args: members
            ? await Promise.all(
                members.map(async (member) => {
                  const memberComment = getSymbolComment(member)
                  const optional = !!(member.flags & ts.SymbolFlags.Optional)
                  const memberType = this.checker.getTypeOfSymbol(member)
                  const printed = this.printer.print(memberType, {
                    stripUndefined: optional,
                  })
                  return omitUndefined({
                    baseType: kindOf(
                      typeNodeOf(member.valueDeclaration),
                      memberType,
                      this.checker,
                    ),
                    name: member.name,
                    prettyType: await prettyType(printed),
                    required: optional ? undefined : true,
                    summary: memberComment.summary
                      ? toDisplayParts(memberComment.summary)
                      : undefined,
                    type: withoutNamedParameters(printed),
                  })
                }),
              )
            : undefined,
          baseType: info.baseType,
          name,
          prettyType: await prettyType(info.printed),
          referenceType: info.reference?.name,
          required: !info.optional,
          rest: info.rest || undefined,
          summary: getParamComment(comment, "@param", name),
          type: withoutNamedParameters(info.printed),
        })
      }),
    )
  }

  private async serializeSignature(
    signature: ts.Signature | undefined,
    name: string,
    comment: ParsedComment,
  ): Promise<SerializedType> {
    if (!signature) {
      return {name, prettyType: "any", type: "any"}
    }
    const custom = findTag(comment, "@custom")?.text
    const inheritDoc = !!findTag(comment, "@inheritDoc")

    const parameters = signature.getParameters().map((parameter, index) => {
      const info = this.parameterInfo(parameter)
      return {
        info,
        parameter,
        prefix: `${index ? ", " : ""}${info.rest ? "..." : ""}${this.parameterName(parameter)}${info.optional ? "?" : ""}: `,
      }
    })
    const functionParameters = await Promise.all(
      parameters.map(({info, parameter}) =>
        this.serializeParameterAsProp(parameter, comment, info),
      ),
    )
    const returnDecisions: InlineRefDecision[] = []
    const returnType =
      custom ??
      this.printer.printReturnType(signature, {inlineRefs: returnDecisions})

    let signatureText = "("
    const decisions: InlineRefDecision[] = []
    for (const {info, prefix} of parameters) {
      signatureText += prefix
      decisions.push(...shiftDecisions(info.inlineRefs, signatureText.length))
      signatureText += info.printed
    }
    signatureText += ") => "
    decisions.push(...shiftDecisions(returnDecisions, signatureText.length))
    signatureText += returnType
    const pretty = await prettyTypeWithDecisions(signatureText, decisions)
    // signatures have no one-line form, since their `type` is "signature".
    const {collapsedPrettyType} = await collapsedTypesOf(
      decisions,
      () =>
        `(${parameters.map(({info, prefix}) => `${prefix}${info.printCollapsed()}`).join("")}) => ${custom ?? this.printer.printReturnType(signature, {collapseRefs: true})}`,
    )

    return omitUndefined({
      baseType: "reflection",
      collapsedPrettyType,
      deprecated: findTag(comment, "@deprecated") ? true : undefined,
      docLink: findTag(comment, "@docLink")?.text || undefined,
      functionParameters: nonEmpty(functionParameters),
      inheritDoc: inheritDoc || undefined,
      inlineRefs: pretty.inlineRefs,
      isCustomOverride: custom ? true : undefined,
      name,
      prettyType: pretty.prettyType,
      returnType: withoutNamedParameters(returnType),
      type: "signature",
    })
  }

  private async serializeParameterAsProp(
    parameter: ts.Symbol,
    ownerComment: ParsedComment,
    info = this.parameterInfo(parameter),
  ): Promise<QuiPropDeclaration> {
    const name = this.parameterName(parameter)
    const members = this.referencedMembers(info.reference)
    const summary = getParamComment(ownerComment, "@param", name)
    const pretty = await prettyTypeWithDecisions(info.printed, info.inlineRefs)
    const collapsed = await collapsedTypesOf(
      info.inlineRefs,
      info.printCollapsed,
    )

    return omitUndefined({
      args: members
        ? await Promise.all(
            members.map((member) =>
              this.serializeMember(member, "interface", []),
            ),
          )
        : undefined,
      comment: summary ? {summary} : undefined,
      name,
      resolvedType: omitUndefined({
        ...collapsed,
        baseType: info.baseType,
        inlineRefs: pretty.inlineRefs,
        name,
        prettyType: pretty.prettyType,
        referencedType: info.reference?.name,
        required: !info.optional,
        type: withoutNamedParameters(info.printed),
      }),
      rest: info.rest || undefined,
    })
  }
}
