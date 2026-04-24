import type {ReactElement} from "react"

import {
  CoreDialog,
  type CoreDialogTriggerProps,
} from "@qualcomm-ui/react-core/dialog"

/**
 * @public
 */
export type DialogTriggerProps = CoreDialogTriggerProps

export function DialogTrigger(props: DialogTriggerProps): ReactElement {
  return <CoreDialog.Trigger {...props} />
}
