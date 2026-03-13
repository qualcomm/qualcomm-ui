// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import type {
  InputTagsApi,
  InputTagsContainerBindings,
  InputTagsInvisibleOverflowTagBindings,
  InputTagsInvisibleTagBindings,
  InputTagsInvisibleTagContainerBindings,
  InputTagsOverflowTagBindings,
  InputTagsSchema,
  InputTagsSelectionTagBindings,
  InputTagsTagBindings,
} from "./input-tags.types"
import {
  getContainerId,
  getInvisibleTagId,
  getMeasureIndicatorId,
  getTagId,
} from "./internal"

export function createInputTagsApi(
  machine: Machine<InputTagsSchema>,
  normalize: PropNormalizer,
): InputTagsApi {
  const {computed, prop, scope, send} = machine

  const dir = prop("dir")

  return {
    get empty() {
      return computed("empty")
    },

    get hasOverflow() {
      return computed("hasOverflow")
    },

    get overflowCount() {
      return computed("overflowTagCount")
    },

    get values() {
      return prop("value")
    },

    get visibleTags() {
      return computed("visibleTags")
    },

    // group: bindings
    getContainerBindings(
      props: IdRegistrationProps,
    ): InputTagsContainerBindings {
      scope.ids.register("tagContainer", props)
      return normalize.element({
        "data-empty": computed("empty"),
        "data-part": "tags-container",
        "data-scope": "tags",
        dir,
        hidden: computed("empty"),
        id: getContainerId(scope),
        style: {
          "--gap": `${prop("gap")}px`,
          alignItems: "center",
          display: computed("empty") ? "none" : "flex",
          flexWrap: "nowrap",
          gap: `${prop("gap")}px`,
          minWidth: "max-content",
          position: "relative",
        },
      })
    },

    getInvisibleOverflowTagBindings(): InputTagsInvisibleOverflowTagBindings {
      return normalize.element({
        "aria-hidden": true,
        "data-open": booleanDataAttr(prop("open")),
        "data-part": "invisible-overflow-tag",
        "data-scope": "tags",
        dir,
        id: getMeasureIndicatorId(scope),
        style: {
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
        },
      })
    },

    getInvisibleTagBindings(value): InputTagsInvisibleTagBindings {
      return normalize.element({
        "data-part": "invisible-tag",
        "data-scope": "tags",
        "data-value": value,
        dir,
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
      scope.ids.register("invisibleTagContainer", props)
      return normalize.element({
        "data-part": "invisible-tag-container",
        "data-scope": "tags",
        dir,
        id: scope.ids.get("invisibleTagContainer"),
        style: {
          position: "relative",
        },
      })
    },

    getOverflowTagBindings(): InputTagsOverflowTagBindings {
      const hasOverflow = computed("hasOverflow")
      return normalize.element({
        "data-part": "overflow-tag",
        "data-scope": "tags",
        "data-state": hasOverflow ? "visible" : "hidden",
        dir,
        hidden: !hasOverflow || computed("showSelectionCount"),
        style: {
          flexShrink: 0,
          whiteSpace: "nowrap",
        },
      })
    },
    getSelectionTagBindings(): InputTagsSelectionTagBindings {
      return normalize.element({
        "data-part": "selection-tag",
        "data-scope": "tags",
        dir,
        hidden: !computed("showSelectionCount"),
        onClick: (event) => {
          event.preventDefault()
          event.stopPropagation()
          prop("setOpen")?.(true)
        },
      })
    },
    getTagBindings(value): InputTagsTagBindings {
      const values = prop("value")
      const visibleTags = computed("visibleTags")
      const isVisible = visibleTags.includes(value)
      return normalize.element({
        "data-part": "tag",
        "data-scope": "tags",
        "data-value": value,
        dir,
        hidden:
          (!isVisible && values.includes(value)) ||
          computed("showSelectionCount"),
        id: getTagId(scope, value),
        onDismiss: () => {
          send({type: "TAG.DISMISS", value})
        },
        style: {
          whiteSpace: "nowrap",
        },
      })
    },
  }
}
