// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Explicit} from "@qualcomm-ui/utils/guard"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {alertBannerAnatomy} from "./alert-banner.anatomy"
import {alertBannerClasses} from "./alert-banner.classes"
import type {
  QdsAlertBannerActionBindings,
  QdsAlertBannerApi,
  QdsAlertBannerApiProps,
  QdsAlertBannerCloseButtonBindings,
  QdsAlertBannerDescriptionBindings,
  QdsAlertBannerHeadingBindings,
  QdsAlertBannerIconBindings,
  QdsAlertBannerRootBindings,
} from "./alert-banner.types"

const parts = alertBannerAnatomy.parts

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

  return {
    closeButtonEmphasis,
    emphasis,
    variant,

    // group: bindings
    getActionBindings(): QdsAlertBannerActionBindings {
      return normalize.element({
        ...parts.action,
        className: alertBannerClasses.action,
      })
    },

    getCloseButtonBindings(): QdsAlertBannerCloseButtonBindings {
      return normalize.element({
        ...parts.closeButton,
        "aria-label": closeButtonAriaLabel,
        className: alertBannerClasses.closeButton,
      })
    },

    getDescriptionBindings(): QdsAlertBannerDescriptionBindings {
      return normalize.element({
        ...parts.description,
        className: alertBannerClasses.description,
      })
    },

    getHeadingBindings(): QdsAlertBannerHeadingBindings {
      return normalize.element({
        ...parts.heading,
        className: alertBannerClasses.heading,
      })
    },

    getIconBindings(): QdsAlertBannerIconBindings {
      return normalize.element({
        ...parts.statusIcon,
        className: alertBannerClasses.icon,
      })
    },

    getRootBindings(): QdsAlertBannerRootBindings {
      return normalize.element({
        ...parts.root,
        className: alertBannerClasses.root,
        "data-emphasis": emphasis,
        "data-variant": variant,
        dir: props.dir || "ltr",
        role: emphasis === "danger" ? "alert" : "status",
      })
    },
  }
}
