// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {TagDirective} from "@qualcomm-ui/angular/tag"

import {DatePickerActionsDirective} from "./date-picker-actions.directive"
import {DatePickerCancelTriggerDirective} from "./date-picker-cancel-trigger.component"
import {DatePickerClearTriggerDirective} from "./date-picker-clear-trigger.directive"
import {DatePickerContentDirective} from "./date-picker-content.directive"
import {DatePickerContextDirective} from "./date-picker-context.directive"
import {DatePickerControlDirective} from "./date-picker-control.directive"
import {DatePickerDayGridHeaderDirective} from "./date-picker-day-grid-header.component"
import {DatePickerDayGridDirective} from "./date-picker-day-grid.component"
import {DatePickerErrorIndicatorDirective} from "./date-picker-error-indicator.component"
import {DatePickerErrorTextDirective} from "./date-picker-error-text.directive"
import {DatePickerHeadlineLabelDirective} from "./date-picker-headline-label.component"
import {DatePickerHeadlineValueDirective} from "./date-picker-headline-value.component"
import {DatePickerHeadlineDirective} from "./date-picker-headline.directive"
import {DatePickerHintDirective} from "./date-picker-hint.directive"
import {DatePickerInputClearTriggerDirective} from "./date-picker-input-clear-trigger.component"
import {DatePickerInputGroupTriggerDirective} from "./date-picker-input-group-trigger.directive"
import {DatePickerInputGroupDirective} from "./date-picker-input-group.component"
import {DatePickerInputTriggerDirective} from "./date-picker-input-trigger.component"
import {DatePickerInputDirective} from "./date-picker-input.directive"
import {DatePickerLabelDirective} from "./date-picker-label.directive"
import {DatePickerMonthGridDirective} from "./date-picker-month-grid.component"
import {DatePickerMonthTextDirective} from "./date-picker-month-text.component"
import {DatePickerNextTriggerDirective} from "./date-picker-next-trigger.component"
import {DatePickerOkTriggerDirective} from "./date-picker-ok-trigger.component"
import {DatePickerPositionerDirective} from "./date-picker-positioner.directive"
import {DatePickerPresetTriggerDirective} from "./date-picker-preset-trigger.directive"
import {DatePickerPresetsTriggerDirective} from "./date-picker-presets-trigger.component"
import {DatePickerPresetsDirective} from "./date-picker-presets.directive"
import {DatePickerPrevTriggerDirective} from "./date-picker-prev-trigger.component"
import {DatePickerRangeTextDirective} from "./date-picker-range-text.component"
import {DatePickerRootDirective} from "./date-picker-root.directive"
import {DatePickerTableBodyDirective} from "./date-picker-table-body.directive"
import {DatePickerTableCellTriggerDirective} from "./date-picker-table-cell-trigger.directive"
import {DatePickerTableCellDirective} from "./date-picker-table-cell.directive"
import {DatePickerTableHeadDirective} from "./date-picker-table-head.directive"
import {DatePickerTableHeaderDirective} from "./date-picker-table-header.directive"
import {DatePickerTableRowDirective} from "./date-picker-table-row.directive"
import {DatePickerTableDirective} from "./date-picker-table.directive"
import {DatePickerTriggerDirective} from "./date-picker-trigger.directive"
import {DatePickerValueTagsDirective} from "./date-picker-value-tags.component"
import {DatePickerViewCloseTriggerDirective} from "./date-picker-view-close-trigger.component"
import {DatePickerViewControlDirective} from "./date-picker-view-control.directive"
import {DatePickerViewTriggerDirective} from "./date-picker-view-trigger.component"
import {DatePickerViewDirective} from "./date-picker-view.directive"
import {DatePickerYearGridDirective} from "./date-picker-year-grid.component"
import {DatePickerYearTextDirective} from "./date-picker-year-text.component"
import {DatePickerComponent} from "./date-picker.component"

const parts = [
  DatePickerComponent,
  DatePickerRootDirective,
  DatePickerActionsDirective,
  DatePickerCancelTriggerDirective,
  DatePickerClearTriggerDirective,
  DatePickerContentDirective,
  DatePickerContextDirective,
  DatePickerControlDirective,
  DatePickerDayGridDirective,
  DatePickerDayGridHeaderDirective,
  DatePickerErrorIndicatorDirective,
  DatePickerErrorTextDirective,
  DatePickerHeadlineDirective,
  DatePickerHeadlineLabelDirective,
  DatePickerHeadlineValueDirective,
  DatePickerHintDirective,
  DatePickerInputDirective,
  DatePickerInputClearTriggerDirective,
  DatePickerInputGroupDirective,
  DatePickerInputGroupTriggerDirective,
  DatePickerInputTriggerDirective,
  DatePickerLabelDirective,
  DatePickerMonthGridDirective,
  DatePickerMonthTextDirective,
  DatePickerNextTriggerDirective,
  DatePickerOkTriggerDirective,
  DatePickerPositionerDirective,
  DatePickerPresetsDirective,
  DatePickerPresetsTriggerDirective,
  DatePickerPresetTriggerDirective,
  DatePickerPrevTriggerDirective,
  DatePickerRangeTextDirective,
  DatePickerTableDirective,
  DatePickerTableBodyDirective,
  DatePickerTableCellDirective,
  DatePickerTableCellTriggerDirective,
  DatePickerTableHeadDirective,
  DatePickerTableHeaderDirective,
  DatePickerTableRowDirective,
  DatePickerTriggerDirective,
  DatePickerValueTagsDirective,
  DatePickerViewDirective,
  DatePickerViewCloseTriggerDirective,
  DatePickerViewControlDirective,
  DatePickerViewTriggerDirective,
  DatePickerYearGridDirective,
  DatePickerYearTextDirective,
]

@NgModule({
  declarations: parts,
  exports: parts,
  imports: [
    IconDirective,
    NgTemplateOutlet,
    PortalDirective,
    QBindDirective,
    TagDirective,
  ],
})
export class DatePickerModule {}
