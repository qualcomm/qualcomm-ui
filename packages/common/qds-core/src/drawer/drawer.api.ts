// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {drawerClasses} from "./drawer.classes"
import type {
  QdsDrawerApi,
  QdsDrawerApiProps,
  QdsDrawerContentBindings,
  QdsDrawerPositionerBindings,
} from "./drawer.types"

export function createQdsDrawerApi(
  props: Explicit<QdsDrawerApiProps>,
  normalize: PropNormalizer,
): QdsDrawerApi {
  const placement = props.placement || "end"
  const size = props.size || "sm"
  return {
    placement,
    size,

    // group: bindings
    getContentBindings(): QdsDrawerContentBindings {
      return normalize.element({
        className: drawerClasses.content,
        "data-placement": placement,
        "data-size": size,
      })
    },
    getPositionerBindings(): QdsDrawerPositionerBindings {
      return normalize.element({
        className: drawerClasses.positioner,
        "data-placement": placement,
      })
    },
  }
}
