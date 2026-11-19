// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import ts from "typescript"

import type {InlineObjectDecision} from "@qualcomm-ui/typedoc-common"

import {formatObjectPropertyName} from "../guards.js"
import type {InlineObjectOptions} from "../types.js"

import {isExternalMember} from "./collect.js"
import {namedParameters} from "./pretty.js"

const checkerFlags =
  ts.TypeFormatFlags.NoTruncation |
  ts.TypeFormatFlags.UseSingleQuotesForStringLiteralType |
  ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
  ts.TypeFormatFlags.WriteArrowStyleSignature

/**
 * Nested expansions of named types are capped so that deeply linked models
 * remain readable.
 */
const maxExpansionDepth = 3

/**
 * Anonymous types can recurse without passing through a named type, for example
 * through intersections in JSX attribute types. Past this nesting level the
 * checker prints the type instead.
 */
const maxNestingLevel = 8

/**
 * Documented object types that print within `maxLength` characters, with at
 * most `maxMembers` members, expand inline. `{state: string}` reads better than
 * a name that the reader has to look up.
 */
export const defaultInlineObjects: Required<InlineObjectOptions> = {
  maxLength: 100,
  maxMembers: 6,
}

const signalNames = new Set([
  "InputSignal",
  "InputSignalWithTransform",
  "ModelSignal",
  "OutputEmitterRef",
])

/**
 * Private use characters delimit the spans of inline object decisions while
 * printing. Printed strings are composed bottom-up, so their final offsets are
 * only known once the whole type is printed.
 */
const markStart = "\uE000"
const markEnd = "\uE001"
const markClose = "\uE002"
const markPattern = /[\uE000\uE001](\d+)\uE002/g

function stripMarks(text: string): string {
  return text.replace(markPattern, "")
}

export interface PrintOptions {
  /**
   * Replace union aliases with their members, such as `DateValue` with
   * `CalendarDate | CalendarDateTime | ZonedDateTime`.
   */
  expandAliases?: boolean

  /**
   * Receives the small object types considered for inlining, in the order they
   * appear in the printed type. Offsets are relative to the printed type.
   */
  inlineObjects?: InlineObjectDecision[]

  /**
   * Keep every named type by name instead of expanding it.
   */
  keepNames?: boolean

  /**
   * The type as written. Union members print in the written order when it
   * describes the same type.
   */
  node?: ts.TypeNode

  /**
   * The value type written as the type argument of a signal initializer, such
   * as `DateValue | undefined` in `input<DateValue | undefined>()`. The signal
   * value prints from it, so aliases and the written member order survive the
   * removal of `undefined`.
   */
  signalArgument?: ts.TypeNode

  /**
   * Print the structure of the type even if it is a named alias, for the alias
   * declaration itself.
   */
  skipOwnAlias?: boolean

  /**
   * Removes `undefined` from a top-level union, for optional members.
   */
  stripUndefined?: boolean
}

interface PrintContext {
  depth: number
  expandAliases: boolean
  /**
   * Inside the type arguments of a generic that kept its name. Names stay as
   * written there, so `BindableIds<ComboboxSchema>` does not inline the schema.
   */
  inTypeArgument: boolean
  keepNames: boolean
  /**
   * Inline object decisions by marker id. Only set when the caller collects
   * decisions, so that no markers are printed otherwise.
   */
  marks: Map<number, Omit<InlineObjectDecision, "end" | "start">> | undefined
  signalArgument: ts.TypeNode | undefined

  stack: Set<ts.Symbol>
  /**
   * Types on the current print path. Unlike {@link stack}, this is shared and
   * mutated, since printing is synchronous.
   */
  visiting: Set<ts.Type>
}

export interface TypePrinterParams {
  checker: ts.TypeChecker
  /**
   * Overrides {@link defaultInlineObjects}.
   */
  inlineObjects?: InlineObjectOptions
  /**
   * Named types declared in documented files expand into their structure.
   */
  isDocumented: (symbol: ts.Symbol) => boolean
}

