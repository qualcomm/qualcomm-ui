import {X} from "lucide-react"

import {
  InlineIconButton as CloseButton,
  type InlineIconButtonProps as CloseButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"

export function Close(props: CloseButtonProps) {
  return <CloseButton icon={X} size="lg" {...props} />
}
