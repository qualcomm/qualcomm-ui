import type {ReactElement, ReactNode} from "react"

import {CoreDialog, type CoreDialogBodyProps} from "@qualcomm-ui/react-core/dialog"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DialogBodyProps = CoreDialogBodyProps & {
  children?: ReactNode
}

export function DialogBody({
  children,
  className,
  ...props
}: DialogBodyProps): ReactElement {
  return (
    <CoreDialog.Body className={clsx("vs-dialog--body", className)} {...props}>
      {children}
    </CoreDialog.Body>
  )
}
