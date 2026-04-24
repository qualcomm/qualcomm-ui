import type {ReactElement, ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogRootProps,
} from "@qualcomm-ui/react-core/dialog"

/**
 * @public
 */
export type DialogProps = Omit<CoreDialogRootProps, "children"> & {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function Dialog({children, ...props}: DialogProps): ReactElement {
  return <CoreDialog.Root {...props}>{children}</CoreDialog.Root>
}
