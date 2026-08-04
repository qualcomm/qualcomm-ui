import {
  ToastActionButton,
  type ToastActionButtonProps,
} from "./toast-action-button.js"
import {
  ToastCloseButton,
  type ToastCloseButtonProps,
} from "./toast-close-button.js"
import {
  ToastDescription,
  type ToastDescriptionProps,
} from "./toast-description.js"
import {ToastIcon, type ToastIconProps} from "./toast-icon.js"
import {ToastLabel, type ToastLabelProps} from "./toast-label.js"
import {ToastRoot, type ToastRootProps} from "./toast-root.js"

export * from "./create-toaster.js"
export * from "./qds-toast-context.js"
export * from "./toaster.js"

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
