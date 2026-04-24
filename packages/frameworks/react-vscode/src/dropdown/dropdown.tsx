import type {ReactElement, ReactNode} from "react"

import type {PopoverApiProps, PopoverTriggerBindings} from "@qualcomm-ui/core/popover"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {
  PopoverContextProvider,
  usePopover,
  usePopoverContext,
  usePopoverTrigger,
} from "@qualcomm-ui/react-core/popover"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type BindingRenderProp,
  bindingRenderProp,
} from "@qualcomm-ui/react-core/system"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DropdownProps = PopoverApiProps & {
  children?: ReactNode
}

export function Dropdown({children, ...props}: DropdownProps): ReactElement {
  const api = usePopover(props)
  return (
    <PopoverContextProvider value={api}>
      {children}
    </PopoverContextProvider>
  )
}

/**
 * @public
 */
export interface DropdownTriggerProps {
  children: BindingRenderProp<PopoverTriggerBindings>
}

export function DropdownTrigger({children}: DropdownTriggerProps): ReactElement {
  const bindings = usePopoverTrigger({})
  return bindingRenderProp(children, bindings)
}

/**
 * @public
 */
export interface DropdownContentProps {
  children?: ReactNode
  className?: string
}

export function DropdownContent({
  children,
  className,
}: DropdownContentProps): ReactElement {
  const context = usePopoverContext()
  const positionerBindings = context.getPositionerBindings({
    id: useControlledId(),
    onDestroy: useOnDestroy(),
  })
  const contentBindings = context.getContentBindings({
    id: useControlledId(),
    onDestroy: useOnDestroy(),
  })

  return (
    <Portal>
      <div {...positionerBindings}>
        <div
          className={clsx("vs-dropdown", className)}
          {...contentBindings}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}
