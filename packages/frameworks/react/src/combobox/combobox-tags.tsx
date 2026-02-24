// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {createTagsApi, tagsMachine} from "@qualcomm-ui/core/tags"
import {Tag} from "@qualcomm-ui/react/tag"
import {
  useComboboxContext,
  useComboboxMachineContext,
} from "@qualcomm-ui/react-core/combobox"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

export function ComboboxTags(): ReactElement | null {
  const {collection, multiple, selectValue, value} = useComboboxContext()
  const comboboxMachine = useComboboxMachineContext()

  const machine = useMachine(tagsMachine, {parent: comboboxMachine})
  const tagsApi = createTagsApi(machine, normalizeProps)

  const rootId = useControlledId()
  const onRootDestroy = useOnDestroy()

  return (
    <div
      {...tagsApi.getContainerBindings({id: rootId, onDestroy: onRootDestroy})}
    >
      {tagsApi.values.map((item) => (
        <Tag
          key={item}
          {...tagsApi.getTagBindings(item)}
          emphasis="neutral"
          onClick={(event) => {
            event.stopPropagation()
            selectValue(item)
          }}
          variant="dismissable"
        >
          {collection.stringifyItem(item)}
        </Tag>
      ))}
      <span {...tagsApi.getIndicatorBindings()}>+{tagsApi.overflowCount}</span>
      <span {...tagsApi.getMeasureIndicatorBindings()}>+{value.length}</span>
    </div>
  )
}
