import type {ReactElement} from "react"

import {Avatar} from "@qualcomm-ui/react/avatar"

export default function AvatarVariantDemo(): ReactElement {
  return (
    <div className="flex items-center gap-4">
      {/* preview */}
      Neutral
      <Avatar.Root variant="neutral">
        <Avatar.Content>OK</Avatar.Content>
      </Avatar.Root>
      High Contrast
      <Avatar.Root variant="contrast">
        <Avatar.Content>OK</Avatar.Content>
      </Avatar.Root>
      Brand
      <Avatar.Root variant="brand">
        <Avatar.Content>OK</Avatar.Content>
      </Avatar.Root>
      {/* preview */}
    </div>
  )
}
