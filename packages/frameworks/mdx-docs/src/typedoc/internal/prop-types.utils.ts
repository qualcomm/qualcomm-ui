// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type PageDocProps,
  type PagePropType,
  type PagePropTypes,
  type QuiComment,
  type QuiPropTypes,
  sortTypeDocProps,
} from "@qualcomm-ui/mdx-docs-common"
import {ensureArray} from "@qualcomm-ui/utils/array"

export interface TypeDocAngularPropConfig {
  /**
   * @default true
   */
  mergeInputAndOutput?: boolean
  output?: boolean
  publicMethods?: boolean
}

interface Params {
  angularConfig: TypeDocAngularPropConfig | undefined
  name: string | string[]
  omit: string[] | undefined
  omitFrom: string | undefined
  pageProps: PageDocProps
  partial: boolean | undefined
  pick: string[] | undefined
  propFilter?: (prop: PagePropType) => boolean
  /**
   * Always applied after the {@link propFilter}
   */
  propTransformer?: (prop: PagePropType) => PagePropType
  sortRequiredPropsFirst: boolean | undefined
  unionWithPick: Record<string, string[]> | undefined
}

export function sortAndSelectProps(params: Params): PagePropType[] {
  const {
    angularConfig = {},
    name,
    pageProps,
    partial,
    propFilter,
    propTransformer,
    sortRequiredPropsFirst,
    unionWithPick,
  } = params
  const {mergeInputAndOutput = true, output, publicMethods} = angularConfig
  const propTypesFromUnion = unionWithPick
    ? Object.keys(unionWithPick).reduce((acc: PagePropType[], current) => {
        const pickProps = unionWithPick[current]
        const props = sortAndSelectProps({
          angularConfig: {},
          name: current,
          omit: [],
          omitFrom: undefined,
          pageProps,
          partial,
          pick: pickProps,
          propFilter,
          sortRequiredPropsFirst,
          unionWithPick: undefined,
        })
        acc.push(...props)
        return acc
      }, [])
    : []
  if (!pageProps) {
    return []
  }
  const names = ensureArray(name)
  const propMap = new Map<string, PagePropType>()

  for (const currentName of names) {
    const propTypes: PagePropTypes | undefined = pageProps[currentName]
    if (!propTypes) {
      continue
    }
    const targetProps = output
      ? (propTypes.output ?? [])
      : publicMethods
        ? (propTypes.publicMethods ?? [])
        : (propTypes.input ?? propTypes.props ?? [])

    for (const prop of targetProps) {
      propMap.set(prop.name, prop)
    }
  }

  const allTargetProps = Array.from(propMap.values())
  const shouldSortRequiredPropsFirst = sortRequiredPropsFirst && !partial
  let sortedProps: PagePropType[] = sortTypeDocProps(
    [...filterProps(allTargetProps, params), ...propTypesFromUnion],
    shouldSortRequiredPropsFirst,
  )
  if (propFilter) {
    sortedProps = sortedProps.filter(propFilter)
  }
  if (propTransformer) {
    sortedProps = sortedProps.map(propTransformer)
  }
  if (!mergeInputAndOutput) {
    return sortedProps
  }

  const outputPropMap = new Map<string, PagePropType>()
  for (const currentName of names) {
    const propTypes: PagePropTypes | undefined = pageProps[currentName]
    if (propTypes) {
      for (const prop of propTypes.output ?? []) {
        outputPropMap.set(prop.name, prop)
      }
    }
  }

  const allOutputProps = Array.from(outputPropMap.values())
  const outputProps = sortTypeDocProps(
    filterProps(allOutputProps, params),
    shouldSortRequiredPropsFirst,
  )
  return [...sortedProps, ...outputProps]
}

export function findFirstComponentJsdoc(
  names: string[],
  propContext: Record<string, QuiPropTypes>,
): QuiComment | undefined {
  for (const name of names) {
    if (name.endsWith("Props")) {
      const componentName = name.substring(0, name.length - 5)
      const comment = propContext[componentName]?.comment
      if (comment) {
        return comment
      }
    } else {
      return propContext[name]?.comment
    }
  }
  return undefined
}

function filterProps(
  props: PagePropType[],
  params: Pick<Params, "omit" | "omitFrom" | "pageProps" | "pick">,
) {
  const {omit, omitFrom, pageProps, pick} = params
  const inheritedProps = omitFrom ? pageProps?.[omitFrom] : undefined
  let filteredProps: PagePropType[] = [...props]

  if (omit) {
    const omitSet = new Set(omit ?? [])
    if (omitSet.size) {
      filteredProps = filteredProps.filter((p) => !omitSet.has(p.name))
    }
  }
  if (pick) {
    const pickSet = new Set(pick ?? [])
    if (pickSet.size) {
      filteredProps = filteredProps.filter((p) => pickSet.has(p.name))
    }
  }
  if (inheritedProps) {
    const inherited = [
      inheritedProps.props,
      inheritedProps.input,
      inheritedProps.output,
      inheritedProps.publicMethods,
    ]
      .filter((props) => !!props)
      .flat()
    const omitSet = new Set(
      (inherited?.map((prop) => prop.name) ?? []).filter(Boolean),
    )
    if (omitSet.size) {
      filteredProps = filteredProps.filter((p) => !omitSet.has(p.name))
    }
  }
  return filteredProps
}
