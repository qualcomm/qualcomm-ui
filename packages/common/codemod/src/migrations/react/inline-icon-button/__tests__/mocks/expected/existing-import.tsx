import {Search, X} from "lucide-react"

import {Button, IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"

export function ClearButton(props: IconButtonProps) {
  return <IconButton density="compact" variant="ghost" {...props} />
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
