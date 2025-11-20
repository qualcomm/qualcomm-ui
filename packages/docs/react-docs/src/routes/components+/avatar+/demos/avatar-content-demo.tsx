import type {ReactElement} from "react"

import {User} from "lucide-react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export function AvatarFallback(): ReactElement {
  return (
    <div className="flex items-center gap-4">
      {/* preview */}
      Initials
      <Avatar.Root>
        <Avatar.Content>OK</Avatar.Content>
      </Avatar.Root>
      Icon
      <Avatar.Root>
        <Avatar.Content icon={User} />
      </Avatar.Root>
      Fallback
      <Avatar.Root>
        <Avatar.Image alt="John Doe" src="https://example.invalid" />
        <Avatar.Content>JD</Avatar.Content>
      </Avatar.Root>
      {/* preview */}
    </div>
  )
}
