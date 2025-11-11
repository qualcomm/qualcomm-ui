import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"

export default function InlineNotificationCompositeDemo(): ReactElement {
  return (
    // preview
    <InlineNotification.Root className="w-96">
      <InlineNotification.Icon />
      <InlineNotification.Label>Label</InlineNotification.Label>
      <InlineNotification.Description>
        Description
      </InlineNotification.Description>
    </InlineNotification.Root>
    // preview
  )
}
