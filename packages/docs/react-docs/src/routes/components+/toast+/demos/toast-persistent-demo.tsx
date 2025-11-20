import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function ToastPersistentDemo(): ReactElement {
  return (
    <>
      <Toaster toaster={toaster} />

      <Button
        onClick={
          () =>
            // preview
            toaster.create({
              label: "Persistent Toast",
              type: "loading",
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
