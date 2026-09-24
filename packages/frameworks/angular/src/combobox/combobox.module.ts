// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {HighlightDirective} from "@qualcomm-ui/angular-core/highlight"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TagDirective} from "@qualcomm-ui/angular/tag"

import {ComboboxClearTriggerDirective} from "./combobox-clear-trigger.directive"
import {ComboboxContentDirective} from "./combobox-content.directive"
import {ComboboxContextDirective} from "./combobox-context.directive"
import {ComboboxControlDirective} from "./combobox-control.directive"
import {ComboboxEmptyDirective} from "./combobox-empty.directive"
import {ComboboxErrorIndicatorDirective} from "./combobox-error-indicator.directive"
import {ComboboxErrorTextDirective} from "./combobox-error-text.directive"
import {ComboboxHintDirective} from "./combobox-hint.directive"
import {ComboboxIconDirective} from "./combobox-icon.directive"
import {ComboboxInputDirective} from "./combobox-input.directive"
import {ComboboxItemGroupLabelDirective} from "./combobox-item-group-label.directive"
import {ComboboxItemGroupDirective} from "./combobox-item-group.directive"
import {ComboboxItemIndicatorDirective} from "./combobox-item-indicator.directive"
import {ComboboxItemTextDirective} from "./combobox-item-text.directive"
import {ComboboxItemDirective} from "./combobox-item.directive"
import {ComboboxItemsComponent} from "./combobox-items.component"
import {ComboboxLabelDirective} from "./combobox-label.directive"
import {ComboboxPositionerDirective} from "./combobox-positioner.directive"
import {ComboboxRootDirective} from "./combobox-root.directive"
import {ComboboxTriggerDirective} from "./combobox-trigger.directive"
import {ComboboxVirtualContentDirective} from "./combobox-virtual-content.directive"
import {ComboboxVirtualItemDirective} from "./combobox-virtual-item.directive"
import {ComboboxVirtualizerDirective} from "./combobox-virtualizer.directive"
import {ComboboxComponent} from "./combobox.component"

@NgModule({
  declarations: [
    ComboboxComponent,
    ComboboxRootDirective,
    ComboboxClearTriggerDirective,
    ComboboxContentDirective,
    ComboboxContextDirective,
    ComboboxControlDirective,
    ComboboxEmptyDirective,
    ComboboxErrorIndicatorDirective,
    ComboboxErrorTextDirective,
    ComboboxHintDirective,
    ComboboxInputDirective,
    ComboboxItemDirective,
    ComboboxItemGroupDirective,
    ComboboxItemGroupLabelDirective,
    ComboboxItemIndicatorDirective,
    ComboboxItemTextDirective,
    ComboboxItemsComponent,
    ComboboxLabelDirective,
    ComboboxPositionerDirective,
    ComboboxTriggerDirective,
    ComboboxIconDirective,
    ComboboxVirtualContentDirective,
    ComboboxVirtualItemDirective,
    ComboboxVirtualizerDirective,
  ],
  exports: [
    ComboboxComponent,
    ComboboxRootDirective,
    ComboboxClearTriggerDirective,
    ComboboxContentDirective,
    ComboboxContextDirective,
    ComboboxControlDirective,
    ComboboxEmptyDirective,
    ComboboxErrorIndicatorDirective,
    ComboboxErrorTextDirective,
    ComboboxHintDirective,
    ComboboxInputDirective,
    ComboboxItemDirective,
    ComboboxItemGroupDirective,
    ComboboxItemGroupLabelDirective,
    ComboboxItemIndicatorDirective,
    ComboboxItemTextDirective,
    ComboboxItemsComponent,
    ComboboxLabelDirective,
    ComboboxPositionerDirective,
    ComboboxTriggerDirective,
    ComboboxIconDirective,
    ComboboxVirtualContentDirective,
    ComboboxVirtualItemDirective,
    ComboboxVirtualizerDirective,
  ],
  imports: [
    IconDirective,
    QBindDirective,
    TagDirective,
    PortalDirective,
    HighlightDirective,
  ],
})
export class ComboboxModule {}
