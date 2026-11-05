import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {Link} from "@qualcomm-ui/react/link"

export function InlineNotificationExplorerDemo(): ReactElement {
  return (
    <InlineNotification
      action={<Link>Text link</Link>}
      className="w-96"
      description="Description"
      dismissable
      label="Label"
    />
  )
}
