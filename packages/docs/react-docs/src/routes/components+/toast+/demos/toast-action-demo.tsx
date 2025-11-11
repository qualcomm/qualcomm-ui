import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({
  placement: "bottom-end",
})

export default function ToastActionDemo(): ReactElement {
  return (
    <>
      <Toaster toaster={toaster} />

      <Button
        onClick={
          () =>
            // preview
            toaster.create({
              action: {
                label: "Action",
                onClick: () => {
                  window.alert("You clicked an action")
                },
              },
              description: "Toast Description",
              label: "Toast Label",
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
