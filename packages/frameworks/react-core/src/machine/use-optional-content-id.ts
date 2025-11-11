// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactNode} from "react"

import {useControlledId} from "@qualcomm-ui/react-core/state"

/**
 * Generates an optional content identifier based on the provided content and its
 * properties.
 *
 * @param {ReactNode | boolean | undefined} content - The truthy value for which the ID is being generated. If no content is provided, an empty string is returned.
 * @param {ComponentPropsWithRef<any> | undefined} contentProps - The properties of the content, which may include an ID.
 * @return {string} The generated ID if content is provided; otherwise, returns an empty string.
 */
export function useOptionalContentId(
  content: ReactNode | boolean | undefined,
  contentProps: ComponentPropsWithRef<any> | undefined,
): string {
  const id = useControlledId(contentProps?.id)
  return content ? id : ""
}
