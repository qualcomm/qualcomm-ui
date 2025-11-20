import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"

export function InlineNotificationSimpleDemo(): ReactElement {
  return (
    // preview
    <InlineNotification
      className="w-96"
      description="Description"
      dismissable
      label="Label"
    />
    // preview
  )
}
