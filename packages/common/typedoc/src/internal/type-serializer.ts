// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {cloneDeep} from "lodash-es"
import {type JSONOutput, ReflectionKind} from "typedoc"

import type {
  QuiComment,
  QuiCommentDisplayPart,
  QuiCommentTag,
  SerializedParameters,
  SerializedType,
} from "@qualcomm-ui/typedoc-common"

import {
  getTypeFromProperties,
  isArrayType,
  isInputSignal,
  isModelSignal,
  isOutputSignal,
  isReferenceType,
  isReflectionType,
  isTypeOverride,
  isUndefinedType,
  isUnionType,
} from "../guards"

import {customTypes, ignoredTypes} from "./custom-types"
import {ImportBuilder} from "./import-builder"
import type {PropBuilderParams} from "./prop-builder"
import {
  defaultPrintWidth,
  extractDocLink,
  getFileGitUrl,
  getInheritDoc,
  getName,
  prettyType,
  TypeFormatter,
} from "./type-formatter"
import type {KnownInterfaces, QuiDeclarationReflection} from "./types"

function isDeprecated(comment?: JSONOutput.Comment) {
  return comment?.blockTags?.some?.((r) => r.tag === "@deprecated") || undefined
}

/**
 * Omits undefined or false values from an object.
 */
function omitUnusedProperties<T extends Record<string, any>>(obj: T): T {
  return Object.keys(obj).reduce((acc: T, current) => {
    if (obj[current] !== undefined && obj[current] !== false) {
      acc[current as keyof T] = obj[current]
    }
    return acc
  }, {} as T)
}

function getFlags(m: QuiDeclarationReflection) {
  const flags = m.flags ?? {}
  const inputDecorator = (m.decorators ?? []).find((dec) =>
    dec.startsWith("@Input"),
  )
  const outputDecorator = (m.decorators ?? []).find((dec) =>
    dec.startsWith("@Output"),
  )
  return omitUnusedProperties({
    abstract: flags.isAbstract,
    deprecated: isDeprecated(m.comment),
    private: flags.isPrivate,
    readonly: flags.isReadonly,
    required:
      (outputDecorator
        ? false
        : inputDecorator
          ? inputDecorator.includes("required: true")
          : !flags?.isOptional) || undefined,
    static: flags.isStatic,
  })
}

function getSignatureFlags(m: JSONOutput.SignatureReflection) {
  const flags = m.flags ?? {}

  return omitUnusedProperties({
    abstract: flags.isAbstract,
    deprecated: isDeprecated(m.comment),
    private: flags.isPrivate,
    readonly: flags.isReadonly,
    static: flags.isStatic,
  })
}

interface TypeSerializerParams extends PropBuilderParams {}

/**
 * TODO: refactor this completely
 * Use scalable patterns for organizing functionality into modules
 */
export class TypeSerializer {
  readonly importBuilder: ImportBuilder
  readonly knownInterfaces: KnownInterfaces
  readonly printWidth: number
  readonly symbolMap: Record<number, JSONOutput.ReflectionSymbolId>
  readonly typeFormatter: TypeFormatter
  readonly referenceLinks: Record<string, string>

  constructor(params: TypeSerializerParams) {
    this.referenceLinks = params.referenceLinks ?? {}
    this.knownInterfaces = params.knownInterfaces ?? {}
    this.symbolMap = params.symbolMap ?? {}
    this.importBuilder = new ImportBuilder(
      this.symbolMap,
      params.importResolver,
    )
    this.printWidth = params.printWidth ?? defaultPrintWidth
    this.typeFormatter = new TypeFormatter(this.knownInterfaces)
  }

