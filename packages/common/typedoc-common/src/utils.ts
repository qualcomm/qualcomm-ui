// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QuiPropDeclaration} from "./types.js"

export function humanFileSize(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
  // @ts-expect-error
  return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${
    ["B", "kB", "MB", "GB", "TB"][i]
  }`
}

export function isPropRequired(prop: QuiPropDeclaration): boolean | undefined {
  return prop.resolvedType.required
}

export function sortTypeDocProps<
  T extends QuiPropDeclaration = QuiPropDeclaration,
>(props: T[], sortRequiredPropsFirst: boolean | undefined): T[] {
  return props.sort((a, b) => {
    if (sortRequiredPropsFirst) {
      if (isPropRequired(a) && !isPropRequired(b)) {
        return -1
      } else if (isPropRequired(b) && !isPropRequired(a)) {
        return 1
      }
    }
    const aName = a.name
    const bName = b.name
    return aName.localeCompare(bName)
  })
}
