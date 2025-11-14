import {type ReactElement, useState} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({
  placement: "bottom-end",
})

export default function ToastPauseDemo(): ReactElement {
  const [paused, setPaused] = useState(false)
  const [shown, setShown] = useState(false)

  const show = () => {
    toaster.create({
      label: "This is a success toast",
      onStatusChange: (details) => {
        if (details.status === "visible") {
          setShown(true)
        } else if (details.status === "dismissing") {
          setShown(false)
        }
      },
      type: "success",
    })
  }

  const pause = () => {
    toaster.pause()
    setPaused(true)
  }

  const play = () => {
    toaster.resume()
    setPaused(false)
  }

  return (
    <>
      <Toaster toaster={toaster} />

      <div className="flex gap-4">
        <Button disabled={shown} onClick={show} variant="outline">
          Show Toast
        </Button>
        <Button disabled={!shown || paused} onClick={pause} variant="outline">
          Pause Toast
        </Button>
        <Button disabled={!shown || !paused} onClick={play} variant="outline">
          Play Toast
        </Button>
      </div>
    </>
  )
}
