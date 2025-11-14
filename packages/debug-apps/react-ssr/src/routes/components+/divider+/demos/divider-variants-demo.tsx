import type {ReactElement} from "react"

import {Divider} from "@qualcomm-ui/react/divider"

export default function DividerVariantsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4 px-8">
      {/* preview */}
      <span className="text-neutral-primary font-body-md">
        subtle: Low contrast, less visually prominent
      </span>
      <Divider variant="subtle" />

      <span className="text-neutral-primary font-body-md">
        normal (default): Standard appearance with balanced visibility
      </span>
      <Divider />

      <span className="text-neutral-primary font-body-md">
        strong: High contrast, maximum visual separation
      </span>
      <Divider variant="strong" />
      {/* preview */}
    </div>
  )
}
