import type {ReactElement} from "react"

import {Search} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export default function Demo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-x-8 gap-y-5">
      <span className="text-neutral-primary font-heading-xs">Fill</span>
      <span className="text-neutral-primary font-heading-xs">Outline</span>
      <span className="text-neutral-primary font-heading-xs">Ghost</span>

      {/* preview */}
      <IconButton emphasis="neutral" icon={Search} variant="fill" />
      <IconButton emphasis="neutral" icon={Search} variant="outline" />
      <IconButton emphasis="neutral" icon={Search} variant="ghost" />

      <IconButton emphasis="primary" icon={Search} variant="fill" />
      <IconButton emphasis="primary" icon={Search} variant="outline" />
      <IconButton emphasis="primary" icon={Search} variant="ghost" />

      <IconButton emphasis="danger" icon={Search} variant="fill" />
      <IconButton emphasis="danger" icon={Search} variant="outline" />
      <IconButton emphasis="danger" icon={Search} variant="ghost" />

      <IconButton disabled icon={Search} variant="fill" />
      <IconButton disabled icon={Search} variant="outline" />
      <IconButton disabled icon={Search} variant="ghost" />
      {/* preview */}
    </div>
  )
}
