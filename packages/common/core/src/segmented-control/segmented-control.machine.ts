import {trackFormControl} from "@qualcomm-ui/dom/query"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {domIds, getFirstCheckedItemValue} from "./internal"
import type {SegmentedControlSchema} from "./segmented-control.types"

export const segmentedControlMachine: MachineConfig<SegmentedControlSchema> =
  createMachine<SegmentedControlSchema>({
    actions: {
      contextSet({context, event, prop}) {
        if (!("checked" in event && "itemValue" in event)) {
          return
        }
        const {checked, itemValue} = event

        if (!prop("multiple")) {
          if (checked) {
            context.set("value", [itemValue])
          }
          return
        }

        let next = context.get("value") ?? []
        if (checked && !next.includes(itemValue)) {
          next = [...next, itemValue]
        }
        if (!checked) {
          next = next.filter((v: string) => v !== itemValue)
        }
        context.set("value", next)
      },
      selectItem({event, scope}) {
        if (!("sourceId" in event)) {
          return
        }
        const targetEl = scope.getById(event.sourceId)
        targetEl?.click()
      },
      switchSelectionMode({context, prop, scope}) {
        if (prop("multiple")) {
          return
        }
        const firstCheckedItemValue = getFirstCheckedItemValue(scope)
        if (firstCheckedItemValue) {
          context.set("value", [firstCheckedItemValue])
        }
      },
    },
    computed: {
      disabled: ({context, prop}) =>
        !!prop("disabled") || context.get("fieldsetDisabled"),
    },
    context({bindable, prop}) {
      return {
        fieldsetDisabled: bindable<boolean>(() => ({
          defaultValue: false,
        })),
        value: bindable<string[] | null | undefined>(() => ({
          defaultValue: prop("defaultValue"),
          onChange(value) {
            prop("onValueChange")?.(value)
          },
          value: prop("value"),
        })),
      }
    },
    effects: {
      trackFormControlState({context, scope}) {
        const groupEl = scope.getById(domIds.root(scope))
        return trackFormControl(groupEl, {
          onFieldsetDisabledChange(disabled) {
            context.set("fieldsetDisabled", disabled)
          },
          onFormReset() {
            context.set("value", context.initial("value"))
          },
        })
      },
    },
    ids({bindableId}) {
      return {
        root: bindableId(),
      }
    },
    initialEffects: ["trackFormControlState"],
    initialState: () => "idle",
    on: {
      "CONTEXT.SET": {
        actions: ["contextSet"],
      },
      SELECT: {
        actions: ["selectItem"],
      },
    },
    props({props}) {
      return {dir: "ltr", orientation: "horizontal", ...props}
    },
    states: {
      idle: {},
    },
    watch({action, prop, track}) {
      track([() => prop("multiple")], () => {
        action(["switchSelectionMode"])
      })
    },
  })
