import type {ReactElement} from "react"

import {
  CoreProgress,
  type CoreProgressErrorTextProps,
} from "@qualcomm-ui/react-core/progress"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ProgressErrorTextProps extends CoreProgressErrorTextProps {}

export function ProgressErrorText(props: ProgressErrorTextProps): ReactElement {
  const mergedProps = mergeProps({className: "vs-progress__error-text"}, props)
  return <CoreProgress.ErrorText {...mergedProps} />
}