export function isOpaqueAliasDeclaration(symbol: ts.Symbol): boolean {
  const declaration = symbol.declarations?.find(ts.isTypeAliasDeclaration)
  return (
    !!declaration &&
    (ts.isConditionalTypeNode(declaration.type) ||
      ts.isMappedTypeNode(declaration.type))
  )
}

export function isSignalName(name: string | undefined): boolean {
  return !!name && signalNames.has(name)
}

export function removeUndefined(type: ts.Type): ts.Type[] {
  return type.isUnion()
    ? type.types.filter((member) => !(member.flags & ts.TypeFlags.Undefined))
    : [type]
}

function needsParens(type: ts.Type, checker: ts.TypeChecker): boolean {
  if (type.aliasSymbol) {
    return false
  }
  if (type.flags & ts.TypeFlags.Object) {
    const objectType = type as ts.ObjectType
    return (
      !!(objectType.objectFlags & ts.ObjectFlags.Anonymous) &&
      (checker.getSignaturesOfType(type, ts.SignatureKind.Call).length > 0 ||
        checker.getSignaturesOfType(type, ts.SignatureKind.Construct).length >
          0) &&
      !checker.getPropertiesOfType(type).length
    )
  }
  return false
}

function isSimpleElement(type: ts.Type): boolean {
  return (
    !type.aliasSymbol &&
    !!(
      type.flags &
      (ts.TypeFlags.Literal |
        ts.TypeFlags.String |
        ts.TypeFlags.Number |
        ts.TypeFlags.Boolean |
        ts.TypeFlags.BigInt |
        ts.TypeFlags.Any |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.Null |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.ESSymbol)
    )
  )
}

/**
 * Prints types from the TypeScript checker. Known named types expand into their
 * structure so that a reader sees `'square' | 'round'` in place of an alias name.
 */
export class TypePrinter {
  private readonly checker: ts.TypeChecker
  private readonly inlineObjects: Required<InlineObjectOptions>
  private readonly isDocumented: (symbol: ts.Symbol) => boolean
  private readonly objectLike = new Map<ts.Symbol, boolean>()

  constructor(params: TypePrinterParams) {
    this.checker = params.checker
    this.inlineObjects = {...defaultInlineObjects, ...params.inlineObjects}
    this.isDocumented = params.isDocumented
  }

  /**
   * Interfaces and aliases of object types, as opposed to aliases of unions,
   * literals, and functions.
   */
  private isObjectLike(symbol: ts.Symbol): boolean {
    let result = this.objectLike.get(symbol)
    if (result === undefined) {
      if (symbol.flags & ts.SymbolFlags.Interface) {
        result = true
      } else {
        const type = this.checker.getDeclaredTypeOfSymbol(symbol)
        result =
          type.isIntersection() ||
          (!!(type.flags & ts.TypeFlags.Object) &&
            !this.checker.isArrayType(type) &&
            !this.checker.isTupleType(type) &&
            !(
              this.checker.getSignaturesOfType(type, ts.SignatureKind.Call)
                .length && !this.checker.getPropertiesOfType(type).length
            ))
      }
      this.objectLike.set(symbol, result)
    }
    return result
  }

  print(type: ts.Type, options: PrintOptions = {}): string {
    const ctx = this.createContext(options)
    const printed =
      options.skipOwnAlias && type.aliasSymbol
        ? this.printAliasBody(
            type,
            type.aliasSymbol,
            this.enter(type.aliasSymbol, ctx),
          )
        : this.printHinted(type, options.node, ctx, !!options.stripUndefined)
    return this.finish(printed, ctx, options)
  }

  /**
   * Removes the decision markers from the printed type and reports the
   * decisions whose markers survived. Decisions made for text that was printed
   * and then discarded have no markers.
   */
  private finish(
    printed: string,
    ctx: PrintContext,
    options: PrintOptions,
  ): string {
    if (!ctx.marks || !options.inlineObjects) {
      return printed
    }
    const starts = new Map<number, number>()
    const ends = new Map<number, number>()
    let text = ""
    let last = 0
    for (const match of printed.matchAll(markPattern)) {
      text += printed.slice(last, match.index)
      last = match.index + match[0].length
      const id = Number(match[1])
      ;(match[0][0] === markStart ? starts : ends).set(id, text.length)
    }
    text += printed.slice(last)
    const decisions: InlineObjectDecision[] = []
    for (const [id, decision] of ctx.marks) {
      const start = starts.get(id)
      const end = ends.get(id)
      if (start !== undefined && end !== undefined) {
        decisions.push({...decision, end, start})
      }
    }
    decisions.sort((a, b) => a.start - b.start || b.end - a.end)
    options.inlineObjects.push(...decisions)
    return text
  }

