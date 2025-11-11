import {
  ToastActionButton,
  type ToastActionButtonProps,
} from "./toast-action-button"
import {
  ToastCloseButton,
  type ToastCloseButtonProps,
} from "./toast-close-button"
import {ToastDescription, type ToastDescriptionProps} from "./toast-description"
import {ToastIcon, type ToastIconProps} from "./toast-icon"
import {ToastLabel, type ToastLabelProps} from "./toast-label"
import {ToastRoot, type ToastRootProps} from "./toast-root"

export * from "./create-toaster"
export * from "./qds-toast-context"
export * from "./toaster"

export type {
  ToastActionButtonProps,
  ToastCloseButtonProps,
  ToastDescriptionProps,
  ToastIconProps,
  ToastLabelProps,
  ToastRootProps,
}

type ToastComponent = {
  ActionButton: typeof ToastActionButton
  CloseButton: typeof ToastCloseButton
  Description: typeof ToastDescription
  Icon: typeof ToastIcon
  Label: typeof ToastLabel
  Root: typeof ToastRoot
}

export const Toast: ToastComponent = {
  ActionButton: ToastActionButton,
  CloseButton: ToastCloseButton,
  Description: ToastDescription,
  Icon: ToastIcon,
  Label: ToastLabel,
  Root: ToastRoot,
}
