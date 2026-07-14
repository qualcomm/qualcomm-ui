// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {tourClasses} from "./tour.classes.js"
import type {QdsTourApi} from "./tour.types.js"

export function createQdsTourApi(normalize: PropNormalizer): QdsTourApi {
  return {
    getActionGroupBindings: () =>
      normalize.element({className: tourClasses.actionGroup}),
    getActionTriggerBindings: () =>
      normalize.button({className: tourClasses.actionTrigger}),
    getArrowBindings: () => normalize.element({className: tourClasses.arrow}),
    getArrowTipBindings: () =>
      normalize.element({className: tourClasses.arrowTip}),
    getBackdropBindings: () =>
      normalize.element({className: tourClasses.backdrop}),
    getCloseButtonBindings: () =>
      normalize.button({className: tourClasses.closeButton}),
    getContentBindings: () =>
      normalize.element({className: tourClasses.content}),
    getDescriptionBindings: () =>
      normalize.element({className: tourClasses.description}),
    getPositionerBindings: () =>
      normalize.element({className: tourClasses.positioner}),
    getProgressTextBindings: () =>
      normalize.element({className: tourClasses.progressText}),
    getSpotlightBindings: () =>
      normalize.element({className: tourClasses.spotlight}),
    getHeadingBindings: () =>
      normalize.element({className: tourClasses.heading}),
  }
}