  private mark(id: number, text: string): string {
    return `${markStart}${id}${markClose}${text}${markEnd}${id}${markClose}`
  }

  /**
   * Prints a type with the syntax that declared it. The checker orders union
   * members by creation, so `'xs' | 'sm' | 'md'` can come back as
   * `'sm' | 'md' | 'xs'`. The written order is used when it lists the same
   * members.
   */
  private printHinted(
    type: ts.Type,
    node: ts.TypeNode | undefined,
    ctx: PrintContext,
    stripUndefined: boolean,
  ): string {
    const ordered = node
      ? this.orderedMembers(type, node, stripUndefined)
      : undefined
    if (ordered) {
      return ordered.length === 1
        ? this.printType(ordered[0], ctx)
        : this.printUnionMembers(ordered, ctx)
    }
    if (stripUndefined && type.isUnion()) {
      const members = removeUndefined(type)
      if (members.length === 1) {
        return this.printType(members[0], ctx)
      }
      if (members.length !== type.types.length) {
        return this.printUnionMembers(members, ctx)
      }
    }
    return this.printType(type, ctx)
  }

  private orderedMembers(
    type: ts.Type,
    node: ts.TypeNode,
    stripUndefined: boolean,
  ): ts.Type[] | undefined {
    const unionNode = withoutParens(node)
    if (!type.isUnion()) {
      return undefined
    }
    /**
     * An optional `children?: ReactNode` has the type `ReactNode | undefined`.
     * Removing `undefined` from its members would print the members of
     * `ReactNode` instead of its name, so the written type is kept when it
     * covers the remaining members.
     */
    const memberNodes = ts.isUnionTypeNode(unionNode)
      ? unionNode.types
      : stripUndefined
        ? [unionNode]
        : undefined
    if (!memberNodes) {
      return undefined
    }
    const isKept = (member: ts.Type) =>
      !stripUndefined || !(member.flags & ts.TypeFlags.Undefined)
    const expected = new Set(type.types.filter(isKept))
    const ordered: ts.Type[] = []
    const covered = new Set<ts.Type>()
    for (const memberNode of memberNodes) {
      const member = this.checker.getTypeFromTypeNode(memberNode)
      const flattened = member.isUnion() ? member.types : [member]
      if (!flattened.some(isKept)) {
        continue
      }
      for (const part of flattened) {
        if (isKept(part)) {
          covered.add(part)
        }
      }
      ordered.push(member)
    }
    if (
      covered.size !== expected.size ||
      [...covered].some((member) => !expected.has(member))
    ) {
      return undefined
    }
    return ordered
  }

  private expandsUnionAlias(
    type: ts.Type,
    alias: ts.Symbol,
    ctx: PrintContext,
  ): boolean {
    return (
      ctx.expandAliases &&
      type.isUnion() &&
      !ctx.inTypeArgument &&
      ctx.depth < maxExpansionDepth &&
      !ctx.stack.has(alias) &&
      // `ReactNode` and friends stay named, as in the displayed type.
      this.displayName(alias) === this.qualifiedName(alias)
    )
  }

