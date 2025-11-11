// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

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

export function createQdsHeaderBarApi(
  normalize: PropNormalizer,
): QdsHeaderBarApi {
  return {
    getActionBarBindings(): QdsHeaderBarActionBarBindings {
      return normalize.element({
        className: headerBarClasses.actionBar,
      })
    },
    getAppTitleBindings(): QdsHeaderBarAppTitleBindings {
      return normalize.element({
        className: headerBarClasses.appTitle,
      })
    },
    getDividerBindings(): QdsHeaderBarDividerBindings {
      return normalize.element({
        className: headerBarClasses.divider,
      })
    },
    getLogoBindings(): QdsHeaderBarLogoBindings {
      return normalize.element({
        className: headerBarClasses.logo,
      })
    },
    getNavBindings(): QdsHeaderBarNavBindings {
      return normalize.element({
        className: headerBarClasses.nav,
      })
    },
    getNavItemBindings(
      props?: QdsHeaderBarNavItemProps,
    ): QdsHeaderBarNavItemBindings {
      return normalize.element({
        "aria-current": props?.active ? "page" : undefined,
        className: headerBarClasses.navItem,
        "data-active": booleanDataAttr(props?.active),
      })
    },
    getRootBindings(props: QdsHeaderBarRootProps): QdsHeaderBarRootBindings {
      return normalize.element({
        className: headerBarClasses.root,
        "data-size": props.size || "sm",
        "data-surface": props.surface || "primary",
      })
    },
    getWindowControlsBindings(): QdsHeaderBarWindowControlsBindings {
      return normalize.element({
        className: headerBarClasses.windowControls,
      })
    },
  }
}
