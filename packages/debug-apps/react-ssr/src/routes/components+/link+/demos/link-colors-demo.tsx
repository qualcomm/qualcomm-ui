import type {ReactElement} from "react"

import {Link} from "@qualcomm-ui/react/link"

export default function LinkColorsDemo(): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <Link>Default</Link>
      <Link emphasis="neutral">Neutral</Link>
      {/* preview */}
    </div>
  )
}
