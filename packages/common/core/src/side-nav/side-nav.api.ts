// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal"
import type {
  SideNavApi,
  SideNavCommonBindings,
  SideNavHeaderActionBindings,
  SideNavHeaderBindings,
  SideNavHeaderLogoBindings,
  SideNavHeaderTitleBindings,
  SideNavRootBindings,
  SideNavSchema,
  SideNavTriggerBindings,
} from "./side-nav.types"

export function createSideNavApi(
  machine: Machine<SideNavSchema>,
  normalize: PropNormalizer,
): SideNavApi {
  const {prop, scope, send, state} = machine

  const commonBindings: SideNavCommonBindings = {
    "data-scope": "side-nav",
    dir: prop("dir") || "ltr",
  }

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
    getHeaderActionBindings(): SideNavHeaderActionBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "header-action",
        "data-state": open ? "open" : "closed",
      })
    },
    getHeaderBindings(): SideNavHeaderBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "header",
        "data-state": open ? "open" : "closed",
      })
    },
    getHeaderLogoBindings(): SideNavHeaderLogoBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "header-logo",
        hidden: !open,
      })
    },
    getHeaderTitleBindings(): SideNavHeaderTitleBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "header-title",
        hidden: !open,
      })
    },
    getRootBindings(props: IdRegistrationProps): SideNavRootBindings {
      scope.ids.register("root", props.id)
      return normalize.element({
        ...commonBindings,
        "data-collapsible": booleanDataAttr(disabled ? !open : true),
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "root",
        "data-state": open ? "open" : "closed",
        id: props.id,
      })
    },
    getTriggerBindings(props): SideNavTriggerBindings {
      scope.ids.register("trigger", props)
      return normalize.element({
        ...commonBindings,
        "aria-controls": domIds.root(scope),
        "aria-expanded": booleanAriaAttr(visible),
        "data-disabled": booleanDataAttr(disabled),
        "data-part": "trigger",
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
        type: "button",
      })
    },
  }
}
