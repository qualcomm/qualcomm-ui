// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {
  getContainerId,
  getIndicatorId,
  getMeasureIndicatorId,
  getTagId,
} from "./internal"
import type {
  TagsApi,
  TagsContainerBindings,
  TagsIndicatorBindings,
  TagsMeasureIndicatorBindings,
  TagsSchema,
  TagsTagBindings,
} from "./tags.types"

export function createTagsApi(
  machine: Machine<TagsSchema>,
  normalize: PropNormalizer,
): TagsApi {
  const {computed, prop, scope} = machine

  return {
    get empty() {
      return computed("empty")
    },

    get hasOverflow() {
      return computed("hasOverflow")
    },

    get overflowCount() {
      return computed("overflowCount")
    },

    get values() {
      return computed("values")
    },

    get visibleTags() {
      return computed("visibleTags")
    },

    // group: bindings
    getContainerBindings(props: IdRegistrationProps): TagsContainerBindings {
      scope.ids.register("container", props)
      return normalize.element({
        "data-part": "tags-container",
        "data-scope": "tags",
        id: getContainerId(scope),
        style: {
          alignItems: "center",
          display: "flex",
          flexWrap: "nowrap",
          gap: `${prop("gap")}px`,
          minWidth: 0,
          overflow: "hidden",
        },
      })
    },

    getIndicatorBindings(): TagsIndicatorBindings {
      const hasOverflow = computed("hasOverflow")
      return normalize.element({
        "data-part": "tags-indicator",
        "data-scope": "tags",
        "data-state": hasOverflow ? "visible" : "hidden",
        hidden: !hasOverflow,
        id: getIndicatorId(scope),
        style: {
          flexShrink: 0,
          whiteSpace: "nowrap",
        },
      })
    },

    getMeasureIndicatorBindings(): TagsMeasureIndicatorBindings {
      return normalize.element({
        "aria-hidden": true,
        "data-part": "tags-measure-indicator",
        "data-scope": "tags",
        id: getMeasureIndicatorId(scope),
        style: {
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
        },
      })
    },

    getTagBindings(value): TagsTagBindings {
      const values = computed("values")
      const visibleTags = computed("visibleTags")
      const isVisible = visibleTags.includes(value)
      return normalize.element({
        "data-part": "tag",
        "data-scope": "tags",
        "data-value": value,
        hidden: !isVisible && values.includes(value),
        id: getTagId(scope, value),
        onClick: () => {
          const parent = prop("parent")
          parent?.selectValue(value)
        },
        style: {
          flexShrink: 0,
        },
      })
    },
  }
}
