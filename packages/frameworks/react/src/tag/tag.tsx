// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {X} from "lucide-react"

import {
  createQdsTagApi,
  type QdsTagApiProps,
  type QdsTagShape,
} from "@qualcomm-ui/qds-core/tag"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {useControlledState} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TagProps extends QdsTagApiProps, ElementRenderProp<"button"> {
  /**
   * Applies the active style to a link tag. Honored only when it is rendered as an
   * anchor via {@link render}. This is purely visual; set
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current aria-current}
   * on the anchor for accessibility.
   *
   * @since 1.25.0
   *
   * @default false
   */
  active?: boolean

  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * Initial selected state when the component is uncontrolled.
   * Only applicable when {@link variant} is `selectable`.
   * Ignored when {@link selected} is provided.
   *
   * @since 1.24.0
   *
   * @default false
   */
  defaultSelected?: boolean

  /**
   * {@link https://lucide.dev lucide-react} icon, positioned after
   * the button text. Can be supplied as a `ReactElement` for additional
   * customization.
   * Ignored when {@link variant} is `dismissable`, as it is reserved for the
   * dismiss icon.
   */
  endIcon?: LucideIconOrElement

  /**
   * Callback fired when the dismiss button is clicked.
   * Only applicable when {@link variant} is `dismissable`.
   */
  onDismiss?: () => void

  /**
   * Callback fired when the selected state changes. Fires in both controlled
   * and uncontrolled modes.
   * Only applicable when {@link variant} is `selectable`.
   *
   * @since 1.24.0
   */
  onSelectedChange?: (selected: boolean) => void

  /**
   * Controls the selected state. When omitted, the tag manages its own selected
   * state internally.
   * Only applicable when {@link variant} is `selectable`.
   *
   * @since 1.24.0
   */
  selected?: boolean

  /**
   * Governs the shape of the tag.
   *
   * @since 1.17.0
   *
   * @default 'square'
   */
  shape?: QdsTagShape

  /**
   * {@link https://lucide.dev lucide-react} icon, positioned before
   * the button text. Can be supplied as a `ReactElement` for additional
   * customization.
   */
  startIcon?: LucideIconOrElement
}

export function Tag({
  active,
  children,
  defaultSelected,
  disabled,
  emphasis,
  endIcon,
  onDismiss,
  onSelectedChange,
  radius,
  selected: selectedProp,
  shape,
  size,
  startIcon,
  variant,
  ...props
}: TagProps): ReactElement {
  const [selected, setSelected] = useControlledState<boolean>({
    controlled: selectedProp,
    defaultValue: defaultSelected ?? false,
    name: "Tag",
    onChangeProp: onSelectedChange,
    state: "selected",
  })

  const qdsApi = createQdsTagApi(
    {active, disabled, emphasis, radius, selected, shape, size, variant},
    normalizeProps,
  )

  const rootElement = qdsApi.isInteractiveVariant() ? "button" : "span"
  const rootProps = mergeProps(
    qdsApi.getRootBindings(),
    {
      onClick: () => {
        if (variant === "selectable" && !disabled) {
          setSelected(!selected)
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
      <span>{children}</span>
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
