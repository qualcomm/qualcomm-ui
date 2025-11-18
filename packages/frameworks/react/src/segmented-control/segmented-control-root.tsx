// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  type SegmentedControlApiProps,
  splitSegmentedControlProps,
} from "@qualcomm-ui/core/segmented-control"
import {
  createQdsSegmentedControlApi,
  type QdsSegmentedControlApiProps,
} from "@qualcomm-ui/qds-core/segmented-control"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  SegmentedControlContextProvider,
  useSegmentedControl,
} from "@qualcomm-ui/react-core/segmented-control"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsSegmentedControlContextProvider} from "./qds-segmented-control-context"

export interface SegmentedControlRootProps
  extends Omit<
      ElementRenderProp<"fieldset">,
      "defaultValue" | "dir" | "disabled"
    >,
    SegmentedControlApiProps,
    QdsSegmentedControlApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The root element of the segmented control. Renders as a `<fieldset>` by default.
 */
export function SegmentedControlRoot({
  children,
  id,
  layout,
  size,
  variant,
  ...props
}: SegmentedControlRootProps): ReactElement {
  const [segmentedControlProps, localProps] = splitSegmentedControlProps(props)
  const context = useSegmentedControl(segmentedControlProps)
  const qdsContext = useMemo(
    () => createQdsSegmentedControlApi({layout, size, variant}, normalizeProps),
    [layout, size, variant],
  )
  const mergedProps = mergeProps(
    context.getGroupBindings({id: useControlledId(id)}),
    qdsContext.getGroupBindings(),
    localProps,
  )

  return (
    <QdsSegmentedControlContextProvider value={qdsContext}>
      <SegmentedControlContextProvider value={context}>
        <PolymorphicElement as="fieldset" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </SegmentedControlContextProvider>
    </QdsSegmentedControlContextProvider>
  )
}
