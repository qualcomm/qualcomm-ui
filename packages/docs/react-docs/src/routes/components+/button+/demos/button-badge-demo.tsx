import type {ReactElement} from "react"

import {Mail} from "lucide-react"

import {NumberBadge, StatusBadge} from "@qualcomm-ui/react/badge"
import {Button} from "@qualcomm-ui/react/button"

export function ButtonBadgeDemo(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* preview */}
      <Button
        badge={<NumberBadge value={3} />}
        emphasis="primary"
        startIcon={Mail}
        variant="fill"
      >
        Inbox
      </Button>
      <Button
        badge={<NumberBadge value={120} />}
        emphasis="primary"
        variant="outline"
      >
        Notifications
      </Button>
      <Button badge={<StatusBadge emphasis="success" />} variant="outline">
        Online
      </Button>
      {/* preview */}
    </div>
  )
}
