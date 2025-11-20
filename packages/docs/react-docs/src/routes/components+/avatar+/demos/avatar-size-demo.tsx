import type {ReactElement} from "react"

import type {QdsAvatarSize} from "@qualcomm-ui/qds-core/avatar"
import {Avatar} from "@qualcomm-ui/react/avatar"

const sizes: QdsAvatarSize[] = ["xs", "sm", "md", "lg", "xl"]

export function AvatarSizeDemo(): ReactElement {
  return (
    <div className="flex items-center gap-4">
      {/* preview */}

      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar.Root size={size}>
            <Avatar.Image alt="Jane Doe" src="/images/avatar-woman.png" />
            <Avatar.Content>JD</Avatar.Content>
          </Avatar.Root>
          {size}
        </div>
      ))}
      {/* preview */}
    </div>
  )
}
