import {X} from "lucide-react"

import {IconButton as CloseButton, type IconButtonProps as CloseButtonProps} from "@qualcomm-ui/react/button"

export function Close(props: CloseButtonProps) {
  return <CloseButton density="compact" variant="ghost" icon={X} size="lg" {...props} />
}
