// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {dummyTypePrefix} from "@qualcomm-ui/react-mdx/shiki"
import type {SerializedParameters} from "@qualcomm-ui/typedoc-common"

import {PropDescriptionFunctionArgs} from "../prop-description/index.js"

/**
 * Declarations longer than this print one type parameter per line.
 */
const maxInlineLength = 60

function printTypeParameter({
  constraint,
  defaultValue,
  name,
}: SerializedParameters): string {
  return `${name}${constraint ? ` extends ${constraint}` : ""}${defaultValue ? ` = ${defaultValue}` : ""}`
}

function printTypeParameters(
  name: string,
  typeParameters: SerializedParameters[],
): string {
  const printed = typeParameters.map(printTypeParameter)
  const inline = `${name}<${printed.join(", ")}>`
  if (inline.length <= maxInlineLength) {
    return inline
  }
  return `${name}<\n${printed.map((parameter) => `  ${parameter},`).join("\n")}\n>`
}

export interface TypeDocTypeParametersProps {
  name: string
  typeParameters: SerializedParameters[]
}

/**
 * The declaration of a generic interface, such as
 * `FacetIndexConfig<Key extends string = 'id'>`, which names the type
 * parameters that its members refer to.
 */
export function TypeDocTypeParameters({
  name,
  typeParameters,
}: TypeDocTypeParametersProps): ReactElement {
  return (
    <div className="doc-props__symbol-wrapper">
      <CodeHighlight
        code={`${dummyTypePrefix}${printTypeParameters(name, typeParameters)}`}
        disableCopy
        language="tsx"
      />
      {typeParameters.some((parameter) => parameter.summary?.length) ? (
        <PropDescriptionFunctionArgs functionArgs={typeParameters} />
      ) : null}
    </div>
  )
}
