// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useRef} from "react"

import {PropsContextProvider} from "@qualcomm-ui/mdx-docs/typedoc"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

export interface MainContentProps extends ElementRenderProp<"article"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: ReactNode

  /**
   * @default 'main-content'
   */
  id?: string
}

export function MainContent({
  children,
  className,
  id = "main-content",
  ref: refProp,
  ...props
}: MainContentProps): ReactNode {
  const ref = useRef<HTMLElement | null>(null)

  const {mainContentElement, pageProps, setMainContentElement} =
    useMdxDocsLayoutContext()

  useSafeLayoutEffect(() => {
    if (mainContentElement !== ref.current) {
      setMainContentElement(ref.current)
    }
  }, [mainContentElement])

  const refs = useMergedRef(refProp, ref)

  return (
    <PolymorphicElement
      ref={refs}
      as="article"
      className={clsx("qui-docs__main-content", className)}
      id={id}
      {...props}
    >
      <PropsContextProvider value={pageProps}>{children}</PropsContextProvider>
    </PolymorphicElement>
  )
}
