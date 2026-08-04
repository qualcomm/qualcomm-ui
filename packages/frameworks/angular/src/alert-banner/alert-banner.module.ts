// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"

import {AlertBannerActionDirective} from "./alert-banner-action.directive"
import {AlertBannerButtonDirective} from "./alert-banner-button.directive"
import {AlertBannerCloseButtonDirective} from "./alert-banner-close-button.directive"
import {AlertBannerDescriptionDirective} from "./alert-banner-description.directive"
import {AlertBannerHeadingDirective} from "./alert-banner-heading.directive"
import {AlertBannerIconDirective} from "./alert-banner-icon.directive"
import {AlertBannerRootDirective} from "./alert-banner-root.directive"
import {AlertBannerDirective} from "./alert-banner.directive"

@NgModule({
  declarations: [
    AlertBannerButtonDirective,
    AlertBannerDirective,
    AlertBannerRootDirective,
    AlertBannerActionDirective,
    AlertBannerCloseButtonDirective,
    AlertBannerDescriptionDirective,
    AlertBannerHeadingDirective,
    AlertBannerIconDirective,
  ],
  exports: [
    AlertBannerButtonDirective,
    AlertBannerDirective,
    AlertBannerRootDirective,
    AlertBannerActionDirective,
    AlertBannerCloseButtonDirective,
    AlertBannerDescriptionDirective,
    AlertBannerHeadingDirective,
    AlertBannerIconDirective,
  ],
  imports: [
    IconDirective,
    QBindDirective,
    StartIconDirective,
    EndIconDirective,
  ],
})
export class AlertBannerModule {}
