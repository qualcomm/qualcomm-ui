// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {headerBarAnatomy} from "./header-bar.anatomy"
import {headerBarClasses} from "./header-bar.classes"
import type {
  QdsHeaderBarActionBarBindings,
  QdsHeaderBarApi,
  QdsHeaderBarAppTitleBindings,
  QdsHeaderBarDividerBindings,
  QdsHeaderBarLogoBindings,
  QdsHeaderBarNavBindings,
  QdsHeaderBarNavItemBindings,
  QdsHeaderBarNavItemProps,
  QdsHeaderBarRootBindings,
  QdsHeaderBarRootProps,
  QdsHeaderBarWindowControlsBindings,
} from "./header-bar.types"

const parts = headerBarAnatomy.parts

export function createQdsHeaderBarApi(
  normalize: PropNormalizer,
): QdsHeaderBarApi {
  return {
    getActionBarBindings(): QdsHeaderBarActionBarBindings {
      return normalize.element({
        ...parts.actionBar,
        className: headerBarClasses.actionBar,
      })
    },
    getAppTitleBindings(): QdsHeaderBarAppTitleBindings {
      return normalize.element({
        ...parts.appTitle,
        className: headerBarClasses.appTitle,
      })
    },
    getDividerBindings(): QdsHeaderBarDividerBindings {
      return normalize.element({
        ...parts.divider,
        className: headerBarClasses.divider,
      })
    },
    getLogoBindings(): QdsHeaderBarLogoBindings {
      return normalize.element({
        ...parts.logo,
        className: headerBarClasses.logo,
      })
    },
    getNavBindings(): QdsHeaderBarNavBindings {
      return normalize.element({
        ...parts.nav,
        className: headerBarClasses.nav,
      })
    },
    getNavItemBindings(
      props?: QdsHeaderBarNavItemProps,
    ): QdsHeaderBarNavItemBindings {
      return normalize.element({
        ...parts.navItem,
        "aria-current": props?.active ? "page" : undefined,
        className: headerBarClasses.navItem,
        "data-active": booleanDataAttr(props?.active),
      })
    },
    getRootBindings(props: QdsHeaderBarRootProps): QdsHeaderBarRootBindings {
      return normalize.element({
        ...parts.root,
        className: headerBarClasses.root,
        "data-padding": props.padding || "default",
        "data-size": props.size || "sm",
        "data-surface": props.surface || "primary",
      })
    },
    getWindowControlsBindings(): QdsHeaderBarWindowControlsBindings {
      return normalize.element({
        ...parts.windowControls,
        className: headerBarClasses.windowControls,
      })
    },
  }
}
