import type {ReactNode} from "react"

import {Divider} from "@qualcomm-ui/react/divider"

export function DividerFocusableDemo(): ReactNode {
  return (
    <div className="flex flex-col gap-4 px-8">
      {/* preview */}
      <span className="text-neutral-primary font-body-md">
        By default a divider has no tabindex value assigned and is not
        focusable.
      </span>
      <Divider />
      <span className="text-neutral-primary font-body-md">
        The following divider has a tabindex of 0, which makes it focusable.
      </span>
      <Divider aria-label="Second section" tabIndex={0} />
      <span className="text-neutral-primary font-body-md">
        The following divider has a tabindex of -1, which makes it
        programmatically focusable.
      </span>
      <Divider aria-label="Third section" tabIndex={-1} />
      <span className="text-neutral-primary font-body-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </span>
      {/* preview */}
    </div>
  )
}
