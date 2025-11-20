import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function ToastDurationDemo(): ReactElement {
  return (
    <>
      <Toaster toaster={toaster} />

      <Button
        onClick={
          () =>
            // preview
            toaster.create({
              duration: 10000,
              label: "Task failed successfully",
              type: "success",
            })
          // preview
        }
        type="button"
        variant="outline"
      >
        Show Toast
      </Button>
    </>
  )
}
