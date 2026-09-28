import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"

export function ButtonContrastDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {/* preview */}
      <div className="bg-persistent-black flex gap-8 rounded-md p-3">
        <Button emphasis="persistent-white" variant="fill">
          Action
        </Button>
        <Button emphasis="persistent-white" variant="outline">
          Action
        </Button>
        <Button emphasis="persistent-white" variant="ghost">
          Action
        </Button>
      </div>

      <div className="bg-persistent-white flex gap-8 rounded-md p-3">
        <Button emphasis="persistent-black" variant="fill">
          Action
        </Button>
        <Button emphasis="persistent-black" variant="outline">
          Action
        </Button>
        <Button emphasis="persistent-black" variant="ghost">
          Action
        </Button>
      </div>
      {/* preview */}
    </div>
  )
}
