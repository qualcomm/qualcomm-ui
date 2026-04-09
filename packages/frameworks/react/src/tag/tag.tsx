// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {X} from "lucide-react"

import {
  createTagApi,
  splitTagProps,
  type TagApiProps,
  tagMachine,
} from "@qualcomm-ui/core/tag"
import {createQdsTagApi, type QdsTagApiProps} from "@qualcomm-ui/qds-core/tag"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TagProps
  extends TagApiProps,
    QdsTagApiProps,
    Omit<ElementRenderProp<"button">, "dir"> {
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
   * {@link https://lucide.dev lucide-react} icon, positioned before
   * the button text. Can be supplied as a `ReactElement` for additional
   * customization.
   */
  startIcon?: LucideIconOrElement
}

export function Tag(props: TagProps): ReactElement {
  const [tagApiProps, localProps] = splitTagProps(props)
  const machine = useMachine(tagMachine, tagApiProps)
  const tagApi = createTagApi(machine, normalizeProps)

  const {selected, variant} = tagApiProps
  const {children, emphasis, endIcon, radius, shape, size, startIcon, ...rest} =
    localProps

  const qdsApi = createQdsTagApi(
    {
      emphasis,
      radius,
      selected,
      shape,
      size,
      variant,
    } satisfies Explicit<QdsTagApiProps>,
    normalizeProps,
  )

  const rootElement = qdsApi.isInteractiveVariant() ? "button" : "span"
  const rootProps = mergeProps(
    tagApi.getRootBindings(),
    qdsApi.getRootBindings(),
    rest,
  )

  return (
    <PolymorphicElement as={rootElement} {...rootProps}>
      {startIcon ? (
        <IconOrNode icon={startIcon} {...qdsApi.getStartIconBindings()} />
      ) : null}
      <span>{children}</span>
      {variant === "dismissable" ? (
        <button
          {...mergeProps(
            tagApi.getDismissButtonBindings(),
            qdsApi.getDismissButtonBindings(),
          )}
        >
          <IconOrNode icon={X} {...qdsApi.getEndIconBindings()} />
        </button>
      ) : endIcon ? (
        <IconOrNode icon={endIcon} {...qdsApi.getEndIconBindings()} />
      ) : null}
    </PolymorphicElement>
  )
}
