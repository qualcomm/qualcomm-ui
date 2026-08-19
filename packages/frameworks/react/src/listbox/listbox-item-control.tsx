import type {ReactElement} from "react"

import {
  useListboxContext,
  useListboxItemContext,
} from "@qualcomm-ui/react-core/listbox"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {Checkmark} from "@qualcomm-ui/react/checkmark"
import {ListItem} from "@qualcomm-ui/react/list-item"

import {useQdsListboxContext} from "./qds-listbox-context.js"

export interface ListboxItemControlProps extends ElementRenderProp<"div"> {}

/**
 * A selection indicator for a listbox item. Renders a `<div>` element by default.
 */
export function ListboxItemControl(
  props: ListboxItemControlProps,
): ReactElement {
  const qdsContext = useQdsListboxContext()
  const context = useListboxContext()
  const itemContext = useListboxItemContext()
  const itemState = context.getItemState(itemContext)

  return (
    <Checkmark
      checked={itemState.selected}
      iconProps={context.getItemIndicatorBindings(itemContext)}
      size={qdsContext.size}
      {...props}
      render={<ListItem.Control render={props.render} />}
    />
  )
}
