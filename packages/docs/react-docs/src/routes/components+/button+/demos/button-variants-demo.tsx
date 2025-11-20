import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"

export function ButtonVariantsDemo(): ReactElement {
  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-x-8 gap-y-5">
      <span className="text-neutral-primary font-heading-xs">Fill</span>
      <span className="text-neutral-primary font-heading-xs">Outline</span>
      <span className="text-neutral-primary font-heading-xs">Ghost</span>

      {/* preview */}
      <Button emphasis="neutral" variant="fill">
        Action
      </Button>
      <Button emphasis="neutral" variant="outline">
        Action
      </Button>
      <Button emphasis="neutral" variant="ghost">
        Action
      </Button>

      <Button emphasis="primary" variant="fill">
        Action
      </Button>
      <Button emphasis="primary" variant="outline">
        Action
      </Button>
      <Button emphasis="primary" variant="ghost">
        Action
      </Button>

      <Button emphasis="danger" variant="fill">
        Action
      </Button>
      <Button emphasis="danger" variant="outline">
        Action
      </Button>
      <Button emphasis="danger" variant="ghost">
        Action
      </Button>

      <Button disabled variant="fill">
        Action
      </Button>
      <Button disabled variant="outline">
        Action
      </Button>
      <Button disabled variant="ghost">
        Action
      </Button>
      {/* preview */}
    </div>
  )
}
