// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal/index.js"
import {sideNavAnatomy} from "./side-nav.anatomy.js"
import type {
  SideNavApi,
  SideNavFilterInputBindings,
  SideNavHeaderActionBindings,
  SideNavHeaderBindings,
  SideNavHeaderLogoBindings,
  SideNavHeaderTitleBindings,
  SideNavRootBindings,
  SideNavSchema,
  SideNavTriggerBindings,
} from "./side-nav.types.js"

const parts = sideNavAnatomy.parts

export function createSideNavApi(
  machine: Machine<SideNavSchema>,
  normalize: PropNormalizer,
): SideNavApi {
  const {prop, scope, send, state} = machine

  const visible = state.matches("open") || state.matches("closing")
  const open = state.matches("open")

  const disabled = !!prop("disabled")

  return {
    disabled,
    open,
    setOpen(nextOpen) {
      const open = state.matches("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "open" : "close"})
    },
    // group: bindings
    getFilterInputBindings(): SideNavFilterInputBindings {
      return normalize.element({
        ...parts.filterInput,
        role: "treeitem",
      })
    },
    getHeaderActionBindings(): SideNavHeaderActionBindings {
      return normalize.element({
        ...parts.headerAction,
        "data-state": open ? "open" : "closed",
      })
    },
    getHeaderBindings(): SideNavHeaderBindings {
      return normalize.element({
        ...parts.header,
        "data-state": open ? "open" : "closed",
      })
    },
    getHeaderLogoBindings(): SideNavHeaderLogoBindings {
      return normalize.element({
        ...parts.headerLogo,
        hidden: !open,
      })
    },
    getHeaderTitleBindings(): SideNavHeaderTitleBindings {
      return normalize.element({
        ...parts.headerTitle,
        hidden: !open,
      })
    },
    getRootBindings(props: IdRegistrationProps): SideNavRootBindings {
      scope.ids.register("root", props.id)
      return normalize.element({
        ...parts.root,
        "data-collapsible": booleanDataAttr(disabled ? !open : true),
        "data-disabled": booleanDataAttr(disabled),
        "data-state": open ? "open" : "closed",
        id: props.id,
      })
    },
    getTriggerBindings(props): SideNavTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.element({
        ...parts.trigger,
        "aria-controls": domIds.root(scope),
        "aria-expanded": booleanAriaAttr(visible),
        "aria-label": open ? "Collapse" : "Expand",
        "data-disabled": booleanDataAttr(disabled),
        "data-state": open ? "open" : "closed",
        id: props.id,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (disabled) {
            return
          }
          send({type: open ? "close" : "open"})
        },
        role: "treeitem",
      })
    },
  }
}
