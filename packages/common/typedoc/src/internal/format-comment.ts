// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSONOutput} from "typedoc"

import {defaultPrintWidth, prettyType} from "./type-formatter"

export function extractDefaultValueFromComment(
  comment: JSONOutput.Comment | undefined,
): JSONOutput.CommentTag | undefined {
  if (!comment) {
    return undefined
  }
  return comment.blockTags?.find((tag) => tag.tag === "@default")
}

export async function formatDefault(comment: JSONOutput.Comment | undefined) {
  const defaultValue = extractDefaultValueFromComment(comment)
  if (!defaultValue) {
    return undefined
  }
  const value = defaultValue.content[0]?.text
  return prettyType(
    value.replaceAll("```ts", "").replaceAll("`", ""),
    defaultPrintWidth,
  )
}
