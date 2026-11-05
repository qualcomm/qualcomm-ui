// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {List, OrderedMap} from "immutable"

export type GetComponent = (name: string, flag?: boolean) => any

export type Schema = OrderedMap<string, string | Schema>

export interface QuiSwaggerContext {
  hash: string
  hideTitleSection?: boolean
}

export interface JsonSchemaProps {
  description: any
  disabled: boolean
  dispatchInitialValue?: boolean
  errors: List<any>
  fn?: any
  getComponent: GetComponent
  keyName: any
  onChange?: (value: any, item2?: any) => void
  required: boolean
  schema: any
  value: any
}
