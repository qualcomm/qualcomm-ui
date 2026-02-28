// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import type {
  InputTagsApi,
  InputTagsContainerBindings,
  InputTagsIndicatorBindings,
  InputTagsInvisibleTagBindings,
  InputTagsInvisibleTagContainerBindings,
  InputTagsMeasureIndicatorBindings,
  InputTagsSchema,
  InputTagsTagBindings,
} from "./input-tags.types"
import {
  getContainerId,
  getIndicatorId,
  getInvisibleTagId,
  getMeasureIndicatorId,
  getTagId,
} from "./internal"

export function createInputTagsApi(
  machine: Machine<InputTagsSchema>,
  normalize: PropNormalizer,
): InputTagsApi {
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
    getContainerBindings(
      props: IdRegistrationProps,
    ): InputTagsContainerBindings {
      scope.ids.register("container", props)
      return normalize.element({
        "data-empty": computed("empty"),
        "data-part": "tags-container",
        "data-scope": "tags",
        hidden: computed("empty"),
        id: getContainerId(scope),
        style: {
          alignItems: "center",
          display: computed("empty") ? "none" : "flex",
          flexWrap: "nowrap",
          gap: `${prop("gap")}px`,
          minWidth: "max-content",
          position: "relative",
        },
      })
    },

    getIndicatorBindings(): InputTagsIndicatorBindings {
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

    getInvisibleTagBindings(value): InputTagsInvisibleTagBindings {
      return normalize.element({
        "data-part": "invisible-tag",
        "data-scope": "tags",
        "data-value": value,
        id: getInvisibleTagId(scope, value),
        style: {
          minWidth: "max-content",
          position: "absolute",
          visibility: "hidden",
        },
      })
    },

    getInvisibleTagsContainerBindings(
      props: IdRegistrationProps,
    ): InputTagsInvisibleTagContainerBindings {
      scope.ids.register("invisibleTagsContainer", props)
      return normalize.element({
        "data-part": "invisible-tag-container",
        "data-scope": "tags",
        id: scope.ids.get("invisibleTagsContainer"),
        style: {
          position: "relative",
        },
      })
    },

    getMeasureIndicatorBindings(): InputTagsMeasureIndicatorBindings {
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
    getTagBindings(value): InputTagsTagBindings {
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
          whiteSpace: "nowrap",
        },
      })
    },
  }
}
