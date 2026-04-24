import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectPositionerProps,
} from "@qualcomm-ui/react-core/select"

export interface SelectPositionerProps extends CoreSelectPositionerProps {}

export function SelectPositioner(
  props: SelectPositionerProps,
): ReactElement | null {
  return <CoreSelect.Positioner {...props} />
}
