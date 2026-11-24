// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"

import {FilterPanelApplyButtonComponent} from "./filter-panel-apply-button.component"
import {FilterPanelClearButtonComponent} from "./filter-panel-clear-button.component"
import {FilterPanelCloseButtonComponent} from "./filter-panel-close-button.component"
import {FilterPanelCountComponent} from "./filter-panel-count.component"
import {FilterPanelFilterContentDirective} from "./filter-panel-filter-content.directive"
import {FilterPanelFilterCountComponent} from "./filter-panel-filter-count.component"
import {FilterPanelFilterIndicatorComponent} from "./filter-panel-filter-indicator.component"
import {FilterPanelFilterLabelComponent} from "./filter-panel-filter-label.component"
import {FilterPanelFilterRootDirective} from "./filter-panel-filter-root.directive"
import {FilterPanelFilterTriggerComponent} from "./filter-panel-filter-trigger.component"
import {FilterPanelFilterComponent} from "./filter-panel-filter.component"
import {FilterPanelFooterDirective} from "./filter-panel-footer.directive"
import {FilterPanelHeaderDirective} from "./filter-panel-header.directive"
import {FilterPanelHeadingComponent} from "./filter-panel-heading.component"
import {FilterPanelRootProviderDirective} from "./filter-panel-root-provider.directive"
import {FilterPanelRootDirective} from "./filter-panel-root.directive"
import {FilterPanelSectionDirective} from "./filter-panel-section.directive"

@NgModule({
  declarations: [
    FilterPanelApplyButtonComponent,
    FilterPanelClearButtonComponent,
    FilterPanelCloseButtonComponent,
    FilterPanelCountComponent,
    FilterPanelFilterComponent,
    FilterPanelFilterContentDirective,
    FilterPanelFilterCountComponent,
    FilterPanelFilterIndicatorComponent,
    FilterPanelFilterLabelComponent,
    FilterPanelFilterRootDirective,
    FilterPanelFilterTriggerComponent,
    FilterPanelFooterDirective,
    FilterPanelHeaderDirective,
    FilterPanelHeadingComponent,
    FilterPanelRootDirective,
    FilterPanelRootProviderDirective,
    FilterPanelSectionDirective,
  ],
  exports: [
    FilterPanelApplyButtonComponent,
    FilterPanelClearButtonComponent,
    FilterPanelCloseButtonComponent,
    FilterPanelCountComponent,
    FilterPanelFilterComponent,
    FilterPanelFilterContentDirective,
    FilterPanelFilterCountComponent,
    FilterPanelFilterIndicatorComponent,
    FilterPanelFilterLabelComponent,
    FilterPanelFilterRootDirective,
    FilterPanelFilterTriggerComponent,
    FilterPanelFooterDirective,
    FilterPanelHeaderDirective,
    FilterPanelHeadingComponent,
    FilterPanelRootDirective,
    FilterPanelRootProviderDirective,
    FilterPanelSectionDirective,
  ],
  imports: [
    EndIconDirective,
    IconDirective,
    QBindDirective,
    StartIconDirective,
  ],
})
export class FilterPanelModule {}
