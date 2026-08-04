// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  createQdsFieldGroupApi,
  type QdsFieldGroupOrientation,
  type QdsFieldGroupSize,
} from "@qualcomm-ui/qds-core/field-group"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsFieldGroupContextProvider} from "./qds-field-group-context.js"

export interface FieldGroupRootProps extends ElementRenderProp<"fieldset"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Adds padding at the start of the items container.
   */
  indented?: boolean

  /**
   * Marks the group as invalid.
   */
  invalid?: boolean

  /**
   * Layout direction for items.
   * @default 'vertical'
   */
  orientation?: QdsFieldGroupOrientation

  /**
   * The size of the group items.
   * @default 'md'
   */
  size?: QdsFieldGroupSize
}

/**
 * Root container for the field group. Renders a `<fieldset>` element by default.
 */
export function FieldGroupRoot({
  children,
  indented,
  invalid,
  orientation,
  size,
  ...props
}: FieldGroupRootProps): ReactElement {
  const qdsContext = useMemo(
    () =>
      createQdsFieldGroupApi(
        {indented, invalid, orientation, size},
        normalizeProps,
      ),
    [indented, invalid, orientation, size],
  )

  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsFieldGroupContextProvider value={qdsContext}>
      <PolymorphicElement as="fieldset" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </QdsFieldGroupContextProvider>
  )
}
