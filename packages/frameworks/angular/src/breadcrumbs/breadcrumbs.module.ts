// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {MenuModule} from "@qualcomm-ui/angular/menu"

import {BreadcrumbItemIconDirective} from "./breadcrumb-item-icon.directive"
import {BreadcrumbItemSeparatorDirective} from "./breadcrumb-item-separator.directive"
import {BreadcrumbItemTriggerDirective} from "./breadcrumb-item-trigger.directive"
import {BreadcrumbItemDirective} from "./breadcrumb-item.directive"
import {BreadcrumbOverflowItemComponent} from "./breadcrumb-overflow-item.component"
import {BreadcrumbOverflowTriggerDirective} from "./breadcrumb-overflow-trigger.directive"
import {BreadcrumbsListDirective} from "./breadcrumbs-list.directive"
import {BreadcrumbsRootDirective} from "./breadcrumbs-root.directive"

@NgModule({
  declarations: [
    BreadcrumbsRootDirective,
    BreadcrumbItemDirective,
    BreadcrumbItemIconDirective,
    BreadcrumbItemTriggerDirective,
    BreadcrumbItemSeparatorDirective,
    BreadcrumbOverflowItemComponent,
    BreadcrumbOverflowTriggerDirective,
    BreadcrumbsListDirective,
  ],
  exports: [
    BreadcrumbsRootDirective,
    BreadcrumbItemDirective,
    BreadcrumbItemIconDirective,
    BreadcrumbItemTriggerDirective,
    BreadcrumbItemSeparatorDirective,
    BreadcrumbOverflowItemComponent,
    BreadcrumbOverflowTriggerDirective,
    BreadcrumbsListDirective,
  ],
  imports: [IconDirective, MenuModule, NgTemplateOutlet, PortalDirective],
})
export class BreadcrumbsModule {}
