// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type ComponentPropsWithRef,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"

import {ExternalLink} from "lucide-react"

import type {PagePropType, PagePropTypes} from "@qualcomm-ui/mdx-common"
import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {Link} from "@qualcomm-ui/react/link"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {ensureArray} from "@qualcomm-ui/utils/array"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  findFirstComponentJsdoc,
  JsdocComment,
  sortAndSelectProps,
  type TypeDocAngularPropConfig,
} from "./internal"
import {TypeDocReflection} from "./reflection"
import {TypedocPropsList} from "./typedoc-props-list"
import {TypedocPropsTable} from "./typedoc-props-table"
import {usePropsContext} from "./use-props-context"
import {usePropsLayoutContext} from "./use-props-layout-context"
import {
  type ColumnNames,
  TypeDocContextProvider,
  type TypeDocContextValue,
} from "./use-typedoc-context"

export type TypeDocPropsProps = Omit<
  ComponentPropsWithRef<"div">,
  "children"
> & {
  angularConfig?: TypeDocAngularPropConfig

  /**
   * Override the changelog pathname for the `@since` tags.
   */
  changelogPathname?: string

  columnNames?: ColumnNames

  hideDefaultColumn?: boolean

  /**
   * @default true
   */
  linkifyPrimaryColumn?: boolean

  /**
   * The name of the exported interface or class. Note that this interface must be
   * JSDoc commented with the `@public` tag.
   *
   * @example 'ButtonProps'
   */
  name: string | string[]

  /**
   * Omit these properties.
   */
  omit?: string[]

  /**
   * The name of an exported interface from which to exclude overlapping
   * props.
   */
  omitFrom?: string

  /**
   * If `true`, the required indicator will not show for properties in this type.
   *
   * @default false
   */
  partial?: boolean

  /**
   * Only show these properties.
   */
  pick?: string[]

  /**
   * Filter to include or exclude props
   */
  propFilter?: (prop: PagePropType) => boolean

  /**
   * Transformer to modify the props before rendering
   */
  propTransformer?: (prop: PagePropType) => PagePropType

  /**
   * Render the corresponding component's JSDoc comment as a description above the
   * props table. Only applies for React components with a name that matches the
   * Props interface without the `Props` suffix, e.g. `Button` for `ButtonProps`
   *
   * @default true
   */
  showComponentJsdoc?: boolean

  /**
   * If `true`, required props will be sorted before optional props.
   *
   * @default true
   */
  sortRequiredPropsFirst?: boolean

  /**
   * The name of an exported interface from which to merge props.
   */
  unionWithPick?: Record<string, string[]>
}

