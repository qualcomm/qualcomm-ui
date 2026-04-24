import type {ReactElement, ReactNode} from "react"

import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export interface DialogContentProps {
  children?: ReactNode
  className?: string

  /**
   * If `true`, the backdrop overlay is hidden.
   */
  hideBackdrop?: boolean
}

export function DialogContent({
  children,
  className,
  hideBackdrop,
}: DialogContentProps): ReactElement | null {
  return (
    <Portal>
      <CoreDialog.Backdrop
        className={clsx("vs-dialog--backdrop", {
          "state-hidden": hideBackdrop,
        })}
      />
      <CoreDialog.Positioner>
        <CoreDialog.Content className={clsx("vs-dialog", className)}>
          <div className="vs-dialog--content">{children}</div>
        </CoreDialog.Content>
      </CoreDialog.Positioner>
    </Portal>
  )
}
