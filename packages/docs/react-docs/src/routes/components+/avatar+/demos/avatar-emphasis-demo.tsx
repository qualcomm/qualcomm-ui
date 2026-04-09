import type {ReactElement} from "react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export function AvatarEmphasisDemo(): ReactElement {
  return (
    <div className="flex items-center gap-4">
      {/* preview */}
      Neutral
      <Avatar.Root emphasis="neutral">
        <Avatar.Content>O</Avatar.Content>
      </Avatar.Root>
      High Contrast
      <Avatar.Root emphasis="contrast">
        <Avatar.Content>O</Avatar.Content>
      </Avatar.Root>
      Brand
      <Avatar.Root emphasis="brand">
        <Avatar.Content>O</Avatar.Content>
      </Avatar.Root>
      {/* preview */}
    </div>
  )
}
