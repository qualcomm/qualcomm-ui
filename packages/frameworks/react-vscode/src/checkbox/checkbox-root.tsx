import {type ReactElement, type ReactNode, useMemo} from "react"

import {
  type CheckboxApiProps,
  splitCheckboxProps,
} from "@qualcomm-ui/core/checkbox"
import {
  CheckboxContextProvider,
  useCheckbox,
} from "@qualcomm-ui/react-core/checkbox"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {VsCheckboxContextProvider} from "./vs-checkbox-context"
import {createVsCheckboxApi} from "./vs-checkbox.api"

export interface CheckboxRootProps
  extends IdProp, CheckboxApiProps, Omit<ElementRenderProp<"label">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the checkbox. Renders a `<label>` element by default.
 */
export function CheckboxRoot({
  children,
  id,
  ...props
}: CheckboxRootProps): ReactElement {
  const [checkboxProps, localProps] = splitCheckboxProps(props)
  const context = useCheckbox(checkboxProps)
  const vsContext = useMemo(() => createVsCheckboxApi(), [])
  const mergedProps = mergeProps(
    context.getRootBindings({id: useControlledId(id)}),
    vsContext.getRootBindings(),
    localProps,
  )

  return (
    <VsCheckboxContextProvider value={vsContext}>
      <CheckboxContextProvider value={context}>
        <PolymorphicElement as="label" {...mergedProps}>
          {children}
        </PolymorphicElement>
      </CheckboxContextProvider>
    </VsCheckboxContextProvider>
  )
}
