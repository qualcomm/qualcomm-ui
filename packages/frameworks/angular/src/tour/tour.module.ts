// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {TourActionTriggerDirective} from "./tour-action-trigger.directive"
import {TourArrowTipDirective} from "./tour-arrow-tip.directive"
import {TourArrowDirective} from "./tour-arrow.directive"
import {TourBackdropDirective} from "./tour-backdrop.directive"
import {TourCloseButtonComponent} from "./tour-close-button.component"
import {TourContentDirective} from "./tour-content.directive"
import {TourContextDirective} from "./tour-context.directive"
import {TourDescriptionDirective} from "./tour-description.directive"
import {TourFloatingPortalComponent} from "./tour-floating-portal.component"
import {TourHeadingDirective} from "./tour-heading.directive"
import {TourPositionerDirective} from "./tour-positioner.directive"
import {TourProgressTextDirective} from "./tour-progress-text.directive"
import {TourRootDirective} from "./tour-root.directive"
import {TourSpotlightDirective} from "./tour-spotlight.directive"
import {TourDirective} from "./tour.directive"

const declarations = [
  TourActionTriggerDirective,
  TourArrowDirective,
  TourArrowTipDirective,
  TourBackdropDirective,
  TourCloseButtonComponent,
  TourContentDirective,
  TourContextDirective,
  TourDescriptionDirective,
  TourDirective,
  TourFloatingPortalComponent,
  TourHeadingDirective,
  TourPositionerDirective,
  TourProgressTextDirective,
  TourRootDirective,
  TourSpotlightDirective,
]

@NgModule({
  declarations,
  exports: declarations,
  imports: [IconDirective, PortalDirective, QBindDirective],
})
export class TourModule {}
