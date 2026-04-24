import type {ReactElement} from "react"

import {
  CoreSelect,
  type CoreSelectHiddenSelectProps,
} from "@qualcomm-ui/react-core/select"

export interface SelectHiddenSelectProps extends CoreSelectHiddenSelectProps {}

export function SelectHiddenSelect(
  props: SelectHiddenSelectProps,
): ReactElement {
  return <CoreSelect.HiddenSelect {...props} />
}
