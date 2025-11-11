// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export function getValidChildren(children: ReactNode) {
  return Children.toArray(children).filter((child) =>
    isValidElement(child),
  ) as ReactElement[]
}
