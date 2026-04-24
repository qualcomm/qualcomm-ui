import type {ReactElement} from "react"

import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {Icon} from "../icon"
import type {As} from "@qualcomm-ui/react-core/system"

/**
 * @public
 */
export interface DialogCloseButtonProps {
  className?: string
}

export function DialogCloseButton({
  className,
}: DialogCloseButtonProps): ReactElement {
  return (
    <CoreDialog.CloseTrigger>
      {(bindings) => (
        <Icon<As>
          as="button"
          className={clsx("vs-dialog--close-button", className)}
          icon="close"
          isAction
          style={{color: "var(--vscode-icon-foreground)"}}
          {...bindings}
        />
      )}
    </CoreDialog.CloseTrigger>
  )
}