  private printAliasBody(
    type: ts.Type,
    alias: ts.Symbol,
    ctx: PrintContext,
  ): string {
    const declaration = alias.declarations?.find(ts.isTypeAliasDeclaration)
    const ordered = declaration
      ? this.orderedMembers(type, declaration.type, false)
      : undefined
    if (ordered) {
      return this.printUnionMembers(ordered, ctx)
    }
    const body = declaration?.type
    if (
      body &&
      ts.isTypeReferenceNode(body) &&
      this.checker.getDeclaredTypeOfSymbol(alias) === type
    ) {
      // `type PropsOf<C> = JSX.LibraryManagedAttributes<C, ...>` prints the
      // reference as written instead of the conditional type it resolves to.
      const referenced = this.checker.getTypeFromTypeNode(body)
      if (referenced.aliasSymbol && referenced.aliasSymbol !== alias) {
        return this.printType(referenced, ctx)
      }
      const target = this.checker.getSymbolAtLocation(body.typeName)
      if (target && referenced.flags & ts.TypeFlags.Conditional) {
        const resolved =
          target.flags & ts.SymbolFlags.Alias
            ? this.checker.getAliasedSymbol(target)
            : target
        const args = (body.typeArguments ?? []).map((argument) =>
          this.printType(this.checker.getTypeFromTypeNode(argument), {
            ...ctx,
            inTypeArgument: true,
          }),
        )
        const name = this.displayName(resolved)
        return args.length ? `${name}<${args.join(", ")}>` : name
      }
    }
    return this.printStructure(type, ctx, true)
  }

  /**
   * Prints the members of an interface or class instance type.
   */
  printObjectMembers(type: ts.Type): string {
    return this.printMembers(type, this.createContext({}), true)
  }

  printSignature(signature: ts.Signature, options: PrintOptions = {}): string {
    const ctx = this.createContext(options)
    return this.finish(this.printSignatureWith(signature, ctx), ctx, options)
  }

  private createContext(options: PrintOptions): PrintContext {
    return {
      depth: 0,
      expandAliases: !!options.expandAliases,
      inTypeArgument: false,
      keepNames: !!options.keepNames,
      marks: options.inlineObjects ? new Map() : undefined,
      signalArgument: options.signalArgument,
      stack: new Set(),
      visiting: new Set(),
    }
  }

  /**
   * Whether references to this named type print as its structure. Only aliases
   * of value-like types expand, such as literal unions and function types.
   * Interfaces and object types keep their name so that tables stay readable.
   */
  shouldExpand(symbol: ts.Symbol): boolean {
    if (
      symbol.flags &
      (ts.SymbolFlags.Class | ts.SymbolFlags.Enum | ts.SymbolFlags.Interface)
    ) {
      return false
    }
    return (
      this.isDocumented(symbol) &&
      !isOpaqueAliasDeclaration(symbol) &&
      !this.isObjectLike(symbol)
    )
  }

  /**
   * Whether the named type is one of the documented entities.
   */
  isKnown(symbol: ts.Symbol): boolean {
    return this.isDocumented(symbol)
  }

  /**
   * Whether the documented interface behind a reference can be listed member
   * by member, for option object parameters.
   */
  isDocumentedInterface(symbol: ts.Symbol): boolean {
    return (
      !!(symbol.flags & ts.SymbolFlags.Interface) && this.isDocumented(symbol)
    )
  }

  private canExpand(symbol: ts.Symbol, ctx: PrintContext): boolean {
    return (
      !ctx.keepNames &&
      !ctx.inTypeArgument &&
      ctx.depth < maxExpansionDepth &&
      !ctx.stack.has(symbol) &&
      this.shouldExpand(symbol)
    )
  }

