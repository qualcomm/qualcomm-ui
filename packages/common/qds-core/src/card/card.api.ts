// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {QdsLinkApiProps} from "@qualcomm-ui/qds-core/link"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {cardAnatomy} from "./card.anatomy"
import {cardClasses} from "./card.classes"
import type {
  QdsCardApi,
  QdsCardApiProps,
  QdsCardAvatarBindings,
  QdsCardBadgeBindings,
  QdsCardButtonApiProps,
  QdsCardButtonBindings,
  QdsCardContentBindings,
  QdsCardEyebrowTextBindings,
  QdsCardFooterBindings,
  QdsCardHeadingBindings,
  QdsCardHeadingTextBindings,
  QdsCardLinkApiProps,
  QdsCardLinkBindings,
  QdsCardMediaBindings,
  QdsCardMenuTriggerBindings,
  QdsCardParagraphTextBindings,
  QdsCardRootBindings,
  QdsCardSubheadingTextBindings,
} from "./card.types"

const parts = cardAnatomy.parts

export function createQdsCardApi(
  props: QdsCardApiProps,
  normalize: PropNormalizer,
): QdsCardApi {
  const size = props.size || "sm"
  const variant = props.variant || "outline"
  const alignment = props.alignment || "start"
  const interactive = props.interactive

  return {
    alignment,
    size,
    variant,

    // group: bindings
    getAvatarBindings(): QdsCardAvatarBindings {
      return normalize.element({
        ...parts.avatar,
        className: cardClasses.avatar,
        "data-size": "xl",
      })
    },
    getBadgeBindings(): QdsCardBadgeBindings {
      return normalize.element({
        ...parts.badge,
        className: cardClasses.badge,
      })
    },
    getButtonBindings(): QdsCardButtonBindings {
      return normalize.element({
        ...parts.button,
        className: cardClasses.button,
        "data-size": size === "lg" ? "md" : "sm",
      })
    },
    getContentBindings(): QdsCardContentBindings {
      return normalize.element({
        ...parts.content,
        className: cardClasses.content,
        "data-alignment": alignment,
        "data-size": size,
      })
    },
    getEyebrowTextBindings(): QdsCardEyebrowTextBindings {
      return normalize.element({
        ...parts.eyebrowText,
        className: cardClasses.eyebrowText,
        "data-size": size,
      })
    },
    getFooterBindings(): QdsCardFooterBindings {
      return normalize.element({
        ...parts.footer,
        className: cardClasses.footer,
        "data-alignment": alignment,
        "data-size": size,
      })
    },
    getHeadingBindings(): QdsCardHeadingBindings {
      return normalize.element({
        ...parts.heading,
        className: cardClasses.heading,
        "data-alignment": alignment,
        "data-size": size,
      })
    },
    getHeadingTextBindings(): QdsCardHeadingTextBindings {
      return normalize.element({
        ...parts.headingText,
        className: cardClasses.headingText,
        "data-size": size,
      })
    },
    getLinkBindings(): QdsCardLinkBindings {
      return normalize.element({
        ...parts.link,
        className: cardClasses.link,
        "data-size": size === "lg" ? "md" : size === "md" ? "sm" : "xs",
      })
    },
    getMediaBindings(props): QdsCardMediaBindings {
      return normalize.element({
        ...parts.media,
        className: cardClasses.media,
        "data-padding": props.padding || "sm",
        "data-size": size,
      })
    },
    getMenuTriggerBindings(): QdsCardMenuTriggerBindings {
      return normalize.element({
        ...parts.menuTrigger,
        className: cardClasses.menuTrigger,
        "data-size": size,
      })
    },
    getParagraphTextBindings(): QdsCardParagraphTextBindings {
      return normalize.element({
        ...parts.paragraphText,
        className: cardClasses.paragraphText,
        "data-size": size,
      })
    },
    getRootBindings(): QdsCardRootBindings {
      return normalize.element({
        ...parts.root,
        className: cardClasses.root,
        "data-alignment": alignment,
        "data-interactive": booleanDataAttr(interactive),
        "data-size": size,
        "data-variant": variant,
        dir: props.dir || "ltr",
      })
    },
    getSubheadingTextBindings(): QdsCardSubheadingTextBindings {
      return normalize.element({
        ...parts.subheadingText,
        className: cardClasses.subheadingText,
        "data-size": size,
      })
    },
  }
}

export function translateCardButtonProps(
  props: QdsCardButtonApiProps,
): QdsButtonApiProps {
  return {
    emphasis: props.variant === "primary" ? "primary" : "neutral",
    variant: props.variant === "primary" ? "fill" : "outline",
  }
}

export function translateCardLinkProps(
  props: QdsCardLinkApiProps,
): QdsLinkApiProps {
  return {
    emphasis: props.variant === "secondary" ? "neutral" : "default",
  }
}
