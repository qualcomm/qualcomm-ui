// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import type {PopoverApiProps} from "@qualcomm-ui/core/popover"
import {
  type PresenceApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
import {
  createQdsPopoverApi,
  type QdsPopoverApiProps,
} from "@qualcomm-ui/qds-core/popover"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  PopoverContextProvider,
  usePopover,
} from "@qualcomm-ui/react-core/popover"
import {
  PresenceContextProvider,
  usePresence,
} from "@qualcomm-ui/react-core/presence"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsPopoverContextProvider} from "./qds-popover-context"

export interface PopoverRootProps
  extends PopoverApiProps, PresenceApiProps, QdsPopoverApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function PopoverRoot(props: PopoverRootProps): ReactElement {
  const [presenceProps, {children, emphasis, ...localProps}] =
    splitPresenceProps(props)
  const popover = usePopover(localProps)
  const presence = usePresence(
    mergeProps({present: popover.open}, presenceProps),
  )
  const qdsPopoverApi = useMemo(
    () => createQdsPopoverApi({emphasis}, normalizeProps),
    [emphasis],
  )

  return (
    <QdsPopoverContextProvider value={qdsPopoverApi}>
      <PopoverContextProvider value={popover}>
        <PresenceContextProvider value={presence}>
          {children}
        </PresenceContextProvider>
      </PopoverContextProvider>
    </QdsPopoverContextProvider>
  )
}
