// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"

import {BreadcrumbItemIconDirective} from "./breadcrumb-item-icon.directive"
import {BreadcrumbItemSeparatorDirective} from "./breadcrumb-item-separator.directive"
import {BreadcrumbItemTriggerDirective} from "./breadcrumb-item-trigger.directive"
import {BreadcrumbItemDirective} from "./breadcrumb-item.directive"
import {BreadcrumbsListDirective} from "./breadcrumbs-list.directive"
import {BreadcrumbsRootDirective} from "./breadcrumbs-root.directive"

@NgModule({
  declarations: [
    BreadcrumbsRootDirective,
    BreadcrumbItemDirective,
    BreadcrumbItemIconDirective,
    BreadcrumbItemTriggerDirective,
    BreadcrumbItemSeparatorDirective,
    BreadcrumbsListDirective,
  ],
  exports: [
    BreadcrumbsRootDirective,
    BreadcrumbItemDirective,
    BreadcrumbItemIconDirective,
    BreadcrumbItemTriggerDirective,
    BreadcrumbItemSeparatorDirective,
    BreadcrumbsListDirective,
  ],
  imports: [IconDirective],
})
export class BreadcrumbsModule {}
