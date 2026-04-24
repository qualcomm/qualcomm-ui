import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogHeadingProps,
} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export interface DialogHeadingProps extends CoreDialogHeadingProps {}

/**
 * A heading that labels the dialog. Renders an `<h2>` element by default.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Heading>Title...</Dialog.Heading>
 * </Dialog.Content>
 * ```
 */
export function DialogHeading(props: DialogHeadingProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-dialog__heading"}, props)

  return <CoreDialog.Heading {...mergedProps} />
}