  resolveReflectionComment(
    prop: QuiDeclarationReflection & {type: JSONOutput.ReflectionType},
  ) {
    const comment: JSONOutput.Comment = cloneDeep(prop.comment) ?? {
      blockTags: [],
      summary: [],
    }
    if (prop.signatures?.length) {
      if (!comment.summary?.length) {
        comment.summary = prop.signatures[0].comment?.summary ?? []
      }
      if (!comment.blockTags?.length) {
        comment.blockTags = prop.signatures[0].comment?.blockTags ?? []
      }
    } else if ((prop.type.declaration as any)?.signatures?.length) {
      const signatures = (prop.type.declaration as any).signatures
      if (!comment.summary?.length) {
        comment.summary = signatures[0].comment?.summary ?? []
      }
      if (!comment.blockTags?.length) {
        comment.blockTags = signatures[0].comment?.blockTags ?? []
      }
    }
    return comment
  }

  async resolveReferenceType(
    prop: QuiDeclarationReflection & {type: JSONOutput.ReferenceType},
    propParent: QuiDeclarationReflection,
  ): Promise<SerializedType> {
    const typeName = prop.type?.qualifiedName ?? prop.type?.name

    const serialized = await this.serializeTypes(prop, propParent)

    if (serialized.isCustomOverride || serialized.inheritDoc) {
      return serialized
    }

    /**
     * With respect to references, we expand the possible types.
     * Consider the QIconButtonShape property:
     *
     * @example
     * type QIconButtonShape = 'square' | 'round'
     *
     * If we didn't selectively expand reference types, it would emit as
     * `QIconButtonShape`. This is a limitation of typedoc whereby reference types
     * of unions aren't properly expanded. We overcome this by collecting all
     * the named types ahead into a map. Then we resolve those types as we build the
     * type definition. In the case of `QIconButtonShape`, this results in a prop
     * with the resolved type of
     * `'square' | 'round'`.
     */
    const knownType = this.knownInterfaces[typeName]
      ? cloneDeep(this.knownInterfaces[typeName])
      : undefined

    if (
      !knownType &&
      !ignoredTypes.test(typeName) &&
      !prop.type.refersToTypeParameter
    ) {
      return serialized
    }

    if (prop.name === "as" && prop.type.refersToTypeParameter) {
      return this.serializeTypes({...prop, type: customTypes.as}, propParent)
    }

    const serializedType = knownType?.resolvedType ?? serialized

    // we resolve flags here
    serializedType.required = serialized.required
    serializedType.deprecated = serialized.deprecated
    serializedType.url =
      serialized.url ?? knownType?.resolvedType?.url ?? getFileGitUrl(prop)

    serializedType.importStatement = await this.importBuilder.resolveImport(
      prop.type,
    )

    // the knownType may have Type Parameters that we need to account for. This
    // is always the case when dealing with generics.
    if (
      knownType?.resolvedType &&
      prop.type.typeArguments &&
      knownType.resolvedType.parameters &&
      knownType.details.type
    ) {
      // map through the type arguments and collect the values.
      const typeArgs = prop.type.typeArguments.map((type) =>
        this.typeFormatter.formatType(type),
      )

      // marshal the values into a record.
      // Key = Target parameter name to replace
      // Value = Replacement value
      const replacer: Record<string, string> =
        knownType.resolvedType.parameters.reduce(
          (acc: Record<string, string>, param, index) => {
            acc[param.name] = typeArgs[index] ?? param.name
            return acc
          },
          {},
        )

      // reconstruct the type with the updated parameters.
      const parsedType = this.typeFormatter.formatType(knownType.details.type, {
        paramsReplacer: replacer,
      })

      if (parsedType !== serializedType.type) {
        serializedType.type = parsedType
        serializedType.prettyType = await prettyType(
          parsedType,
          this.printWidth,
        )
      }
    } else if (prop.type.refersToTypeParameter && propParent.typeParameters) {
      /**
       * This block catches properties with a type parameter from the parent
       * type.
       *
       * @example
       * ```typescript
       * type Props<C extends boolean> = {
       *   clearable?: C
       * }
       * ```
       */
      const name = prop.type.name
      const parentTypeParam = propParent.typeParameters.find(
        (param) => param.name === name,
      )
      if (parentTypeParam) {
        if (parentTypeParam.type?.type === "reference") {
          serializedType.resolvedType =
            this.knownInterfaces[parentTypeParam.type.name]?.resolvedType
        } else {
          serializedType.parentTypeParam =
            this.serializeTypeParameter(parentTypeParam)
        }
      }
    }

    // the resolved type may be from a reference type, so we need to process the
    // decorator to determine if it's required.
    const inputDecorator = (prop.decorators ?? []).find((dec) =>
      dec.startsWith("@Input"),
    )
    serializedType.required = inputDecorator
      ? inputDecorator.includes("required: true")
      : serializedType.required

    return serializedType
  }

