import type {ReactElement} from "react"

import {Check, Copy} from "lucide-react"

import {useCopyToClipboard} from "@qualcomm-ui/mdx-docs/copy-to-clipboard"
import {Button} from "@qualcomm-ui/react/button"

export interface CopyButtonProps {
  code: string | (() => string)
}

export function CopyToClipboardButton({code}: CopyButtonProps): ReactElement {
  const {copyToClipboard, isCopied} = useCopyToClipboard({
    valueOrFn: code,
  })

  return (
    <Button
      emphasis="primary"
      endIcon={isCopied ? Check : Copy}
      onClick={(event) => {
        copyToClipboard()
        // this is a child of the QTabList so we need to prevent this event,
        // otherwise the bubbling can cause issues.
        event.preventDefault()
        event.stopPropagation()
      }}
      size="sm"
      type="button"
      variant="ghost"
    >
      Copy
    </Button>
  )
}
