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
export type MenuProps = PopoverApiProps & {
  children?: ReactNode
}

export function Menu({children, ...props}: MenuProps): ReactElement {
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
export interface MenuTriggerProps {
  children: BindingRenderProp<PopoverTriggerBindings>
}

export function MenuTrigger({children}: MenuTriggerProps): ReactElement {
  const bindings = usePopoverTrigger({})
  return bindingRenderProp(children, bindings)
}

/**
 * @public
 */
export interface MenuContentProps {
  children?: ReactNode
  className?: string
}

export function MenuContent({
  children,
  className,
}: MenuContentProps): ReactElement {
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
          {...contentBindings}
          className={clsx("vs-menu", className)}
          role="menu"
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}
