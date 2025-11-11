// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useId} from "react"

import {
  createToastApi,
  createToastGroupApi,
  type ToastApiProps,
  toastGroupMachine,
  type ToastGroupProps,
  type ToastGroupSchema,
  toastMachine,
  type ToastOptions,
  type ToastStore,
} from "@qualcomm-ui/core/toast"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  type FunctionRenderProp,
  PolymorphicAsElement,
  renderProp,
} from "@qualcomm-ui/react-core/system"
import type {Machine} from "@qualcomm-ui/utils/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ToastContextProvider} from "./toast-context"

export interface CoreToasterProps
  extends Omit<ElementRenderProp<"div">, "children" | "dir">,
    Omit<ToastGroupProps, "store" | "id"> {
  /**
   * {@link https://react-next.qui.qualcomm.com/render-props#render-prop Render Prop}
   * that provides the {@link ToastOptions}.
   *
   * @inheritDoc
   */
  children: FunctionRenderProp<ToastOptions<ReactElement>>

  /**
   * The {@link ToastStore} instance.
   * @inheritDoc
   */
  toaster: ToastStore
}

export function CoreToaster({
  children,
  dir,
  toaster,
  ...props
}: CoreToasterProps): ReactElement {
  const machine = useMachine(toastGroupMachine, {
    dir,
    id: useId(),
    store: toaster,
  })
  const api = createToastGroupApi<ReactElement>(machine, normalizeProps)
  const mergedProps = mergeProps(api.getGroupBindings(), props)

  return (
    <PolymorphicAsElement as="div" {...mergedProps}>
      {api.getToasts().map((toast, index) => {
        return (
          <ToastProvider
            key={toast.id}
            index={index}
            parent={machine}
            value={toast}
          >
            {(ctx) => renderProp(children, ctx)}
          </ToastProvider>
        )
      })}
    </PolymorphicAsElement>
  )
}

interface ToastProviderProps {
  children: FunctionRenderProp<ToastOptions<ReactElement>>
  index: number
  parent: Machine<ToastGroupSchema<ReactElement>>
  value: ToastApiProps<ReactElement>
}

function ToastProvider(props: ToastProviderProps) {
  const {index, parent, value} = props
  const composedProps = {...value, index, parent}

  const machine = useMachine(toastMachine, composedProps)
  const api = createToastApi(machine, normalizeProps)
  return (
    <ToastContextProvider value={api}>
      {props.children(props.value)}
    </ToastContextProvider>
  )
}
