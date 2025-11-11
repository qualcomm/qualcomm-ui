// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type JSONOutput, ReflectionKind} from "typedoc"

import type {
  AngularInstanceProperties,
  QuiComment,
  QuiPropDeclaration,
  QuiPropTypes,
  SerializedType,
} from "@qualcomm-ui/typedoc-common"

import {isInputSignal, isModelSignal, isOutputSignal} from "../guards"
import type {BuildOptions, ImportResolverFn} from "../types"

import {formatDefault} from "./format-comment"
import {TypeSerializer} from "./type-serializer"
import type {KnownInterfaces, QuiDeclarationReflection} from "./types"

export interface PropBuilderParams
  extends Pick<BuildOptions, "referenceLinks"> {
  importResolver?: ImportResolverFn
  knownInterfaces?: KnownInterfaces
  printWidth?: number
  symbolMap?: Record<number, JSONOutput.ReflectionSymbolId>
}

export class TypeDocPropBuilder {
  private serializer: TypeSerializer

  constructor(params: PropBuilderParams) {
    this.serializer = new TypeSerializer(params)
  }

  private removeUnusedFields(prop: QuiDeclarationReflection) {
    const {
      children: _children,
      extendedTypes: _extendedTypes,
      flags: _flags,
      getSignature: _getSignature,
      groups: _groups,
      id: _id,
      implementationOf: _implementationOf,
      implementedBy: _implementedBy,
      implementedTypes: _implementedTypes,
      inheritedFrom: _inheritedFrom,
      kind: _kind,
      packageVersion: _packageVersion,
      setSignature: _setSignature,
      signatures: _signatures,
      sources: _sources,
      typeParameters: _typeParameters,
      variant: _variant,
      ...rest
    } = prop
    return rest
  }

  private async buildProp(
    propsInterface: QuiDeclarationReflection,
    prop: QuiDeclarationReflection,
  ) {
    switch (prop.type?.type) {
      case "reference":
        return this.serializer.resolveReferenceType(
          prop as QuiDeclarationReflection & {
            type: JSONOutput.ReferenceType
          },
          propsInterface,
        )
      case "reflection":
        prop.comment = this.serializer.resolveReflectionComment(
          prop as QuiDeclarationReflection & {
            type: JSONOutput.ReflectionType
          },
        )
        return this.serializer.serializeTypes(prop, propsInterface)

      case undefined:
        let typeRef
        /**
         * If setSignature is present and parameter is a reference type, we
         * extract its docLink.
         *
         * @example
         * ```
         * // pull out the docLink from the AxisLabelOptions interface.
         * @Input() set xAxisLabelOptions(value: AxisLabelOptions) {...}
         * ```
         */
        if (
          prop.setSignature &&
          (typeRef = prop.setSignature.parameters?.[0].type)?.type ===
            "reference"
        ) {
          const resolvedType = await this.serializer.serializeTypes(
            prop,
            propsInterface,
          )
          resolvedType.docLink =
            this.serializer.knownInterfaces[typeRef.name]?.resolvedType?.docLink
          resolvedType.reference = typeRef.name
          return resolvedType
        } else if (prop.kind === ReflectionKind.Function) {
          prop.comment = this.serializer.resolveReflectionComment(
            prop as QuiDeclarationReflection & {
              type: JSONOutput.ReflectionType
            },
          )
          return this.serializer.serializeTypes(prop, propsInterface)
        } else {
          return this.serializer.serializeTypes(prop, propsInterface)
        }
      default:
        return this.serializer.serializeTypes(prop, propsInterface)
    }
  }

  private buildProps(
    propsInterface: QuiDeclarationReflection,
  ): Promise<QuiPropDeclaration[]> {
    // exported objects, like QTimelineClasses, do not have children.
    // their "props" are located in type.declaration.children.
    if (
      propsInterface.type?.type === "reflection" &&
      !propsInterface.children
    ) {
      return this.buildProps({
        ...propsInterface,
        children: propsInterface.type.declaration.children ?? [],
      })
    }

    return Promise.all(
      (propsInterface.children ?? []).map(
        async (prop): Promise<QuiPropDeclaration> => {
          const resolvedType = await this.buildProp(propsInterface, prop)

          const {
            comment: _comment,
            getSignature,
            setSignature,
            type,
            ...rest
          } = prop

          let comment = _comment
          if (!comment && prop.kind === ReflectionKind.Method) {
            comment = prop.signatures?.[0]?.comment
          }

          if (prop.name === "add") {
            console.debug(prop)
          }

          return {
            ...this.removeUnusedFields(rest),
            comment: this.serializer.transformComment(
              comment || getSignature?.comment || setSignature?.comment,
            ),
            defaultValue: await formatDefault(comment),
            resolvedType,
            type: type?.type,
          }
        },
      ),
    )
  }

  async build(propsInterface: QuiDeclarationReflection): Promise<QuiPropTypes> {
    const {type, ...rest} = propsInterface

    const props: QuiPropDeclaration[] | undefined = rest?.children?.length
      ? await this.buildProps(propsInterface)
      : undefined

    const isAngularEntity = propsInterface.decorators?.some((decorator) =>
      decorator.match(/@(Component)|(Directive)|(Service)\(\)/),
    )

    // service detection
    if (props && isAngularEntity) {
      const properties = props.reduce(
        (
          acc: AngularInstanceProperties,
          {
            decorators = [],
            // TODO: make final type without the omitted properties.
            resolvedType: {
              parameters: _parameters,
              properties: _properties,
              ...resolvedType
            },
            typeParameters: _typeParameters,
            ...current
          },
        ) => {
          const result = {...current, resolvedType}
          if (decorators.some((dec: string) => dec.startsWith("@Output"))) {
            acc?.output?.push?.(result)
          } else if (
            decorators.some((dec: string) => dec.startsWith("@Input"))
          ) {
            acc?.input?.push?.(result)
          } else if (
            isInputSignal(resolvedType.type) ||
            isModelSignal(resolvedType.type)
          ) {
            acc?.input?.push?.(result)
          } else if (isOutputSignal(resolvedType.type)) {
            acc?.output?.push?.(result)
          } else if (result.resolvedType.type === "signature") {
            acc?.publicMethods?.push?.(result)
          }
          return acc
        },
        {input: [], output: [], publicMethods: []},
      )

      return {
        ...this.removeUnusedFields(rest),
        ...this.removeUnusedProperties(properties),
        type: type?.type,
      }
    }

    let resolvedType: SerializedType | undefined = undefined
    if (!props) {
      // this is a top-level export, like a function or literal.
      resolvedType = await this.buildProp(propsInterface, propsInterface)
    }

    const comment: QuiComment | undefined = this.serializer.transformComment(
      propsInterface.comment,
    )

    return {
      ...this.removeUnusedFields(rest),
      comment,
      props,
      resolvedType,
      type: type?.type,
    }
  }

  /**
   * Omits unused Angular properties from the generated type documentation.
   */
  private removeUnusedProperties(
    properties: AngularInstanceProperties,
  ): AngularInstanceProperties {
    return {
      input: properties.input?.length ? properties.input : undefined,
      output: properties.output?.length ? properties.output : undefined,
      publicMethods: properties.publicMethods?.length
        ? properties.publicMethods
        : undefined,
    }
  }
}
