// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {kebabCase} from "@qualcomm-ui/utils/change-case"

export interface AnatomyPart {
  attrs: Record<"data-scope" | "data-part", string>
  selector: string
}

export type AnatomyInstance<T extends string> = Omit<Anatomy<T>, "parts">

export type AnatomyPartName<T> = T extends AnatomyInstance<infer U> ? U : never

export interface Anatomy<T extends string> {
  build: () => Record<T, AnatomyPart>
  extendWith: <V extends string>(...parts: V[]) => AnatomyInstance<T | V>
  keys: () => T[]
  parts: <U extends string>(...parts: U[]) => AnatomyInstance<U>
  rename: (newName: string) => Anatomy<T>
}

export const createAnatomy = <T extends string>(
  name: string,
  parts = [] as T[],
): Anatomy<T> => ({
  build: () =>
    [...new Set(parts)].reduce<Record<string, AnatomyPart>>(
      (prev, part) =>
        Object.assign(prev, {
          [part]: {
            attrs: {
              "data-part": kebabCase(part),
              "data-scope": kebabCase(name),
            },
            selector: [
              `&[data-scope="${kebabCase(name)}"][data-part="${kebabCase(part)}"]`,
              `& [data-scope="${kebabCase(name)}"][data-part="${kebabCase(part)}"]`,
            ].join(", "),
          },
        }),
      {},
    ),
  extendWith: (...values) => createAnatomy(name, [...parts, ...values]),
  keys: () => parts,
  parts: (...values) => {
    if (isEmpty(parts)) {
      return createAnatomy(name, values)
    }
    throw new Error(
      "createAnatomy().parts(...) should only be called once. Did you mean to use .extendWith(...) ?",
    )
  },
  rename: (newName) => createAnatomy(newName, parts),
})

const isEmpty = <T>(v: T[]): boolean => v.length === 0
