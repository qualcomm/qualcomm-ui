// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QuiPropTypes, SerializedRef} from "@qualcomm-ui/typedoc-common"

/**
 * The keys of the types that the docs UI displays, which can name a ref.
 */
const displayedTypeKeys = new Set([
  "collapsedPrettyType",
  "collapsedType",
  "prettyType",
  "type",
])

const identifierPattern = /[A-Za-z_$][\w$]*/g

function collectIdentifiers(value: unknown, names: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectIdentifiers(item, names)
    }
    return
  }
  if (!value || typeof value !== "object") {
    return
  }
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string") {
      if (displayedTypeKeys.has(key)) {
        for (const [identifier] of child.matchAll(identifierPattern)) {
          names.add(identifier)
        }
      }
    } else {
      collectIdentifiers(child, names)
    }
  }
}

/**
 * Identifiers in the displayed types of a page, by the page's doc props. Pages
 * that did not change keep their doc props, so their identifiers are reused.
 */
const pageIdentifiers = new WeakMap<object, Set<string>>()

/**
 * The refs that the displayed types of any page name, for the site data.
 */
export function selectTypeRefs(
  pageDocProps: Record<string, Record<string, QuiPropTypes>>,
  refs: Record<string, SerializedRef>,
): Record<string, SerializedRef> {
  const selected: Record<string, SerializedRef> = {}
  for (const docProps of Object.values(pageDocProps)) {
    let identifiers = pageIdentifiers.get(docProps)
    if (!identifiers) {
      identifiers = new Set()
      collectIdentifiers(docProps, identifiers)
      pageIdentifiers.set(docProps, identifiers)
    }
    for (const identifier of identifiers) {
      const ref = refs[identifier]
      if (ref) {
        selected[identifier] = ref
      }
    }
  }
  return selected
}
