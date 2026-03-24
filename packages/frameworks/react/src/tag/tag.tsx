// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, type ReactNode, useState} from "react"

import {X} from "lucide-react"

import {createQdsTagApi, type QdsTagApiProps} from "@qualcomm-ui/qds-core/tag"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TagProps extends QdsTagApiProps, ElementRenderProp<"button"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * {@link https://lucide.dev lucide-react} icon, positioned after
   * the button text. Can be supplied as a `ReactElement` for additional
   * customization. Note that this prop is ignored if {@link variant} is
   * `dismissable`, as it is reserved for the dismiss icon.
   */
  endIcon?: LucideIconOrElement

  /**
   * Callback fired when the dismiss button is clicked. Only applicable when
   * {@link variant} is `dismissable`.
   */
  onDismiss?: () => void

  /**
   * {@link https://lucide.dev lucide-react} icon, positioned before
   * the button text. Can be supplied as a `ReactElement` for additional
   * customization.
   */
  startIcon?: LucideIconOrElement
}

export function Tag({
  children,
  disabled,
  emphasis,
  endIcon,
  onDismiss,
  radius,
  shape,
  size,
  startIcon,
  variant,
  ...props
}: TagProps): ReactElement {
  const [selected, setSelected] = useState<boolean>(false)

  const qdsApi = createQdsTagApi(
    {disabled, emphasis, radius, selected, shape, size, variant},
    normalizeProps,
  )

  const rootElement = qdsApi.isInteractiveVariant() ? "button" : "span"
  const rootProps = mergeProps(
    qdsApi.getRootBindings(),
    {
      onClick: () => {
        if (variant === "selectable") {
          setSelected((prevState) => !prevState)
        }
      },
    },
    props,
  )

  return (
    <PolymorphicElement as={rootElement} {...rootProps}>
      {startIcon ? (
        <IconOrNode icon={startIcon} {...qdsApi.getStartIconBindings()} />
      ) : null}
      {children}
      {variant === "dismissable" ? (
        <button {...qdsApi.getDismissButtonBindings()} onClick={onDismiss}>
          <IconOrNode icon={X} {...qdsApi.getEndIconBindings()} />
        </button>
      ) : endIcon ? (
        <IconOrNode icon={endIcon} {...qdsApi.getEndIconBindings()} />
      ) : null}
    </PolymorphicElement>
  )
}
