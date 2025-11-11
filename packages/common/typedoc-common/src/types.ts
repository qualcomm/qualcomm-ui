// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export type FormattedType = string | null

export interface QuiInlineTagDisplayPart {
  docLink?: string
  kind: string
  tag?: string
  target?: string | number | ReflectionSymbolId
  text: string
  tsLinkText?: string
}

export interface ReflectionSymbolId {
  qualifiedName: string
  sourceFileName?: string
}

export interface QuiTextCommentPart {
  docLink?: string
  kind: "text"
  text: string
}

export interface QuiCodeCommentPart {
  docLink?: string
  kind: "code"
  text: string
}

export type QuiCommentDisplayPart =
  | QuiTextCommentPart
  | QuiCodeCommentPart
  | QuiInlineTagDisplayPart

export type QuiCommentTag = {
  content: QuiCommentDisplayPart[]
  name?: string
  tag: string
}

export interface QuiComment {
  blockTags?: QuiCommentTag[]
  summary: QuiCommentDisplayPart[]
}

interface SerializedTypeBase {
  deprecated?: boolean
  docLink?: string
  /**
   * For reference types, this is the full import string to be shown in the type
   * info popup.
   *
   * @example
   * ```ts
   * import type {Direction} from "@qualcomm-ui/utils/direction"
   * ```
   */
  importStatement?: string
  inheritDoc?: boolean
  /**
   * Whether the entity is tagged with @custom for special formatting.
   */
  isCustomOverride?: boolean
  name: string
  parentTypeParam?: SerializedParameters
  prettyType: FormattedType
  referencedType?: string
  required?: boolean
  resolvedType?: SerializedType
  type: FormattedType
  url?: string
}

export interface SerializedParameters {
  /**
   * Will be present if the parameter is a reference type to an `interface`.
   */
  args?: SerializedParameters[]
  baseType?: string
  defaultValue?: FormattedType
  name: string
  prettyType?: string
  /**
   * Will be provided if the parameter is a reference to a parsed type.
   */
  referenceType?: string
  required?: boolean
  summary?: QuiCommentDisplayPart[]
  type: FormattedType
}

export interface SerializedType extends SerializedTypeBase {
  baseType?: string
  deprecated?: boolean
  /**
   * If the type is a function, this will contain the resolved types of the function
   * arguments, including comments.
   */
  functionArgs?: SerializedParameters[]
  parameters?: SerializedParameters[]
  properties?: SerializedTypeBase[]
  rawType?: string
  reference?: string
  referenceLink?: string
  /**
   * For functions, this will be the return type.
   */
  returnType?: string
  typeArgs?: SerializedType[] | undefined
  url?: string
}

export interface QuiPropDeclaration {
  comment?: QuiComment
  decorators?: string[]
  defaultValue?: string
  docLink?: string
  name: string
  resolvedType: SerializedType
  sourceUrls?: string[]
  type?: string | undefined
  typeParameters?: any
}

export interface AngularInstanceProperties {
  /**
   * `@Input()` decorators or signal inputs.
   */
  input?: QuiPropDeclaration[]

  /**
   * `@Output()` decorators or signal outputs.
   */
  output?: QuiPropDeclaration[]

  /**
   * public component/directive methods with an `@public` jsdoc tag.
   */
  publicMethods?: QuiPropDeclaration[]
}

export interface QuiPropTypes
  extends Omit<QuiPropDeclaration, "resolvedType">,
    AngularInstanceProperties {
  /**
   * Props for all other cases. This may be undefined if the entity is an Angular
   * component, directive, or service.
   */
  props?: QuiPropDeclaration[]

  resolvedType?: SerializedType
}
