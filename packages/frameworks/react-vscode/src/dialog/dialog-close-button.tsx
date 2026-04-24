import type {ReactElement} from "react"

import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import type {ElementRenderProp, IdProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {type Codicon, Icon} from "../icon"

/**
 * @public
 */
export interface DialogCloseButtonProps
  extends IdProp, ElementRenderProp<"button"> {
  /**
   * @default 'close'
   */
  icon?: Codicon
}

/**
 * A button that closes the dialog. Renders a `<button>` element by default.
 */
export function DialogCloseButton({
  icon,
  ...props
}: DialogCloseButtonProps): ReactElement {
  return (
    <CoreDialog.CloseTrigger>
      {(bindings) => {
        const mergedProps = mergeProps(
          {className: "vs-dialog__close-button"},
          bindings,
          props,
        )
        return (
          <Icon icon={icon || "close"} render={<button />} {...mergedProps} />
        )
      }}
    </CoreDialog.CloseTrigger>
  )
}