  async serializeSignatureParameter(
    parameter: JSONOutput.ParameterReflection,
  ): Promise<SerializedParameters> {
    const parsedType = parameter.type
      ? this.typeFormatter.formatType(parameter.type)
      : "any"

    const referenceType =
      parameter.type?.type === "reference" ? parameter.type.name : undefined

    const knownType = referenceType
      ? this.knownInterfaces[referenceType]
      : undefined

    const parameters: SerializedParameters[] | undefined =
      knownType?.details?.children?.map((item) => ({
        name: item.name,
        summary: item.comment?.summary,
        type: item.type?.type || null,
      }))

    const pretty: string = await prettyType(parsedType, this.printWidth)

    return omitUnusedProperties<SerializedParameters>({
      args: parameters,
      baseType: parameter.type?.type,
      name: parameter.name,
      prettyType: pretty,
      referenceType,
      required: !parameter?.flags?.isOptional,
      summary: parameter.comment?.summary,
      type: parsedType,
    })
  }

  serializeTypeParameter(
    typeParameter: JSONOutput.TypeParameterReflection,
  ): SerializedParameters {
    const type = typeParameter.type
    const defaultValue = typeParameter.default
      ? this.typeFormatter.formatType(typeParameter.default)
      : undefined

    const parsedType = type
      ? this.typeFormatter.formatType(typeParameter.type)
      : (defaultValue ?? "any")

    return omitUnusedProperties({
      defaultValue,
      name: typeParameter.name,
      required:
        (!typeParameter?.flags?.isOptional && !typeParameter?.default) ||
        undefined,
      summary: typeParameter.comment?.summary,
      type: parsedType,
    })
  }
  /**
   * Adds properties to the comment blockTags, like doc links for @see tags.
   */
  private transformCommentBlockTags(
    blockTags: JSONOutput.CommentTag[] | undefined,
  ): QuiCommentTag[] | undefined {
    if (!blockTags) {
      return undefined
    }
    return blockTags.map((tag) => {
      if (tag.tag === "@see") {
        return {
          ...tag,
          content: tag.content.map((content) => {
            const knownType = this.knownInterfaces[content.text]
            if (knownType) {
              return {
                ...content,
                docLink: knownType?.resolvedType?.docLink,
              } as QuiCommentDisplayPart
            }
            return content as QuiCommentDisplayPart
          }),
        }
      }
      // the additional properties in QuiCommentTag and its derivative types are all
      // optional, so this cast is fine.
      return tag as QuiCommentTag
    })
  }

  transformComment(
    comment: JSONOutput.Comment | undefined,
  ): QuiComment | undefined {
    if (!comment) {
      return undefined
    }
    const blockTags = this.transformCommentBlockTags(comment.blockTags)
    // the additional properties in QuiCommentDisplayPart and its derivative types
    // are all optional, so this cast is fine.
    const summary = comment.summary as QuiCommentDisplayPart[]
    return blockTags?.length || summary?.length
      ? {
          blockTags,
          summary,
        }
      : undefined
  }

