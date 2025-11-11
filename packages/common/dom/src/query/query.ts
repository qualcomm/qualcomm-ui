// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

type Root = Document | Element | null | undefined

export function queryAll<T extends Element = HTMLElement>(
  root: Root,
  selector: string,
): T[] {
  return Array.from(root?.querySelectorAll<T>(selector) ?? [])
}

export function query<T extends Element = HTMLElement>(
  root: Root,
  selector: string,
): T | null {
  return root?.querySelector<T>(selector) ?? null
}

export type ItemToId<T> = (v: T) => string

interface Item {
  id: string
}

export function defaultItemToId<T extends Item>(v: T): string {
  return v.id
}

export function itemById<T extends Item>(
  v: T[],
  id: string,
  itemToId: ItemToId<T> = defaultItemToId,
): T | undefined {
  return v.find((item) => itemToId(item) === id)
}

export function indexOfId<T extends Item>(
  v: T[],
  id: string,
  itemToId: ItemToId<T> = defaultItemToId,
): number {
  const item = itemById(v, id, itemToId)
  return item ? v.indexOf(item) : -1
}

export function nextById<T extends Item>(v: T[], id: string, loop = true): T {
  let idx = indexOfId(v, id)
  idx = loop ? (idx + 1) % v.length : Math.min(idx + 1, v.length - 1)
  return v[idx]
}

export function prevById<T extends Item>(
  v: T[],
  id: string,
  loop = true,
): T | null {
  let idx = indexOfId(v, id)
  if (idx === -1) {
    return loop ? v[v.length - 1] : null
  }
  idx = loop ? (idx - 1 + v.length) % v.length : Math.max(0, idx - 1)
  return v[idx]
}
