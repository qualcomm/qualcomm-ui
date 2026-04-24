import type {ReactElement, ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogHeadingProps,
} from "@qualcomm-ui/react-core/dialog"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export type DialogHeaderProps = CoreDialogHeadingProps & {
  children?: ReactNode
}

export function DialogHeader({
  children,
  className,
  ...props
}: DialogHeaderProps): ReactElement {
  return (
    <CoreDialog.Heading
      className={clsx("vs-dialog--header", className)}
      {...props}
    >
      {children}
    </CoreDialog.Heading>
  )
}
