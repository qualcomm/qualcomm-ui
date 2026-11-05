import type {ReactElement} from "react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export function AvatarExplorerDemo(): ReactElement {
  return (
    <Avatar.Root status="active">
      <Avatar.Image alt="John Doe" src="/images/avatar-man.png" />
      <Avatar.Status />
    </Avatar.Root>
  )
}
