import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"

export function ButtonDemo1(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {/* preview */}
      <div className="bg-persistent-black flex gap-8 rounded-md p-3">
        <Button emphasis="white-persistent" variant="fill">
          Action
        </Button>
        <Button emphasis="white-persistent" variant="outline">
          Action
        </Button>
        <Button emphasis="white-persistent" variant="ghost">
          Action
        </Button>
      </div>

      <div className="bg-persistent-white flex gap-8 rounded-md p-3">
        <Button emphasis="black-persistent" variant="fill">
          Action
        </Button>
        <Button emphasis="black-persistent" variant="outline">
          Action
        </Button>
        <Button emphasis="black-persistent" variant="ghost">
          Action
        </Button>
      </div>
      {/* preview */}
    </div>
  )
}
