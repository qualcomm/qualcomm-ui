import type {ReactNode} from "react"

import {Divider} from "@qualcomm-ui/react/divider"

export default function DividerValueTextDemo(): ReactNode {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-8">
      {/* preview */}
      <span className="text-neutral-primary font-body-md">Section 1</span>
      <Divider
        aria-valuenow={25}
        aria-valuetext="The value is 25"
        tabIndex={0}
      />
      <span className="text-neutral-primary font-body-md">Section 2</span>
      <Divider
        aria-valuenow={50}
        aria-valuetext="The value is 50"
        tabIndex={0}
      />
      <span className="text-neutral-primary font-body-md">Section 3</span>
      <Divider
        aria-valuenow={75}
        aria-valuetext="The value is 75"
        tabIndex={0}
      />
      <span className="text-neutral-primary font-body-md">Section 4</span>
      {/* preview */}
    </div>
  )
}
