// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react"

import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"
import type {ColorScheme, QdsBrand} from "@qualcomm-ui/react/qds-theme"

import {QdsDemoThemeSelector} from "./internal"
import {QdsReactDemo, type QdsReactDemoProps} from "./qds-react-demo"

export interface QdsDemoRunnerProps
  extends ComponentPropsWithRef<"div">,
    Pick<QdsReactDemoProps, "name" | "updating" | "onDemoRendered"> {
  className?: string

  colorScheme?: ColorScheme

  /**
   * The default source code index to render.
   */
  defaultSourceIndex?: number

  /**
   * Demo getter function provided by the vite plugin.
   */
  demo: ReactDemoWithScope | null

  /**
   * Disable snippet comment functionality like `// preview`
   */
  disableSnippets?: boolean

  /**
   * Whether the source code is viewable. If false, the source code and filename
   * tabs will not render.
   */
  expandable?: boolean

  /**
   * Whether the source code is initially expanded.
   */
  expanded?: boolean

  hideBrandSwitcher?: boolean

  /**
   * Lines to highlight.
   */
  highlight?: number[]

  qdsBrand: QdsBrand

  setQdsBrand: (brand: QdsBrand) => void

  /**
   * Optional top element to insert above the component demo.
   */
  topBar?: ReactElement

  /**
   * Props applied to the element that wraps the component demo.
   */
  wrapperProps?: HTMLAttributes<HTMLDivElement>
}

export function QdsDemoRunner({
  hideBrandSwitcher,
  qdsBrand = "qualcomm",
  setQdsBrand,
  ...props
}: QdsDemoRunnerProps): ReactNode {
  return (
    <QdsReactDemo qdsBrand={qdsBrand} {...props}>
      {hideBrandSwitcher ? null : (
        <QdsDemoThemeSelector qdsBrand={qdsBrand} setQdsBrand={setQdsBrand} />
      )}
    </QdsReactDemo>
  )
}
