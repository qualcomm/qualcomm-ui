// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactNode} from "react"

import type {QdsBrand} from "@qualcomm-ui/react/qds-theme"

import {QdsDemoThemeSelector} from "./internal/index.js"
import {ReactDemo, type ReactDemoProps} from "./react-demo.js"

export interface ReactDemoRunnerProps extends ReactDemoProps {
  hideBrandSwitcher?: boolean

  qdsBrand: QdsBrand

  setQdsBrand: (brand: QdsBrand) => void
}

export function ReactDemoRunner({
  hideBrandSwitcher,
  qdsBrand = "qualcomm",
  setQdsBrand,
  ...props
}: ReactDemoRunnerProps): ReactNode {
  return (
    <ReactDemo
      {...props}
      actions={
        hideBrandSwitcher ? null : (
          <QdsDemoThemeSelector qdsBrand={qdsBrand} setQdsBrand={setQdsBrand} />
        )
      }
      wrapperProps={{"data-brand": qdsBrand} as ComponentPropsWithRef<"div">}
    />
  )
}
