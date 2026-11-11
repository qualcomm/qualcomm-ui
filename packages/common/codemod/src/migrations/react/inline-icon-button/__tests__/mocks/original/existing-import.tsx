import {Search, X} from "lucide-react"

import {Button, IconButton} from "@qualcomm-ui/react/button"
import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"

export function ClearButton(props: InlineIconButtonProps) {
  return <InlineIconButton {...props} />
}

export function Toolbar() {
  return (
    <>
      <Button>Save</Button>
      <IconButton aria-label="Search" icon={Search} />
      <ClearButton aria-label="Clear" icon={X} />
    </>
  )
}
