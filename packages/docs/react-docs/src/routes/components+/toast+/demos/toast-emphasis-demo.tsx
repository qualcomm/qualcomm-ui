import type {ReactElement} from "react"

import type {QdsNotificationEmphasis} from "@qualcomm-ui/qds-core/inline-notification"
import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({
  placement: "bottom-end",
})

const types: QdsNotificationEmphasis[] = [
  "info",
  "success",
  "warning",
  "danger",
  "neutral",
  "loading",
]

export default function ToastEmphasisDemo(): ReactElement {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        {types.map((emphasis) => (
          <Button
            key={emphasis}
            onClick={() =>
              toaster.create({
                label: `The status is ${emphasis}`,
                type: emphasis,
              })
            }
            variant="outline"
          >
            {emphasis}
          </Button>
        ))}
      </div>
      <Toaster toaster={toaster} />
    </>
  )
}
