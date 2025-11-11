import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

// preview
const topToaster = createToaster({
  placement: "top-end",
})

const bottomToaster = createToaster({
  placement: "bottom-start",
})
// preview

export default function ToastPlacementDemo(): ReactElement {
  return (
    <div className="flex gap-4">
      <Toaster toaster={topToaster} />
      <Toaster toaster={bottomToaster} />

      <Button
        onClick={() =>
          topToaster.create({
            description: "Toast Description",
            label: "Toast Label",
          })
        }
        type="button"
        variant="outline"
      >
        Show Top Toast
      </Button>

      <Button
        onClick={() =>
          bottomToaster.create({
            description: "Toast Description",
            label: "Toast Label",
          })
        }
        type="button"
        variant="outline"
      >
        Show Bottom Toast
      </Button>
    </div>
  )
}
