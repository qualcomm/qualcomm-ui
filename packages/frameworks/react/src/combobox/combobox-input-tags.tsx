// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Fragment, type ReactElement} from "react"

import {
  createInputTagsApi,
  type InputTagsApiProps,
  inputTagsMachine,
} from "@qualcomm-ui/core/input-tags"
import {Tag} from "@qualcomm-ui/react/tag"
import {useComboboxContext} from "@qualcomm-ui/react-core/combobox"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ComboboxTagsProps extends ElementRenderProp<"div"> {}

export function ComboboxInputTags({
  id,
  ...props
}: ComboboxTagsProps): ReactElement | null {
  const {
    collection,
    focus: focusInput,
    focused: inputFocused,
    open,
    selectValue,
    setOpen,
    value,
  } = useComboboxContext()

  const machine = useMachine(inputTagsMachine, {
    focusInput,
    inputFocused,
    onSelectValue: selectValue,
    open,
    setOpen,
    value,
  } satisfies InputTagsApiProps)
  const tagsApi = createInputTagsApi(machine, normalizeProps)

  const mergedProps = mergeProps(
    tagsApi.getContainerBindings({id: useControlledId(id)}),
    props,
  )

  return (
    <PolymorphicElement as="div" {...mergedProps}>
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
        {...tagsApi.getOverflowTagBindings({id: useControlledId()})}
        emphasis="neutral"
      >
        +{tagsApi.overflowCount}
      </Tag>
      <Tag {...tagsApi.getInvisibleOverflowTagBindings()} emphasis="neutral">
        +{value.length}
      </Tag>
      <Tag {...tagsApi.getSelectionTagBindings()} emphasis="neutral">
        Selected ({value.length})
      </Tag>
    </PolymorphicElement>
  )
}
