import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal"
import type {
  SegmentedControlApi,
  SegmentedControlSchema,
} from "./segmented-control.types"

export function createSegmentedControlApi(
  machine: Machine<SegmentedControlSchema>,
  normalize: PropNormalizer,
): SegmentedControlApi {
  const {computed, context, prop, scope, send} = machine

  const groupDisabled = computed("disabled")

  function getName() {
    return prop("name") || domIds.root(scope)
  }

  function handleChange(itemValue: string, checked: boolean) {
    send({checked, itemValue, type: "CONTEXT.SET"})
  }

  return {
    defaultValue: prop("defaultValue"),
    dir: prop("dir"),
    disabled: groupDisabled,
    getName,
    handleChange,
    value: context.get("value"),

    // group: prop getters
    getGroupBindings(props) {
      scope.ids.register("root", props)
      return normalize.element({
        "aria-orientation": prop("orientation"),
        "data-disabled": booleanDataAttr(groupDisabled),
        "data-orientation": prop("orientation"),
        "data-part": "group",
        "data-scope": "segmented-control",
        dir: prop("dir"),
        id: props.id,
      })
    },
    getItemBindings({id}) {
      return normalize.element({
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (event.key === "Enter") {
            event.preventDefault()
            send({sourceId: id, type: "SELECT"})
          }
        },
      })
    },
  }
}
