import type {ReactElement, ReactNode} from "react"

import type {
  PopoverElementIds,
  PopoverTriggerBindings,
} from "@qualcomm-ui/core/popover"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"

import {PopoverAnchor, type PopoverAnchorProps} from "./popover-anchor"
import {PopoverArrow, type PopoverArrowProps} from "./popover-arrow"
import {PopoverContent, type PopoverContentProps} from "./popover-content"
import {
  PopoverDescription,
  type PopoverDescriptionProps,
} from "./popover-description"
import {PopoverLabel, type PopoverLabelProps} from "./popover-label"
import {
  PopoverPositioner,
  type PopoverPositionerProps,
} from "./popover-positioner"
import {PopoverRoot, type PopoverRootProps} from "./popover-root"
import {PopoverTrigger} from "./popover-trigger"

export interface PopoverProps extends Omit<PopoverRootProps, "children"> {
  anchorProps?: PopoverAnchorProps
  arrowProps?: PopoverArrowProps
  children?: ReactNode
  contentProps?: PopoverContentProps
  description?: ReactNode
  descriptionProps?: PopoverDescriptionProps
  hideArrow?: boolean
  label?: ReactNode
  labelProps?: PopoverLabelProps
  portalProps?: PortalProps
  positionerProps?: PopoverPositionerProps
  trigger: BindingRenderProp<PopoverTriggerBindings>
}

export function Popover({
  anchorProps,
  arrowProps,
  children,
  contentProps,
  description,
  descriptionProps,
  hideArrow,
  label,
  labelProps,
  portalProps,
  positionerProps,
  trigger,
  ...props
}: PopoverProps): ReactElement {
  const labelContent = label || labelProps?.children
  const descriptionContent = description || descriptionProps?.children

  const ids: Partial<PopoverElementIds> = {
    anchor: useControlledId(anchorProps?.id),
    arrow: useControlledId(arrowProps?.id),
    content: useControlledId(contentProps?.id),
    description: descriptionContent ? descriptionProps?.id : "",
    positioner: useControlledId(positionerProps?.id),
    title: labelContent ? labelProps?.id : "",
    ...props.ids,
  }

  return (
    <PopoverRoot portalled={!portalProps?.disabled} {...props} ids={ids}>
      <PopoverAnchor {...anchorProps} id={ids.anchor}>
        <PopoverTrigger id={ids.trigger}>{trigger}</PopoverTrigger>
      </PopoverAnchor>
      <Portal {...portalProps}>
        <PopoverPositioner {...positionerProps} id={ids.positioner}>
          <PopoverContent {...contentProps} id={ids.content}>
            {!hideArrow ? (
              <PopoverArrow {...arrowProps} id={ids.arrow} />
            ) : null}
            {labelContent ? (
              <PopoverLabel {...labelProps} id={ids.title}>
                {labelContent}
              </PopoverLabel>
            ) : null}
            {descriptionContent ? (
              <PopoverDescription {...descriptionProps} id={ids.description}>
                {descriptionContent}
              </PopoverDescription>
            ) : null}
            {children}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  )
}
