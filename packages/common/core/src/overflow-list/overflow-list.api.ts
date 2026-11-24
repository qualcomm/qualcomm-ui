// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  JSX,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domIds, getItemId} from "./internal/overflow-list.dom.js"
import {overflowListAnatomy} from "./overflow-list.anatomy.js"
import type {
  OverflowListApi,
  OverflowListIndicatorBindings,
  OverflowListItemBindings,
  OverflowListRootBindings,
  OverflowListSchema,
  OverflowListTriggerBindings,
} from "./overflow-list.types.js"

const parts = overflowListAnatomy.parts

/**
 * Hidden elements stay measurable. Taking them out of flow keeps them from
 * affecting the layout, and `visibility: hidden` keeps them from being seen,
 * focused, or announced.
 */
const hiddenStyle: JSX.CSSProperties = {
  insetInlineStart: 0,
  position: "absolute",
  top: 0,
  visibility: "hidden",
}

export function createOverflowListApi(
  machine: Machine<OverflowListSchema>,
  normalize: PropNormalizer,
): OverflowListApi {
  const {computed, context, prop, scope, send} = machine

  const expanded = context.get("expanded")
  const {overflowing, visibleCount} = context.get("fit")
  const indicatorHidden = !overflowing

  function getIndicatorBindings(
    props: IdRegistrationProps,
  ): OverflowListIndicatorBindings {
    scope.ids.register("indicator", props)
    return normalize.element({
      ...parts.indicator,
      "data-hidden": booleanDataAttr(indicatorHidden),
      id: domIds.indicator(scope),
      style: indicatorHidden ? hiddenStyle : undefined,
    })
  }

  return {
    expanded,
    hiddenCount: computed("hiddenCount"),
    overflowing,
    setExpanded(value) {
      send({type: "EXPANDED.SET", value})
    },

    // group: bindings
    getIndicatorBindings,

    getItemBindings({index}): OverflowListItemBindings {
      const hidden = !expanded && overflowing && index >= visibleCount
      return normalize.element({
        ...parts.item,
        "data-hidden": booleanDataAttr(hidden),
        id: getItemId(scope, index),
        style: hidden ? hiddenStyle : undefined,
      })
    },

    getRootBindings(props): OverflowListRootBindings {
      scope.ids.register("root", props)
      return normalize.element({
        ...parts.root,
        "data-expanded": booleanDataAttr(expanded),
        "data-overflowing": booleanDataAttr(overflowing),
        dir: prop("dir"),
        id: domIds.root(scope),
        style: {position: "relative"},
      })
    },

    getTriggerBindings(props): OverflowListTriggerBindings {
      return normalize.button({
        ...getIndicatorBindings(props),
        "aria-controls": domIds.root(scope),
        "aria-expanded": booleanAriaAttr(expanded),
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "EXPANDED.TOGGLE"})
        },
        type: "button",
      })
    },
  }
}
