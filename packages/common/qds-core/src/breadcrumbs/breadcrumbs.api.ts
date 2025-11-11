// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {breadcrumbsClasses} from "./breadcrumbs.classes"
import type {
  QdsBreadcrumbsApi,
  QdsBreadcrumbsApiProps,
  QdsBreadcrumbsItemBindings,
  QdsBreadcrumbsItemIconBindings,
  QdsBreadcrumbsItemSeparatorBindings,
  QdsBreadcrumbsItemTriggerBindings,
  QdsBreadcrumbsListBindings,
  QdsBreadcrumbsRootBindings,
} from "./breadcrumbs.types"

export function createQdsBreadcrumbsApi(
  props: Explicit<QdsBreadcrumbsApiProps>,
  normalize: PropNormalizer,
): QdsBreadcrumbsApi {
  const size = props.size || "md"
  const emphasis = props.emphasis || "primary"

  return {
    emphasis,
    size,

    // group: bindings
    getItemBindings(params): QdsBreadcrumbsItemBindings {
      return normalize.element({
        className: breadcrumbsClasses.item,
        "data-disabled": booleanDataAttr(params.disabled),
      })
    },
    getItemIconBindings(): QdsBreadcrumbsItemIconBindings {
      return normalize.element({
        className: breadcrumbsClasses.itemIcon,
        "data-emphasis": emphasis,
        "data-size": size,
      })
    },
    getItemSeparatorBindings(): QdsBreadcrumbsItemSeparatorBindings {
      return normalize.element({
        "aria-hidden": true,
        className: breadcrumbsClasses.separator,
        "data-size": size,
      })
    },
    getItemTriggerBindings(): QdsBreadcrumbsItemTriggerBindings {
      return normalize.button({
        className: breadcrumbsClasses.itemTrigger,
        "data-emphasis": emphasis,
        "data-size": size,
      })
    },
    getListBindings(): QdsBreadcrumbsListBindings {
      return normalize.element({
        className: breadcrumbsClasses.list,
      })
    },
    getRootBindings(): QdsBreadcrumbsRootBindings {
      return normalize.element({
        className: breadcrumbsClasses.root,
        "data-size": size,
      })
    },
  }
}
