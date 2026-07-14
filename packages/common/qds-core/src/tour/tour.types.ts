// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {tourClasses} from "./tour.classes.js"

type TourClasses = typeof tourClasses

export interface QdsTourActionGroupBindings {
  className: TourClasses["actionGroup"]
}
export interface QdsTourActionTriggerBindings {
  className: TourClasses["actionTrigger"]
}
export interface QdsTourArrowBindings {
  className: TourClasses["arrow"]
}
export interface QdsTourArrowTipBindings {
  className: TourClasses["arrowTip"]
}
export interface QdsTourBackdropBindings {
  className: TourClasses["backdrop"]
}
export interface QdsTourCloseButtonBindings {
  className: TourClasses["closeButton"]
}
export interface QdsTourContentBindings {
  className: TourClasses["content"]
}
export interface QdsTourDescriptionBindings {
  className: TourClasses["description"]
}
export interface QdsTourPositionerBindings {
  className: TourClasses["positioner"]
}
export interface QdsTourProgressTextBindings {
  className: TourClasses["progressText"]
}
export interface QdsTourSpotlightBindings {
  className: TourClasses["spotlight"]
}
export interface QdsTourHeadingBindings {
  className: TourClasses["heading"]
}

export interface QdsTourApi {
  getActionGroupBindings(): QdsTourActionGroupBindings
  getActionTriggerBindings(): QdsTourActionTriggerBindings
  getArrowBindings(): QdsTourArrowBindings
  getArrowTipBindings(): QdsTourArrowTipBindings
  getBackdropBindings(): QdsTourBackdropBindings
  getCloseButtonBindings(): QdsTourCloseButtonBindings
  getContentBindings(): QdsTourContentBindings
  getDescriptionBindings(): QdsTourDescriptionBindings
  getPositionerBindings(): QdsTourPositionerBindings
  getProgressTextBindings(): QdsTourProgressTextBindings
  getSpotlightBindings(): QdsTourSpotlightBindings
  getHeadingBindings(): QdsTourHeadingBindings
}
