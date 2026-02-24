// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactElement} from "react"

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
      {tagsApi.values.map((item) => {
        const label = collection.stringifyItem(item)
        return (
          <Fragment key={item}>
            <Tag
              {...tagsApi.getTagBindings(item)}
              emphasis="neutral"
              variant="dismissable"
            >
              {label}
            </Tag>
            <Tag
              {...tagsApi.getInvisibleTagBindings(item)}
              emphasis="neutral"
              variant="dismissable"
            >
              {label}
            </Tag>
          </Fragment>
        )
      })}
      <Tag
        {...tagsApi.getIndicatorBindings({id: useControlledId()})}
        emphasis="neutral"
      >
        +{tagsApi.overflowCount}
      </Tag>
      <Tag {...tagsApi.getMeasureIndicatorBindings()} emphasis="neutral">
        +{value.length}
      </Tag>
    </div>
  )
}