  private parseType(
    prop: QuiDeclarationReflection | JSONOutput.SignatureReflection,
    paramsReplacer?: Record<string, string>,
  ): {
    baseType?: string
    inheritDoc?: boolean
    inheritedDocLink?: string
    isCustomOverride?: boolean
    isKnownType?: boolean
    referenceLink?: string
    type: string
    typeAlias?: string
    typeArgs?: JSONOutput.SomeType[]
  } {
    /**
     * We tag specific properties with @custom to override the resolved type
     * with a single string. This is typically done for input properties with an
     * interface that is already documented. See the
     * {@link https://qui.aws.qualcomm.com/components/breadcrumbs#input breadcrumbs}
     * for an example of this.
     */
    const customTypeOverride = isTypeOverride(prop.comment)
    if (customTypeOverride) {
      return {isCustomOverride: true, type: customTypeOverride}
    }

    /**
     * We tag specific properties with the TSDoc @inheritDoc tag to override the
     * resolved type with the named reference. This is done to prevent specific
     * named references from expanding into massive types that crowd the table.
     *
     * TODO: clean up, this is messy
     */
    const inheritDoc = !!getInheritDoc(prop.comment)
    if (isReferenceType(prop.type)) {
      const typeArguments = prop.type?.typeArguments
      if (prop.type.name && inheritDoc) {
        if (prop.type.name === "Omit" && typeArguments) {
          const firstParamType = typeArguments[0] as JSONOutput.ReferenceType
          return {
            inheritDoc: Boolean(inheritDoc),
            inheritedDocLink:
              this.knownInterfaces[firstParamType.name]?.resolvedType?.docLink,
            referenceLink: this.referenceLinks[firstParamType.name],
            type: `Omit<${firstParamType.name}, ${this.typeFormatter.formatType(
              typeArguments[1],
            )}>`,
          }
          // handle generics with only a single type argument
        } else if (typeArguments?.length && isReferenceType(typeArguments[0])) {
          const referenceArg: JSONOutput.ReferenceType = typeArguments[0]
          const remainingTypeArguments = typeArguments
            .slice(1)
            .map((arg) => this.typeFormatter.formatType(arg))
          return {
            inheritDoc,
            inheritedDocLink:
              this.knownInterfaces[referenceArg.name]?.resolvedType?.docLink,
            referenceLink: this.referenceLinks[prop.type.name],
            type: `${prop.type.name}<${referenceArg.name}${remainingTypeArguments.length ? `, ${remainingTypeArguments.join(", ")}` : ""}>`,
            typeArgs: typeArguments,
          }
        } else if (
          prop.type.name === "InputSignal" &&
          isArrayType(typeArguments?.[0]) &&
          isReferenceType(typeArguments[0].elementType)
        ) {
          return {
            inheritDoc,
            inheritedDocLink:
              this.knownInterfaces[typeArguments[0].elementType.name]
                ?.resolvedType?.docLink,
            referenceLink:
              this.referenceLinks[typeArguments[0].elementType.name],
            type: `InputSignal<${typeArguments[0].elementType.name}[]>`,
            typeArgs: typeArguments,
          }
        }
        return {
          inheritDoc,
          inheritedDocLink:
            this.knownInterfaces[prop.type.name]?.resolvedType?.docLink,
          referenceLink: this.referenceLinks[prop.type.name],
          type: prop.type.name,
        }
      } else if (prop.type.name === "Omit" && typeArguments) {
        const firstParamType = typeArguments[0] as JSONOutput.ReferenceType
        return {
          inheritDoc: Boolean(inheritDoc),
          inheritedDocLink:
            this.knownInterfaces[firstParamType.name]?.resolvedType?.docLink,
          type: `Omit<${firstParamType.name}, ${this.typeFormatter.formatType(
            typeArguments[1],
          )}>`,
        }
      }
      if (customTypes[prop.type.name]) {
        return {
          isKnownType: true,
          type: this.typeFormatter.formatType(customTypes[prop.type.name]),
        }
      }
      if (
        typeArguments?.length === 1 &&
        typeArguments[0]?.type === "reference"
      ) {
        const typeArg = typeArguments[0]
        return {
          referenceLink: this.referenceLinks[prop.type.name],
          type: this.typeFormatter.formatType(prop.type, {paramsReplacer}),
          typeAlias: this.knownInterfaces[typeArg.name]
            ? typeArg.name
            : undefined,
          typeArgs: typeArguments,
        }
      }
      // special case for handling input signals, which are technically a union type
      // of undefined and the supplied type def.
      if (typeArguments?.length === 1 && prop.type.name === "InputSignal") {
        const typeArg = typeArguments[0]

        if (
          isUnionType(typeArg) &&
          typeArg.types.length === 2 &&
          isUndefinedType(typeArg.types[0])
        ) {
          // re-parse without the silly union.
          return this.parseType(
            {
              ...prop,
              type: {...prop.type, typeArguments: [typeArg.types[1]]},
            },
            paramsReplacer,
          )
        }
      } else if (
        typeArguments?.length === 2 &&
        prop.type.name === "InputSignalWithTransform"
      ) {
        // re-parse without the coerced type union.
        return this.parseType(
          {
            ...prop,
            type: {
              ...prop.type,
              name: "InputSignal",
              typeArguments: [typeArguments[0]],
            },
          },
          paramsReplacer,
        )
      }
    }

    // TODO: arrays of arrays?
    if (isArrayType(prop.type) && isReferenceType(prop.type.elementType)) {
      if (prop.type.elementType.name && inheritDoc) {
        return {
          inheritDoc: Boolean(inheritDoc),
          inheritedDocLink:
            this.knownInterfaces[prop.type.elementType.name]?.resolvedType
              ?.docLink,
          referenceLink: this.referenceLinks[prop.type.elementType.name],
          type: `${prop.type.elementType.name}[]`,
        }
      }
      if (customTypes[prop.type.elementType.name]) {
        return {
          isKnownType: true,
          type: this.typeFormatter.formatType(
            customTypes[prop.type.elementType.name],
          ),
        }
      }
    }

    if (isReflectionType(prop.type) && inheritDoc) {
      // TODO: take this approach for every type when isInheritDoc is true.
      return {
        type: this.typeFormatter.formatType(prop.type, {
          isInheritDoc: true,
          paramsReplacer,
        }),
      }
    }

    if (isUnionType(prop.type)) {
      return {
        type: this.typeFormatter.formatType(prop.type, {paramsReplacer}),
      }
    }

    if ("setSignature" in prop && prop.setSignature) {
      return {
        type: this.typeFormatter.formatType(
          prop.setSignature.parameters?.[0]?.type,
        ),
      }
    }

    if ("getSignature" in prop && prop.getSignature) {
      return {
        type: this.typeFormatter.formatType(prop.getSignature.type),
      }
    }

    const formattedType = prop.type
      ? this.typeFormatter.formatType(prop.type, {paramsReplacer})
      : "any"

    const typeArgs = isReferenceType(prop.type)
      ? prop.type.typeArguments
      : undefined

    if (formattedType === "any" && isReferenceType(prop.type)) {
      return {
        type: prop.type.name,
        typeArgs,
      }
    }

    return {
      type: formattedType,
      typeArgs,
    }
  }

