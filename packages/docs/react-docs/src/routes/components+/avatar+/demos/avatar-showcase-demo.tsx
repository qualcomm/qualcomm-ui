import type {ReactElement} from "react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export default function AvatarShowcaseDemo(): ReactElement {
  return (
    // preview
    <Avatar.Root status="active">
      <Avatar.Image alt="John Doe" src="/images/avatar-man.png" />
      <Avatar.Content>JD</Avatar.Content>
      <Avatar.Status />
    </Avatar.Root>
    // preview
  )
}
