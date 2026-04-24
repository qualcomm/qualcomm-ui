import type {ReactElement, ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogFooterProps,
} from "@qualcomm-ui/react-core/dialog"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DialogFooterProps = CoreDialogFooterProps

export function DialogFooter({
  className,
  ...props
}: DialogFooterProps): ReactElement {
  return (
    <CoreDialog.Footer
      className={clsx("vs-dialog--footer", className)}
      {...props}
    />
  )
}
