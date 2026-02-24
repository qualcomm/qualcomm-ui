// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {createTagsApi, tagsMachine} from "@qualcomm-ui/core/tags"
import {Tag} from "@qualcomm-ui/react/tag"
import {
  useComboboxContext,
  useComboboxMachineContext,
} from "@qualcomm-ui/react-core/combobox"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

export function ComboboxTags(): ReactElement | null {
  const {collection, selectValue, value} = useComboboxContext()
  const comboboxMachine = useComboboxMachineContext()

  const machine = useMachine(
    tagsMachine,
    {
      parent: {...comboboxMachine, selectValue},
    },
    {debug: true},
  )
  const tagsApi = createTagsApi(machine, normalizeProps)

  return (
    <div
      {...tagsApi.getContainerBindings({
        id: useControlledId(),
      })}
    >
      {tagsApi.values.map((item) => (
        <Tag
          key={item}
          {...tagsApi.getTagBindings(item)}
          emphasis="neutral"
          variant="dismissable"
        >
          {collection.stringifyItem(item)}
        </Tag>
      ))}
      <span {...tagsApi.getIndicatorBindings({id: useControlledId()})}>
        +{tagsApi.overflowCount}
      </span>
      <span {...tagsApi.getMeasureIndicatorBindings()}>+{value.length}</span>
    </div>
  )
}
