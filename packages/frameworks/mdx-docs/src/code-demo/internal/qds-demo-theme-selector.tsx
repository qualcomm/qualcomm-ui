// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Select} from "@qualcomm-ui/react/select"

import {
  themeOptCollection,
  useQdsDemoTheme,
  type UseQdsDemoThemeProps,
} from "./use-qds-demo-theme"

export interface QdsDemoThemeSelectorProps extends UseQdsDemoThemeProps {}

export function QdsDemoThemeSelector({
  qdsBrand,
  setQdsBrand,
}: QdsDemoThemeSelectorProps): ReactElement {
  const {onChange, value} = useQdsDemoTheme({qdsBrand, setQdsBrand})

  return (
    <div className="qui-demo-runner__brand-selection-wrapper">
      <Select
        clearable={false}
        collection={themeOptCollection}
        label="Brand"
        onValueChange={onChange}
        placeholder="Brand"
        size="sm"
        value={[value]}
      />
    </div>
  )
}
