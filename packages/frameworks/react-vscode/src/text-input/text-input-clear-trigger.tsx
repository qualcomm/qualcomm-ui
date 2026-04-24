import type {ReactElement} from "react"

import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {useTextInputClearTrigger} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {Icon} from "../icon"

export interface TextInputClearTriggerProps extends ElementRenderProp<"button"> {}

export function TextInputClearTrigger(
  props: TextInputClearTriggerProps,
): ReactElement {
  const contextProps = useTextInputClearTrigger()
  const mergedProps = mergeProps(
    contextProps,
    {
      "aria-label": "Clear input",
      className: "vs-text-input__clear-trigger",
    },
    props,
  )
  return (
    <PolymorphicElement as="button" {...mergedProps}>
      <Icon icon="close" size={12} />
    </PolymorphicElement>
  )
}
