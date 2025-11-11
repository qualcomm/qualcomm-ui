// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef, ReactElement, ReactNode} from "react"

import {
  createNumberInputApi,
  type NumberInputApiProps,
  type NumberInputDecrementTriggerBindings,
  type NumberInputIncrementTriggerBindings,
  numberInputMachine,
  splitNumberInputProps,
} from "@qualcomm-ui/core/number-input"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type BindingRenderProp,
  bindingRenderProp,
  type ElementRenderProp,
  type IdProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  NumberInputContextProvider,
  useNumberInputContext,
} from "./number-input-context"

export interface CoreNumberInputRootProps
  extends NumberInputApiProps,
    Omit<ElementRenderProp<"div">, "defaultValue" | "dir" | "inputMode"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreNumberInputRoot({
  children,
  ...props
}: CoreNumberInputRootProps): ReactElement {
  const [numberInputProps, localProps] = splitNumberInputProps(props)
  const machine = useMachine(numberInputMachine, numberInputProps)
  const api = createNumberInputApi(machine, normalizeProps)

  const mergedProps = mergeProps(api.getRootBindings(), localProps)

  return (
    <NumberInputContextProvider value={api}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </NumberInputContextProvider>
  )
}

export interface CoreNumberInputControlProps extends ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreNumberInputControl(
  props: CoreNumberInputControlProps,
): ReactElement {
  const context = useNumberInputContext()

  const mergedProps = mergeProps(context.getControlBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}

export interface CoreNumberInputErrorTextProps
  extends IdProp,
    ElementRenderProp<"div"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function CoreNumberInputErrorText({
  children,
  id,
  ...props
}: CoreNumberInputErrorTextProps): ReactElement {
  const context = useNumberInputContext()
  const mergedProps = mergeProps(
    context.getErrorTextBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      {children}
    </PolymorphicElement>
  )
}

export interface CoreNumberInputHintProps
  extends IdProp,
    ElementRenderProp<"span"> {}

export function CoreNumberInputHint({
  id,
  ...props
}: CoreNumberInputHintProps): ReactElement {
  const context = useNumberInputContext()
  const mergedProps = mergeProps(
    context.getHintBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="span" {...mergedProps} />
}

export interface CoreNumberInputDecrementTriggerProps extends IdProp {
  /**
   * {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: BindingRenderProp<NumberInputDecrementTriggerBindings>
}

export function CoreNumberInputDecrementTrigger({
  children,
  id,
  ...props
}: CoreNumberInputDecrementTriggerProps): ReactNode {
  const context = useNumberInputContext()

  return bindingRenderProp(
    children,
    mergeProps(
      context.getDecrementTriggerBindings({
        id: useControlledId(id),
        onDestroy: useOnDestroy(),
      }),
      props,
    ),
  )
}

export interface CoreNumberInputIncrementTriggerProps extends IdProp {
  /**
   * {@link
   * https://react-next.qui.qualcomm.com/render-props#binding-render-prop
   * Render Prop}
   *
   * @inheritDoc
   */
  children: BindingRenderProp<NumberInputIncrementTriggerBindings>
}

export function CoreNumberInputIncrementTrigger({
  children,
  id,
  ...props
}: CoreNumberInputIncrementTriggerProps): ReactNode {
  const context = useNumberInputContext()

  return bindingRenderProp(
    children,
    mergeProps(
      context.getIncrementTriggerBindings({
        id: useControlledId(id),
        onDestroy: useOnDestroy(),
      }),
      props,
    ),
  )
}

export interface CoreNumberInputInputProps
  extends ComponentPropsWithRef<"input">,
    IdProp {}

export function CoreNumberInputInput({
  id,
  ...props
}: CoreNumberInputInputProps): ReactNode {
  const context = useNumberInputContext()
  const mergedProps = mergeProps(
    context.getInputBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <input {...mergedProps} />
}

export type CoreNumberInputLabelProps = ElementRenderProp<"div"> & IdProp

export function CoreNumberInputLabel({
  id,
  ...props
}: CoreNumberInputLabelProps): ReactElement {
  const context = useNumberInputContext()
  const mergedProps = mergeProps(
    context.getLabelBindings({
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
    }),
    props,
  )

  return <PolymorphicElement as="div" {...mergedProps} />
}

export type CoreNumberInputInputGroupProps = ElementRenderProp<"div">

export function CoreNumberInputInputGroup(
  props: CoreNumberInputInputGroupProps,
): ReactElement {
  const context = useNumberInputContext()
  const mergedProps = mergeProps(context.getInputGroupBindings(), props)

  return <PolymorphicElement as="div" {...mergedProps} />
}
