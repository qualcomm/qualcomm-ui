import type {ReactElement} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {Link} from "@qualcomm-ui/react/link"

export default function InlineNotificationActionDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <InlineNotification
        action={<Link>Text link</Link>}
        description="Description for action demo"
        label="Simple"
      />

      <InlineNotification.Root>
        <InlineNotification.Icon />
        <InlineNotification.Label>Composite</InlineNotification.Label>
        <InlineNotification.Description>
          Description for action demo
        </InlineNotification.Description>
        <InlineNotification.ActionContainer>
          <Link>Text link</Link>
        </InlineNotification.ActionContainer>
      </InlineNotification.Root>
    </div>
  )
}
