// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {CollapsibleContentComponent} from "./collapsible-content.component"
import {CollapsibleRootComponent} from "./collapsible-root.component"
import {CollapsibleTriggerComponent} from "./collapsible-trigger.component"

@NgModule({
  declarations: [
    CollapsibleRootComponent,
    CollapsibleContentComponent,
    CollapsibleTriggerComponent,
  ],
  exports: [
    CollapsibleRootComponent,
    CollapsibleContentComponent,
    CollapsibleTriggerComponent,
  ],
})
export class CollapsibleModule {}
