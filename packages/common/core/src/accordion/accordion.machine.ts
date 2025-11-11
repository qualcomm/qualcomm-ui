// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import type {AccordionSchema} from "./accordion.types"
import {
  getFirstTriggerEl,
  getLastTriggerEl,
  getNextTriggerEl,
  getPrevTriggerEl,
} from "./internal"

const {and, not} = createGuards<AccordionSchema>()

const remove = <T>(arr: T[], value: T): T[] => arr.filter((v) => v !== value)
const add = <T>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr : [...arr, value]

export const accordionMachine: MachineConfig<AccordionSchema> =
  createMachine<AccordionSchema>({
    actions: {
      clearFocusedValue({context}) {
        context.set("focusedValue", null)
      },
      collapse({context, event, prop}) {
        if (!("value" in event && event.value)) {
          return
        }
        const next = prop("multiple")
          ? remove<string>(context.get("value"), event.value)
          : []
        context.set("value", next)
      },
      expand({context, event, prop}) {
        if (!("value" in event && event.value)) {
          return
        }
        const next = prop("multiple")
          ? add<string>(context.get("value"), event.value)
          : [event.value]
        context.set("value", next)
      },
      focusFirstTrigger({scope}) {
        getFirstTriggerEl(scope)?.focus()
      },
      focusLastTrigger({scope}) {
        getLastTriggerEl(scope)?.focus()
      },
      focusNextTrigger({context, scope}) {
        const focusedValue = context.get("focusedValue")
        if (!focusedValue) {
          return
        }
        const triggerEl = getNextTriggerEl(scope, focusedValue)
        triggerEl?.focus()
      },
      focusPrevTrigger({context, scope}) {
        const focusedValue = context.get("focusedValue")
        if (!focusedValue) {
          return
        }
        const triggerEl = getPrevTriggerEl(scope, focusedValue)
        triggerEl?.focus()
      },
      setFocusedValue({context, event}) {
        if (!("value" in event && event.value)) {
          return
        }
        context.set("focusedValue", event.value)
      },
      setValue({context, event}) {
        if ("values" in event && event.values) {
          context.set("value", event.values)
        }
      },
    },

    context: ({bindable, prop}) => ({
      focusedValue: bindable<string | null>(() => ({
        defaultValue: null,
        onChange(value) {
          prop("onFocusChange")?.(value)
        },
        sync: true,
      })),
      value: bindable<string[]>(() => ({
        defaultValue: prop("defaultValue"),
        onChange(value) {
          prop("onValueChange")?.(value)
        },
        value: prop("value"),
      })),
    }),

    guards: {
      canToggle: ({prop}) => !!prop("collapsible") || !!prop("multiple"),
      isExpanded: ({context, event}) => {
        if (!("value" in event && event.value)) {
          return
        }
        return context.get("value").includes(event.value)
      },
    },

    ids: ({bindableId, bindableIdCollection}) => {
      return {
        content: bindableIdCollection<string>(),
        item: bindableIdCollection<string>(),
        root: bindableId<string>(),
        trigger: bindableIdCollection<string>(),
      }
    },

    initialState: () => "idle",

    on: {
      "VALUE.SET": {
        actions: ["setValue"],
      },
    },

    props: ({props}) => ({
      collapsible: false,
      defaultValue: [],
      dir: "ltr",
      multiple: false,
      ...props,
    }),

    states: {
      focused: {
        on: {
          "GOTO.FIRST": {
            actions: ["focusFirstTrigger"],
          },
          "GOTO.LAST": {
            actions: ["focusLastTrigger"],
          },
          "GOTO.NEXT": {
            actions: ["focusNextTrigger"],
          },
          "GOTO.PREV": {
            actions: ["focusPrevTrigger"],
          },
          "TRIGGER.BLUR": {
            actions: ["clearFocusedValue"],
            target: "idle",
          },
          "TRIGGER.CLICK": [
            {
              actions: ["collapse"],
              guard: and("isExpanded", "canToggle"),
            },
            {
              actions: ["expand"],
              guard: not("isExpanded"),
            },
          ],
        },
      },
      idle: {
        on: {
          "TRIGGER.FOCUS": {
            actions: ["setFocusedValue"],
            target: "focused",
          },
        },
      },
    },
  })
