import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

export function ButtonSizesDemo(): ReactElement {
  return (
    <div className="grid justify-items-center gap-4">
      {/* preview */}
      <Button
        emphasis="primary"
        size="sm"
        startIcon={ExternalLink}
        variant="fill"
      >
        Action
      </Button>
      <Button
        emphasis="primary"
        size="md"
        startIcon={ExternalLink}
        variant="fill"
      >
        Action
      </Button>
      <Button
        emphasis="primary"
        size="lg"
        startIcon={ExternalLink}
        variant="fill"
      >
        Action
      </Button>
      {/* preview */}
    </div>
  )
}
