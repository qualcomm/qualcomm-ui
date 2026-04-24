import type {ReactElement, ReactNode} from "react"

import {
  splitTextInputProps,
  type TextInputApiProps,
} from "@qualcomm-ui/core/text-input"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {
  TextInputContextProvider,
  useTextInput,
} from "@qualcomm-ui/react-core/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface TextInputRootProps
  extends
    TextInputApiProps,
    Omit<ElementRenderProp<"div">, "dir" | "defaultValue"> {
  children?: ReactNode
}

export function TextInputRoot({
  children,
  ...props
}: TextInputRootProps): ReactElement {
  const [textInputProps, localProps] = splitTextInputProps(props)
  const context = useTextInput(textInputProps)
  const mergedProps = mergeProps(
    context.getRootBindings(),
    {className: "vs-text-input"},
    localProps,
  )

  return (
    <TextInputContextProvider value={context}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </TextInputContextProvider>
  )
}
