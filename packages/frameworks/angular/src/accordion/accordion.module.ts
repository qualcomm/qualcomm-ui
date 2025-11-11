// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {CommonModule} from "@angular/common"
import {NgModule} from "@angular/core"

import {CollapsibleModule} from "@qualcomm-ui/angular/collapsible"
import {DividerDirective} from "@qualcomm-ui/angular/divider"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {AccordionItemContentAnimatorComponent} from "./accordion-item-content-animator.component"
import {AccordionItemContentBodyComponent} from "./accordion-item-content-body.component"
import {AccordionItemContentComponent} from "./accordion-item-content.component"
import {AccordionItemIconComponent} from "./accordion-item-icon.component"
import {AccordionItemIndicatorComponent} from "./accordion-item-indicator.component"
import {AccordionItemRootComponent} from "./accordion-item-root.component"
import {AccordionItemSecondaryTextComponent} from "./accordion-item-secondary-text.component"
import {AccordionItemTextComponent} from "./accordion-item-text.component"
import {AccordionItemTriggerComponent} from "./accordion-item-trigger.component"
import {AccordionItemComponent} from "./accordion-item.component"
import {AccordionComponent} from "./accordion.component"

@NgModule({
  declarations: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionItemRootComponent,
    AccordionItemTriggerComponent,
    AccordionItemIconComponent,
    AccordionItemTextComponent,
    AccordionItemSecondaryTextComponent,
    AccordionItemIndicatorComponent,
    AccordionItemContentAnimatorComponent,
    AccordionItemContentBodyComponent,
    AccordionItemContentComponent,
  ],
  exports: [
    AccordionComponent,
    AccordionItemComponent,
    AccordionItemRootComponent,
    AccordionItemTriggerComponent,
    AccordionItemIconComponent,
    AccordionItemTextComponent,
    AccordionItemSecondaryTextComponent,
    AccordionItemIndicatorComponent,
    AccordionItemContentAnimatorComponent,
    AccordionItemContentBodyComponent,
    AccordionItemContentComponent,
  ],
  imports: [CommonModule, IconDirective, DividerDirective, CollapsibleModule],
})
export class AccordionModule {}
