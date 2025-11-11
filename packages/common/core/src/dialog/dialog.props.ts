import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {DialogApiProps} from "./dialog.types"

export const dialogProps: (keyof DialogApiProps)[] =
  createProps<DialogApiProps>()(
    "aria-label",
    "closeOnEscape",
    "closeOnInteractOutside",
    "defaultOpen",
    "dir",
    "finalFocusEl",
    "getRootNode",
    "initialFocusEl",
    "modal",
    "onEscapeKeyDown",
    "onFocusOutside",
    "onInteractOutside",
    "onOpenChange",
    "onPointerDownOutside",
    "onRequestDismiss",
    "open",
    "persistentElements",
    "preventScroll",
    "restoreFocus",
    "role",
    "trapFocus",
  )

export const splitDialogProps: <Props extends DialogApiProps>(
  props: Props,
) => [DialogApiProps, Omit<Props, keyof DialogApiProps>] =
  createSplitProps<DialogApiProps>(dialogProps)