  /**
   * Prints a documented interface or object alias inline when it is small.
   * When the object is considered but too long, the name printed by
   * `printName` is marked as the decision's span.
   */
  private printSmallObject(
    type: ts.Type,
    symbol: ts.Symbol,
    ctx: PrintContext,
    printName: () => string,
  ): string | undefined {
    const {checker} = this
    if (
      ctx.keepNames ||
      ctx.inTypeArgument ||
      ctx.depth >= maxExpansionDepth ||
      ctx.stack.has(symbol) ||
      symbol.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Enum) ||
      !this.isDocumented(symbol) ||
      isOpaqueAliasDeclaration(symbol) ||
      !(type.flags & ts.TypeFlags.Object) ||
      checker.getIndexInfosOfType(type).length ||
      checker.getSignaturesOfType(type, ts.SignatureKind.Call).length ||
      checker.getSignaturesOfType(type, ts.SignatureKind.Construct).length
    ) {
      return undefined
    }
    const members = checker
      .getPropertiesOfType(type)
      .filter((member) => !isExternalMember(member))
    if (!members.length || members.length > this.inlineObjects.maxMembers) {
      return undefined
    }
    const inner = this.enter(symbol, ctx)
    // the expanded type inlines the same objects as the displayed type, so the
    // length is measured without expanding aliases.
    const printed = this.printMembers(
      type,
      {...inner, expandAliases: false},
      true,
    )
    const inlined = stripMarks(printed).length <= this.inlineObjects.maxLength
    const name = this.displayName(symbol)
    const id = ctx.marks?.size ?? 0
    ctx.marks?.set(id, {inlined, name})
    if (!inlined) {
      if (!ctx.marks) {
        return undefined
      }
      const named = printName()
      return `${this.mark(id, named.slice(0, name.length))}${named.slice(name.length)}`
    }
    const body = ctx.expandAliases
      ? this.printMembers(type, inner, true)
      : printed
    return ctx.marks ? this.mark(id, body) : body
  }

  private enter(symbol: ts.Symbol, ctx: PrintContext): PrintContext {
    return {...ctx, depth: ctx.depth + 1, stack: new Set(ctx.stack).add(symbol)}
  }

  private printType(type: ts.Type, ctx: PrintContext): string {
    if (ctx.visiting.has(type) || ctx.visiting.size >= maxNestingLevel) {
      // the checker truncates long output without NoTruncation, which bounds
      // recursive types that instantiate a new type at every level.
      return this.checker.typeToString(
        type,
        undefined,
        checkerFlags & ~ts.TypeFormatFlags.NoTruncation,
      )
    }
    ctx.visiting.add(type)
    try {
      return this.printTypeWith(type, ctx)
    } finally {
      ctx.visiting.delete(type)
    }
  }

  private printTypeWith(type: ts.Type, ctx: PrintContext): string {
    const alias = type.aliasSymbol
    if (alias) {
      if (
        this.canExpand(alias, ctx) ||
        this.expandsUnionAlias(type, alias, ctx)
      ) {
        return this.printAliasBody(type, alias, this.enter(alias, ctx))
      }
      const printName = () =>
        this.printNamed(
          this.displayName(alias),
          type.aliasTypeArguments ?? [],
          ctx,
          alias,
        )
      return this.printSmallObject(type, alias, ctx, printName) ?? printName()
    }
    return this.printStructure(type, ctx, false)
  }

  private printStructure(
    type: ts.Type,
    ctx: PrintContext,
    isAliasBody: boolean,
  ): string {
    const {checker} = this
    if (type.isUnion()) {
      return this.printUnionMembers(sortNumberLiterals(type.types), ctx)
    }
    if (type.isIntersection()) {
      return type.types
        .map((member) => {
          const printed = this.printType(member, ctx)
          return member.isUnion() && !member.aliasSymbol
            ? `(${printed})`
            : needsParens(member, checker)
              ? `(${printed})`
              : printed
        })
        .join(" & ")
    }
    if (type.flags & ts.TypeFlags.Object) {
      return this.printObject(type as ts.ObjectType, ctx, isAliasBody)
    }
    return checker.typeToString(
      type,
      undefined,
      checkerFlags | (isAliasBody ? ts.TypeFormatFlags.InTypeAlias : 0),
    )
  }

  private printUnionMembers(
    members: readonly ts.Type[],
    ctx: PrintContext,
  ): string {
    const printed: string[] = []
    const trailing: string[] = []
    let hasTrue = false
    let hasFalse = false
    for (const member of members) {
      if (member.flags & ts.TypeFlags.BooleanLiteral) {
        const intrinsicName = (member as ts.Type & {intrinsicName?: string})
          .intrinsicName
        if (intrinsicName === "true") {
          hasTrue = true
        } else {
          hasFalse = true
        }
        continue
      }
      if (member.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)) {
        trailing.push(this.printType(member, ctx))
        continue
      }
      const text = this.printType(member, ctx)
      printed.push(needsParens(member, this.checker) ? `(${text})` : text)
    }
    if (hasTrue && hasFalse) {
      printed.push("boolean")
    } else if (hasTrue) {
      printed.push("true")
    } else if (hasFalse) {
      printed.push("false")
    }
    trailing.sort((a, b) => (a === "null" ? -1 : b === "null" ? 1 : 0))
    // members that print the same apart from decision markers are duplicates.
    const seen = new Set<string>()
    return [...printed, ...trailing]
      .filter((text) => {
        const key = stripMarks(text)
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
      .join(" | ")
  }

  private printObject(
    type: ts.ObjectType,
    ctx: PrintContext,
    isAliasBody: boolean,
  ): string {
    const {checker} = this

    if (checker.isArrayType(type)) {
      const [element] = checker.getTypeArguments(type as ts.TypeReference)
      const printed = this.printType(element, ctx)
      const readonly = type.symbol?.name === "ReadonlyArray"
      if (readonly) {
        return `ReadonlyArray<${printed}>`
      }
      return isSimpleElement(element) ? `${printed}[]` : `Array<${printed}>`
    }

    if (checker.isTupleType(type)) {
      return this.printTuple(type as ts.TypeReference, ctx)
    }

    if (
      type.objectFlags &
        (ts.ObjectFlags.Reference |
          ts.ObjectFlags.Interface |
          ts.ObjectFlags.Class) &&
      type.symbol
    ) {
      return this.printInterfaceReference(type, type.symbol, ctx)
    }

    // the static side of a class, such as `typeof ListSelection`.
    if (
      type.symbol &&
      type.symbol.flags & ts.SymbolFlags.Class &&
      type.objectFlags & ts.ObjectFlags.Anonymous
    ) {
      return `typeof ${this.displayName(type.symbol)}`
    }

    if (type.objectFlags & ts.ObjectFlags.Mapped) {
      return checker.typeToString(
        type,
        undefined,
        checkerFlags | (isAliasBody ? ts.TypeFormatFlags.InTypeAlias : 0),
      )
    }

    const properties = checker.getPropertiesOfType(type)
    const callSignatures = checker.getSignaturesOfType(
      type,
      ts.SignatureKind.Call,
    )
    const constructSignatures = checker.getSignaturesOfType(
      type,
      ts.SignatureKind.Construct,
    )
    const indexInfos = checker.getIndexInfosOfType(type)
    if (!properties.length && !indexInfos.length) {
      if (callSignatures.length) {
        return this.printSignatureWith(callSignatures[0], ctx)
      }
      if (constructSignatures.length) {
        return `new ${this.printSignatureWith(constructSignatures[0], ctx)}`
      }
    }
    if (type.symbol?.flags & ts.SymbolFlags.Enum) {
      return checker.typeToString(type, undefined, checkerFlags)
    }
    return this.printMembers(type, ctx)
  }

  private printInterfaceReference(
    reference: ts.ObjectType,
    symbol: ts.Symbol,
    ctx: PrintContext,
  ): string {
    if (this.canExpand(symbol, ctx)) {
      return this.printMembers(reference, this.enter(symbol, ctx), true)
    }
    const printName = () =>
      this.printNamed(
        this.displayName(symbol),
        this.typeArgumentsOf(reference),
        ctx,
        symbol,
      )
    return (
      this.printSmallObject(reference, symbol, ctx, printName) ?? printName()
    )
  }

  private typeArgumentsOf(type: ts.ObjectType): readonly ts.Type[] {
    if (!(type.objectFlags & ts.ObjectFlags.Reference)) {
      return []
    }
    const reference = type as ts.TypeReference
    const count = reference.target.typeParameters?.length ?? 0
    return this.checker.getTypeArguments(reference).slice(0, count)
  }

  /**
   * Drops trailing type arguments that equal the type parameter's default, so
   * `JsonNode` does not print as `JsonNode<any>`.
   */
  private withoutDefaults(
    symbol: ts.Symbol | undefined,
    args: readonly ts.Type[],
  ): readonly ts.Type[] {
    const parameters = symbol ? this.typeParametersOf(symbol) : []
    let end = args.length
    while (end > 0) {
      const parameter = parameters[end - 1]
      const defaultType = parameter
        ? this.checker.getDefaultFromTypeParameter(parameter)
        : undefined
      if (!defaultType || defaultType !== args[end - 1]) {
        break
      }
      end--
    }
    return args.slice(0, end)
  }

  private typeParametersOf(symbol: ts.Symbol): readonly ts.TypeParameter[] {
    if (symbol.flags & ts.SymbolFlags.TypeAlias) {
      const declaration = symbol.declarations?.find(ts.isTypeAliasDeclaration)
      return (declaration?.typeParameters ?? []).map((node) =>
        this.checker.getTypeAtLocation(node),
      )
    }
    const declared = this.checker.getDeclaredTypeOfSymbol(symbol)
    return (declared as ts.InterfaceType).typeParameters ?? []
  }

  private printNamed(
    name: string,
    args: readonly ts.Type[],
    ctx: PrintContext,
    symbol?: ts.Symbol,
  ): string {
    if (isSignalName(name)) {
      return this.printSignal(name, args, ctx)
    }
    const shown = this.withoutDefaults(symbol, args)
    if (!shown.length) {
      return name
    }
    const argumentContext = {...ctx, inTypeArgument: true}
    return `${name}<${shown.map((arg) => this.printType(arg, argumentContext)).join(", ")}>`
  }

  /**
   * Angular signal wrappers are normalized: transforms only show the read type,
   * and the `undefined` that `input()` adds for a missing initial value is
   * dropped for inputs and models.
   */
  private printSignal(
    name: string,
    args: readonly ts.Type[],
    ctx: PrintContext,
  ): string {
    const [first] = args
    if (!first) {
      return name
    }
    const wrapper = name === "InputSignalWithTransform" ? "InputSignal" : name
    // only the member's own signal was written with this argument.
    const inner = this.printHinted(
      first,
      ctx.signalArgument,
      {...ctx, signalArgument: undefined},
      name !== "OutputEmitterRef",
    )
    return `${wrapper}<${inner}>`
  }

  private printTuple(type: ts.TypeReference, ctx: PrintContext): string {
    const target = type.target as ts.TupleType
    const elements = this.checker.getTypeArguments(type).map((element, i) => {
      const flags = target.elementFlags[i]
      const printed = this.printType(element, ctx)
      if (flags & ts.ElementFlags.Rest) {
        return `...${printed}[]`
      }
      if (flags & ts.ElementFlags.Variadic) {
        return `...${printed}`
      }
      return flags & ts.ElementFlags.Optional ? `${printed}?` : printed
    })
    return `${target.readonly ? "readonly " : ""}[${elements.join(", ")}]`
  }

  /**
   * @param ownMembersOnly leave out members inherited from dependencies, for
   * expansions of documented interfaces.
   */
  private printMembers(
    type: ts.Type,
    ctx: PrintContext,
    ownMembersOnly = false,
  ): string {
    const {checker} = this
    const members: string[] = []
    for (const info of checker.getIndexInfosOfType(type)) {
      members.push(
        `[key: ${this.printType(info.keyType, ctx)}]: ${this.printType(info.type, ctx)};`,
      )
    }
    for (const property of checker.getPropertiesOfType(type)) {
      if (
        property.name.startsWith("__#") ||
        property.name.startsWith("#") ||
        (ownMembersOnly && isExternalMember(property))
      ) {
        continue
      }
      const optional = !!(property.flags & ts.SymbolFlags.Optional)
      const propertyType = checker.getTypeOfSymbol(property)
      const printed = this.printHinted(
        propertyType,
        declaredTypeNode(property),
        ctx,
        optional && !declaresUndefined(property),
      )
      members.push(
        `${formatObjectPropertyName(property.name)}${optional ? "?" : ""}: ${printed};`,
      )
    }
    return `{${members.join(" ")}}`
  }

  private printSignatureWith(
    signature: ts.Signature,
    ctx: PrintContext,
  ): string {
    const {checker} = this
    const parameters = signature.getParameters().map((parameter) => {
      const declaration = parameter.valueDeclaration
      const isParameter = !!declaration && ts.isParameter(declaration)
      const rest = isParameter && !!declaration.dotDotDotToken
      const optional =
        isParameter && !rest && checker.isOptionalParameter(declaration)
      const parameterType = checker.getTypeOfSymbol(parameter)
      const printed = this.printHinted(
        parameterType,
        isParameter ? declaration.type : undefined,
        ctx,
        optional && !declaresUndefined(parameter),
      )
      const name =
        isParameter && !ts.isIdentifier(declaration.name)
          ? namedParameters
          : parameter.name
      return `${rest ? "..." : ""}${name}${optional ? "?" : ""}: ${printed}`
    })
    return `(${parameters.join(", ")}) => ${this.printReturnTypeWith(signature, ctx)}`
  }

  printReturnType(signature: ts.Signature, options: PrintOptions = {}): string {
    const ctx = this.createContext(options)
    return this.finish(this.printReturnTypeWith(signature, ctx), ctx, options)
  }

  private printReturnTypeWith(
    signature: ts.Signature,
    context: PrintContext,
  ): string {
    const predicate = this.checker.getTypePredicateOfSignature(signature)
    if (predicate) {
      const asserts =
        predicate.kind === ts.TypePredicateKind.AssertsIdentifier ||
        predicate.kind === ts.TypePredicateKind.AssertsThis
      const subject =
        "parameterName" in predicate && predicate.parameterName
          ? predicate.parameterName
          : "this"
      const target = predicate.type
        ? ` is ${this.printType(predicate.type, context)}`
        : ""
      return `${asserts ? "asserts " : ""}${subject}${target}`
    }
    const declaration = signature.getDeclaration() as
      | ts.SignatureDeclaration
      | undefined
    return this.printHinted(
      this.checker.getReturnTypeOfSignature(signature),
      declaration?.type,
      context,
      false,
    )
  }

  /**
   * The name of a type as shown in the docs. Namespaces stay, except for the
   * `React` and `JSX` namespaces, whose members the docs UI recognizes by their
   * bare name, such as `ReactNode`.
   */
  private displayName(symbol: ts.Symbol): string {
    return this.qualifiedName(symbol).replace(/^(React|JSX)\./, "")
  }

  qualifiedName(symbol: ts.Symbol): string {
    const parts = [symbol.name]
    let parent = (symbol as ts.Symbol & {parent?: ts.Symbol}).parent
    while (
      parent &&
      parent.flags & ts.SymbolFlags.Namespace &&
      parent.declarations?.some(ts.isModuleDeclaration) &&
      !parent.declarations.some(ts.isSourceFile)
    ) {
      if (/^["']/.test(parent.name)) {
        break
      }
      parts.unshift(parent.name)
      parent = (parent as ts.Symbol & {parent?: ts.Symbol}).parent
    }
    return parts.join(".")
  }
}

/**
 * Unions without a written order, such as `(typeof Rankings)[keyof typeof
 * Rankings]`, list number literals in creation order. Sorting them reads
 * better.
 */
function sortNumberLiterals(members: readonly ts.Type[]): readonly ts.Type[] {
  if (!members.every((member) => member.isNumberLiteral())) {
    return members
  }
  return [...members].sort((a, b) => a.value - b.value)
}

function withoutParens(node: ts.TypeNode): ts.TypeNode {
  let current = node
  while (ts.isParenthesizedTypeNode(current)) {
    current = current.type
  }
  return current
}

function declaredTypeNode(symbol: ts.Symbol): ts.TypeNode | undefined {
  const declaration = symbol.valueDeclaration
  return declaration && "type" in declaration
    ? (declaration.type as ts.TypeNode | undefined)
    : undefined
}

/**
 * Whether the member's declared type spells out `undefined`, in which case it
 * stays in the printed type.
 */
function declaresUndefined(symbol: ts.Symbol): boolean {
  const declaration = symbol.valueDeclaration
  const typeNode =
    declaration && "type" in declaration
      ? (declaration.type as ts.TypeNode | undefined)
      : undefined
  if (!typeNode) {
    return false
  }
  const mentionsUndefined = (node: ts.Node): boolean =>
    node.kind === ts.SyntaxKind.UndefinedKeyword ||
    (ts.isUnionTypeNode(node) && node.types.some(mentionsUndefined)) ||
    (ts.isParenthesizedTypeNode(node) && mentionsUndefined(node.type))
  return mentionsUndefined(typeNode)
}
