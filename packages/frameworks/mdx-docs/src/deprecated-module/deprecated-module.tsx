import type {HTMLAttributes, ReactNode} from "react"

import {InlineNotification} from "@qualcomm-ui/react/inline-notification"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

interface DeprecatedModuleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  message?: ReactNode

  /**
   * Version that the module was deprecated in.
   */
  since: ReactNode
}

export function DeprecatedModule({
  message,
  since,
  ...props
}: DeprecatedModuleProps): ReactNode {
  const mergedProps = mergeProps(
    {className: "qui-deprecated-module__root"},
    props,
  )
  return (
    <div {...mergedProps}>
      <InlineNotification
        className="qui-deprecated-module__notification"
        description={
          <div className="qui-deprecated-module__message">
            <span>
              This module was deprecated in {since} and will be removed in a
              future release.
            </span>

            <span>{message}</span>
          </div>
        }
        emphasis="warning"
        label="Deprecated"
      />
    </div>
  )
}