  /**
   * Instance methods require special handling to resolve parameters.
   */
  async serializeSignature(
    signature: JSONOutput.SignatureReflection,
    printWidth = defaultPrintWidth,
  ): Promise<SerializedType> {
    // the return type of the signature.
    const {inheritDoc, isCustomOverride, type} = this.parseType(signature)

    const name = getName(signature)

    const returnType = type

    const parameters = await Promise.all(
      signature.parameters?.map?.((param) =>
        this.serializeSignatureParameter(param),
      ) ?? [],
    )

    const parameterTypes = parameters.reduce((acc, current) => {
      /**
       * destructured or reference properties will have an extra name that we don't
       * need, i.e.
       * `getFileOptions: GetFileOptions`
       */
      const name = current.referenceType
        ? "__temp: "
        : `${current.name}${current.required ? ": " : " "}`
      return `${acc}${name}${current.type},`
    }, "")

    const signatureType = `(${parameterTypes}) => ${returnType}`

    const pretty: string = await prettyType(signatureType, printWidth)

    return {
      ...getSignatureFlags(signature),
      baseType: "reflection",
      docLink: extractDocLink(signature.comment),
      inheritDoc,
      isCustomOverride,
      name,
      parameters,
      prettyType: pretty.replaceAll("__temp: ", ""),
      returnType: type,
      type: "signature",
      url: getFileGitUrl(signature),
    }
  }

