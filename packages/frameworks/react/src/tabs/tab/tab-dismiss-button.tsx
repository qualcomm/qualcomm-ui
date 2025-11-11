// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {
  CoreTabs,
  type CoreTabsTabDismissButtonProps,
} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "../qds-tabs-context"

export interface TabDismissButtonProps extends CoreTabsTabDismissButtonProps {}

/**
 * Button that dismisses a tab. Renders a `<button>` element by default.
 */
export function TabDismissButton({
  render,
  ...props
}: TabDismissButtonProps): ReactElement {
  const qdsContext = useQdsTabsContext()
  const mergedProps = mergeProps(
    qdsContext.getTabDismissButtonBindings(),
    props,
  )

  return (
    <CoreTabs.TabDismissButton
      render={<InlineIconButton icon={X} render={render} />}
      {...mergedProps}
    />
  )
}