export function TypeDocProps({
  angularConfig,
  changelogPathname,
  columnNames,
  hideDefaultColumn: hideDefaultColumnProp = false,
  linkifyPrimaryColumn = true,
  name,
  omit,
  omitFrom,
  partial,
  pick,
  propFilter,
  propTransformer,
  showComponentJsdoc = true,
  sortRequiredPropsFirst = true,
  unionWithPick,
  ...props
}: TypeDocPropsProps): ReactNode {
  const propContext = usePropsContext()
  const {propsLayout} = usePropsLayoutContext()
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true)
  }, [])

  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 950px)").matches,
  )

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 950px)")

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener("change", handler)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktop(mql.matches)

    return () => mql.removeEventListener("change", handler)
  }, [])

  const names = ensureArray(name)
  const {firstValidPropTypes, missingNames} = useMemo(() => {
    const existing: string[] = []
    const missing: string[] = []
    let firstValid: PagePropTypes | undefined

    for (const currentName of names) {
      const propTypes = propContext[currentName]
      if (propTypes) {
        existing.push(currentName)
        if (!firstValid) {
          firstValid = propTypes
        }
      } else {
        missing.push(currentName)
      }
    }

    return {
      existingNames: existing,
      firstValidPropTypes: firstValid,
      missingNames: missing,
    }
  }, [names, propContext])

  const sortedProps: PagePropType[] = useMemo(() => {
    return sortAndSelectProps({
      angularConfig,
      name,
      omit,
      omitFrom,
      pageProps: propContext,
      partial,
      pick,
      propFilter,
      propTransformer,
      sortRequiredPropsFirst,
      unionWithPick,
    })
  }, [
    angularConfig,
    name,
    omit,
    omitFrom,
    partial,
    pick,
    propContext,
    propFilter,
    propTransformer,
    sortRequiredPropsFirst,
    unionWithPick,
  ])

  const hideDefaultColumn: boolean = useMemo(
    () =>
      [
        angularConfig?.output,
        angularConfig?.publicMethods,
        hideDefaultColumnProp,
      ].some((cond) => !!cond) || sortedProps.every((p) => !p.defaultValue),
    [
      angularConfig?.output,
      angularConfig?.publicMethods,
      hideDefaultColumnProp,
      sortedProps,
    ],
  )

  const typeDocContext: TypeDocContextValue = useMemo(() => {
    return {
      columnNames: columnNames ?? {
        defaultValue: "Default",
        description: "Description",
        name: "Prop",
        type: "Type",
      },
      disableRequired: partial ?? false,
      hideDefaultColumn,
      layout: propsLayout,
      linkifyPrimaryColumn,
    }
  }, [
    columnNames,
    hideDefaultColumn,
    linkifyPrimaryColumn,
    partial,
    propsLayout,
  ])

  if (missingNames.length) {
    return (
      <InlineNotification
        description={
          <Link
            endIcon={ExternalLink}
            href="https://docs.qui.qualcomm.com/guide/typedoc#type-detection"
            rel="noreferrer"
            size="md"
            target="_blank"
          >
            Learn more
          </Link>
        }
        emphasis="danger"
        label={
          <div>
            <span>
              {missingNames.length === 1
                ? "Entity not found: "
                : "Some entities could not be found: "}
            </span>
            <code className="qui-docs-code">{missingNames.join(", ")}</code>
          </div>
        }
        orientation="vertical"
        style={{marginTop: 24}}
      />
    )
  }

  const componentJsdoc =
    showComponentJsdoc && findFirstComponentJsdoc(names, propContext)

  if (!sortedProps.length) {
    if (firstValidPropTypes?.resolvedType?.type === "signature") {
      return (
        <TypeDocContextProvider value={typeDocContext}>
          <TypeDocReflection
            comment={firstValidPropTypes.comment}
            name={firstValidPropTypes.name}
            resolvedType={firstValidPropTypes.resolvedType}
          />
        </TypeDocContextProvider>
      )
    } else if (
      firstValidPropTypes?.resolvedType?.prettyType &&
      firstValidPropTypes?.resolvedType?.type !== "any"
    ) {
      return (
        <TypeDocContextProvider value={typeDocContext}>
          <div className="doc-props__symbol-wrapper">
            <CodeHighlight
              code={firstValidPropTypes.resolvedType.prettyType}
              disableCopy
              language="tsx"
            />
          </div>
        </TypeDocContextProvider>
      )
    } else if (!componentJsdoc) {
      return null
    }
  }

  return (
    <TypeDocContextProvider value={typeDocContext}>
      <div
        {...mergeProps({className: "doc-props__root"}, props)}
        suppressHydrationWarning
      >
        <JsdocComment comment={componentJsdoc || null} />
        {propsLayout === "table" ? (
          <>
            <div className="docs-table__wrapper" suppressHydrationWarning>
              <TypedocPropsTable
                changelogPathname={changelogPathname}
                props={sortedProps}
                // always render these ids first
                suppressIds={loaded && !isDesktop}
              />
            </div>
            <div className="docs-list-wrapper">
              <TypedocPropsList
                changelogPathname={changelogPathname}
                props={sortedProps}
                suppressIds={!loaded || isDesktop}
              />
            </div>
          </>
        ) : (
          <TypedocPropsList
            changelogPathname={changelogPathname}
            props={sortedProps}
          />
        )}
      </div>
    </TypeDocContextProvider>
  )
}
