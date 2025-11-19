// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"

import {PaginationContextDirective} from "./pagination-context.directive"
import {PaginationNextTriggerComponent} from "./pagination-next-trigger.component"
import {PaginationPageButtonsDirective} from "./pagination-page-buttons.directive"
import {PaginationPageItemComponent} from "./pagination-page-item.component"
import {PaginationPageItemsComponent} from "./pagination-page-items.component"
import {PaginationPageMetadataDirective} from "./pagination-page-metadata.directive"
import {PaginationPageSizeLabelDirective} from "./pagination-page-size-label.directive"
import {PaginationPageSizeComponent} from "./pagination-page-size.component"
import {PaginationPrevTriggerComponent} from "./pagination-prev-trigger.component"
import {PaginationRootDirective} from "./pagination-root.directive"

@NgModule({
  declarations: [
    PaginationRootDirective,
    PaginationContextDirective,
    PaginationPageSizeComponent,
    PaginationNextTriggerComponent,
    PaginationPageItemsComponent,
    PaginationPrevTriggerComponent,
    PaginationPageMetadataDirective,
    PaginationPageItemComponent,
    PaginationPageSizeLabelDirective,
    PaginationPageButtonsDirective,
  ],
  exports: [
    PaginationRootDirective,
    PaginationPageSizeComponent,
    PaginationNextTriggerComponent,
    PaginationContextDirective,
    PaginationPageItemsComponent,
    PaginationPrevTriggerComponent,
    PaginationPageMetadataDirective,
    PaginationPageItemComponent,
    PaginationPageSizeLabelDirective,
    PaginationPageButtonsDirective,
  ],
  imports: [FormsModule, IconDirective, MenuModule, PortalDirective],
})
export class PaginationModule {}
