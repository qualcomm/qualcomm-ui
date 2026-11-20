// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  findJsonMediaType,
  getDeclaredExample,
  getMediaExample,
  type MediaType,
} from "./get-example.js"

export interface ResponseExample {
  code: string
  /**
   * `undefined` when the response has no body.
   */
  example: unknown
  mediaType?: string
}

/**
 * One example per status code. JSON bodies can be generated from their schema;
 * other media types only show the spec's own example.
 */
export function getResponseExamples(
  responses: Record<string, {content?: Record<string, MediaType>}> = {},
): ResponseExample[] {
  return Object.entries(responses).map(([code, {content = {}}]) => {
    const jsonType = findJsonMediaType(content)
    if (jsonType) {
      return {
        code,
        example: getMediaExample(content[jsonType]),
        mediaType: jsonType,
      }
    }
    const [mediaType, media] = Object.entries(content)[0] ?? []
    return {code, example: media && getDeclaredExample(media), mediaType}
  })
}
