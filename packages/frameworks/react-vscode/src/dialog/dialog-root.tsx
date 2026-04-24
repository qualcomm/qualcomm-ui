import type {ReactElement, ReactNode} from "react"

import {
  CoreDialog,
  type CoreDialogRootProps,
} from "@qualcomm-ui/react-core/dialog"

/**
 * @public
 */
export type DialogRootProps = Omit<CoreDialogRootProps, "children"> & {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * Groups all parts of the dialog. Doesn't render its own HTML element.
 */
export function DialogRoot({
  children,
  ...props
}: DialogRootProps): ReactElement {
  return <CoreDialog.Root {...props}>{children}</CoreDialog.Root>
}
