import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {Link} from "@qualcomm-ui/react/link"

export default function InlineNotificationLayoutDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <InlineNotification
        action={<Link size="sm">Text link</Link>}
        description="Description for horizontal orientation"
        dismissable
        label="Horizontal"
      />

      <InlineNotification
        action={<Link size="sm">Text link</Link>}
        description="Description for vertical orientation"
        dismissable
        label="Vertical"
        orientation="vertical"
      />
      {/* preview */}
    </div>
  )
}
