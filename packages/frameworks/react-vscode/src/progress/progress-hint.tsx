import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressHintProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ProgressHintProps extends CoreProgressHintProps {}

export function ProgressHint(props: ProgressHintProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__hint"}, props)
  return <CoreProgress.Hint {...mergedProps} />
}
