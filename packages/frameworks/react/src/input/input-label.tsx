// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {Asterisk} from "lucide-react"

import {createQdsInputApi, inputClasses} from "@qualcomm-ui/qds-core/input"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsInputContext} from "./qds-input-context.js"

export interface InputLabelProps extends ElementRenderProp<any> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Whether the input is required. When true, the field will show a required
   * indicator.
   */
  required?: boolean | undefined
}

const defaultQdsApi = createQdsInputApi({size: "md"}, normalizeProps)

/**
 * An accessible label that is automatically associated with the input field.
 * Renders a `<label>` element by default.
 */
export function InputLabel({
  children,
  required,
  ...props
}: InputLabelProps): ReactElement {
  const qdsContext = useQdsInputContext(false)

  const mergedProps = mergeProps(
    (qdsContext ?? defaultQdsApi).getLabelBindings(),
    props,
  )

  return (
    <PolymorphicElement as="label" {...mergedProps}>
      {children}
      {required ? (
        <Icon
          className={inputClasses.requiredIndicator}
          icon={Asterisk}
          size="xs"
        />
      ) : null}
    </PolymorphicElement>
  )
}
