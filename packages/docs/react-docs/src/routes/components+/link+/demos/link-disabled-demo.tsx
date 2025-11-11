import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {Link} from "@qualcomm-ui/react/link"

export default function LinkDisabledDemo(): ReactElement {
  return (
    // preview
    <Link disabled endIcon={ExternalLink}>
      Disabled
    </Link>
    // preview
  )
}
