// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {PagePropType} from "@qualcomm-ui/mdx-common"

import {
  TypeDocAttributes,
  type TypeDocAttributesProps,
} from "./type-doc-attributes"

export interface TypeDocAngularAttributesProps
  extends Omit<TypeDocAttributesProps, "propTransformer"> {}

function propTransformer(prop: PagePropType) {
  return {...prop, name: prop.name === "className" ? "class" : prop.name}
}

export function TypeDocAngularAttributes(
  props: TypeDocAngularAttributesProps,
): ReactElement {
  return <TypeDocAttributes propTransformer={propTransformer} {...props} />
}
