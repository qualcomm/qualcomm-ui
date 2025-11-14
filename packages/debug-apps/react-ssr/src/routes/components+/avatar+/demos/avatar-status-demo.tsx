import type {ReactElement} from "react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export default function AvatarStatusDemo(): ReactElement {
  return (
    <div className="flex items-center gap-4">
      {/* preview */}
      Active
      <Avatar.Root status="active">
        <Avatar.Image alt="Jane Doe" src="/images/avatar-woman.png" />
        <Avatar.Content>JD</Avatar.Content>
        <Avatar.Status />
      </Avatar.Root>
      Offline
      <Avatar.Root status="offline">
        <Avatar.Image alt="Jane Doe" src="/images/avatar-woman.png" />
        <Avatar.Content>JD</Avatar.Content>
        <Avatar.Status />
      </Avatar.Root>
      Away
      <Avatar.Root status="away">
        <Avatar.Image alt="Jane Doe" src="/images/avatar-woman.png" />
        <Avatar.Content>JD</Avatar.Content>
        <Avatar.Status />
      </Avatar.Root>
      Busy
      <Avatar.Root status="busy">
        <Avatar.Image alt="Jane Doe" src="/images/avatar-woman.png" />
        <Avatar.Content>JD</Avatar.Content>
        <Avatar.Status />
      </Avatar.Root>
      {/* preview */}
    </div>
  )
}
