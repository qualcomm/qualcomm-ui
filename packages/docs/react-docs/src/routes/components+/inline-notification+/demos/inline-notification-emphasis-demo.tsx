import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"

export default function InlineNotificationEmphasisDemo(): ReactElement {
  return (
    <div className="grid w-96 gap-4">
      {/* preview */}
      <InlineNotification emphasis="info" label="info" />
      <InlineNotification emphasis="success" label="success" />
      <InlineNotification emphasis="warning" label="warning" />
      <InlineNotification emphasis="danger" label="danger" />
      <InlineNotification emphasis="neutral" label="neutral" />
      {/* preview */}
    </div>
  )
}
