import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

// preview
const toaster = createToaster({
  max: 3,
  placement: "bottom-end",
})
// preview

export default function ToastMaxVisibleDemo(): ReactElement {
  return (
    <>
      <Toaster toaster={toaster} />

      <Button
        onClick={() =>
          toaster.create({
            description: "Toast Description",
            label: "Toast Label",
          })
        }
        type="button"
        variant="outline"
      >
        Show Toast
      </Button>
    </>
  )
}
