import type {ReactElement, ReactNode} from "react"

import type {PopoverApiProps} from "@qualcomm-ui/core/popover"
import {
  type PresenceApiProps,
  splitPresenceProps,
} from "@qualcomm-ui/core/presence"
import {
  PopoverContextProvider,
  usePopover,
} from "@qualcomm-ui/react-core/popover"
import {
  PresenceContextProvider,
  usePresence,
} from "@qualcomm-ui/react-core/presence"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface PopoverRootProps extends PopoverApiProps, PresenceApiProps {
  children?: ReactNode
}

export function PopoverRoot(props: PopoverRootProps): ReactElement {
  const [presenceProps, {children, ...localProps}] = splitPresenceProps(props)
  const popover = usePopover(localProps)
  const presence = usePresence(
    mergeProps({present: popover.open}, presenceProps),
  )

  return (
    <PopoverContextProvider value={popover}>
      <PresenceContextProvider value={presence}>
        {children}
      </PresenceContextProvider>
    </PopoverContextProvider>
  )
}
