import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"

export default function InlineNotificationDismissableDemo(): ReactElement {
  return (
    <div className="flex w-96 flex-col gap-4">
      {/* preview */}
      <InlineNotification dismissable label="Simple" />

      <InlineNotification.Root>
        <InlineNotification.Icon />
        <InlineNotification.Label>Composite</InlineNotification.Label>
        <InlineNotification.CloseButton />
      </InlineNotification.Root>
      {/* preview */}
    </div>
  )
}
