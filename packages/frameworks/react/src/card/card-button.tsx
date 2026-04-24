// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {
  type QdsCardButtonApiProps,
  translateCardButtonProps,
} from "@qualcomm-ui/qds-core/card"
import {Button} from "@qualcomm-ui/react/button"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsCardContext} from "./qds-card-context"

export interface CardButtonProps
  extends ElementRenderProp<"button">, QdsCardButtonApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * A button area within the card footer. Renders a `<button>` element by default.
 */
export function CardButton({variant, ...props}: CardButtonProps): ReactElement {
  const qdsContext = useQdsCardContext()
  const mergedProps = mergeProps(qdsContext.getButtonBindings(), props)

  return <Button {...mergedProps} {...translateCardButtonProps({variant})} />
}