  private formatType(value: string, baseType: string | undefined): string {
    if (
      baseType === "reference" &&
      (isInputSignal(value) || isModelSignal(value) || isOutputSignal(value))
    ) {
      return value
        .substring(0, value.length - 1)
        .replace("InputSignal<", "")
        .replace("ModelSignal<", "")
        .replace("OutputEmitterRef<", "")
    }

    return value
  }

  async serializeTypes(
    prop: QuiDeclarationReflection & {decorators?: string[]},
    propParent?: QuiDeclarationReflection,
  ): Promise<SerializedType> {
    /**
     * signatures have special deserialization logic, because parameters.
     */
    if (prop?.signatures?.[0]) {
      return this.serializeSignature(prop.signatures[0])
    }

    const name = getName(prop)

    const parameters = [
      ...(propParent?.typeParameters ?? []),
      ...(prop.typeParameters ?? []),
    ].map((param) => this.serializeTypeParameter(param))

    const paramsReplacer: Record<string, string> = (parameters ?? []).reduce(
      (acc: Record<string, string>, param) => {
        let value: string
        if (param.type === "reference" && this.knownInterfaces[param.name]) {
          value =
            this.knownInterfaces[param.name].resolvedType.prettyType ??
            param.name
        } else {
          value = param.name
        }
        acc[param.name] =
          this.knownInterfaces[value]?.resolvedType?.prettyType ?? value
        return acc
      },
      {},
    )

    const {
      inheritDoc,
      inheritedDocLink,
      isCustomOverride,
      referenceLink,
      type,
      typeAlias,
      typeArgs,
    } = this.parseType(prop, paramsReplacer)

    // TODO: check other generics
    const baseType = prop.type?.type

    const adjustedType = type === "Partial" && name ? `Partial<${name}>` : type

    const serializedTypeArgs = typeArgs?.length
      ? await Promise.all(
          typeArgs.map((arg) => this.serializeTypes({...prop, type: arg})),
        )
      : undefined

    const base: SerializedType = {
      ...getFlags(prop),
      baseType,
      docLink: extractDocLink(prop.comment) || inheritedDocLink,
      functionArgs:
        isReflectionType(prop.type) && prop.type.declaration.signatures
          ? await Promise.all(
              prop.type.declaration.signatures[0].parameters?.map?.((param) =>
                this.serializeSignatureParameter(param),
              ) ?? [],
            )
          : undefined,
      inheritDoc,
      isCustomOverride,
      name,
      // omit parameters for simple types – they are not needed.
      parameters:
        baseType === "intrinsic" || baseType === "literal" || !parameters.length
          ? undefined
          : parameters,
      prettyType: await prettyType(
        this.formatType(adjustedType, baseType),
        this.printWidth,
      ),
      // adds a reference type for the type overlay popup.
      reference: typeAlias,
      referenceLink,
      type: adjustedType,
      typeArgs: serializedTypeArgs,
      url: getFileGitUrl(prop),
    }

    if (isReferenceType(prop.type)) {
      base.importStatement = await this.importBuilder.resolveImport(prop.type)
    }

    if (prop.children) {
      base.properties = await Promise.all(
        prop.children.map(async (m) => this.serializeTypes(m, prop)),
      )
    }

    /**
     * Catch exported top-level interfaces.
     */
    if (
      (base.type === "any" || !base.type || base.baseType === "intersection") &&
      base.properties &&
      prop.kind !== ReflectionKind.Class
    ) {
      const resolvedTypeFromProperties = getTypeFromProperties(base.properties)

      if (resolvedTypeFromProperties.trim().length) {
        base.baseType = "intersection"
        base.type = `{${resolvedTypeFromProperties}}`
        base.prettyType = await prettyType(
          `{${resolvedTypeFromProperties}}`,
          this.printWidth,
        )
      }
    }

    return base
  }
}
