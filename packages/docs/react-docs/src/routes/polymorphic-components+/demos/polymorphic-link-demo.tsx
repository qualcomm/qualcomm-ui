import type {ReactElement} from "react"

import {ExternalLink} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

export default function PolymorphicLinkDemo(): ReactElement {
  return (
    // preview
    <Button
      endIcon={ExternalLink}
      render={<a href="https://google.com" rel="noreferrer" target="_blank" />}
      variant="outline"
    >
      Link
    </Button>
    // preview
  )
}
