// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {alertBannerClasses} from "./alert-banner.classes"
import type {
  QdsAlertBannerActionBindings,
  QdsAlertBannerApi,
  QdsAlertBannerApiProps,
  QdsAlertBannerCloseButtonBindings,
  QdsAlertBannerCommonBindings,
  QdsAlertBannerDescriptionBindings,
  QdsAlertBannerHeadingBindings,
  QdsAlertBannerIconBindings,
  QdsAlertBannerRootBindings,
} from "./alert-banner.types"

export function createQdsAlertBannerApi(
  props: Explicit<QdsAlertBannerApiProps>,
  normalize: PropNormalizer,
): QdsAlertBannerApi {
  const closeButtonAriaLabel = props.closeButtonAriaLabel || "Close"
  const emphasis = props.emphasis || "info"
  const variant = props.variant || "strong"

  const closeButtonEmphasis =
    variant === "strong"
      ? emphasis === "warning"
        ? "black-persistent"
        : "inverse"
      : "neutral"

  const commonBindings: QdsAlertBannerCommonBindings = {
    "data-scope": "alert-banner",
  }

  return {
    closeButtonEmphasis,
    emphasis,
    variant,

    // group: bindings
    getActionBindings(): QdsAlertBannerActionBindings {
      return normalize.element({
        ...commonBindings,
        className: alertBannerClasses.action,
        "data-part": "action",
      })
    },

    getCloseButtonBindings(): QdsAlertBannerCloseButtonBindings {
      return normalize.element({
        ...commonBindings,
        "aria-label": closeButtonAriaLabel,
        className: alertBannerClasses.closeButton,
        "data-part": "close-button",
      })
    },

    getDescriptionBindings(): QdsAlertBannerDescriptionBindings {
      return normalize.element({
        ...commonBindings,
        className: alertBannerClasses.description,
        "data-part": "description",
      })
    },

    getHeadingBindings(): QdsAlertBannerHeadingBindings {
      return normalize.element({
        ...commonBindings,
        className: alertBannerClasses.heading,
        "data-part": "heading",
      })
    },

    getIconBindings(): QdsAlertBannerIconBindings {
      return normalize.element({
        ...commonBindings,
        className: alertBannerClasses.icon,
        "data-part": "status-icon",
      })
    },

    getRootBindings(): QdsAlertBannerRootBindings {
      return normalize.element({
        ...commonBindings,
        className: alertBannerClasses.root,
        "data-emphasis": emphasis,
        "data-part": "root",
        "data-variant": variant,
        dir: props.dir || "ltr",
        role: emphasis === "danger" ? "alert" : "status",
      })
    },
  }
}
