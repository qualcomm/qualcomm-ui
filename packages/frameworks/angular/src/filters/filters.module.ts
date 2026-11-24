// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {FilterContextDirective} from "@qualcomm-ui/angular-core/filter-set"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {CheckboxModule} from "@qualcomm-ui/angular/checkbox"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"
import {RadioModule} from "@qualcomm-ui/angular/radio"
import {SelectModule} from "@qualcomm-ui/angular/select"
import {SliderModule} from "@qualcomm-ui/angular/slider"
import {TextInputModule} from "@qualcomm-ui/angular/text-input"
import {TreeModule} from "@qualcomm-ui/angular/tree"

import {CheckboxGroupFilterComponent} from "./checkbox-group-filter.component"
import {CheckboxTreeFilterComponent} from "./checkbox-tree-filter.component"
import {ComboboxFilterComponent} from "./combobox-filter.component"
import {DateFilterComponent} from "./date-filter.component"
import {FilterProviderDirective} from "./filter-provider.directive"
import {FilterSetProviderDirective} from "./filter-set-provider.directive"
import {FilterOptionLabelComponent} from "./internal/filter-option-label.component"
import {RadioGroupFilterComponent} from "./radio-group-filter.component"
import {SelectFilterComponent} from "./select-filter.component"
import {SliderFilterComponent} from "./slider-filter.component"
import {TextInputFilterComponent} from "./text-input-filter.component"

@NgModule({
  declarations: [
    CheckboxGroupFilterComponent,
    CheckboxTreeFilterComponent,
    ComboboxFilterComponent,
    DateFilterComponent,
    FilterProviderDirective,
    FilterSetProviderDirective,
    RadioGroupFilterComponent,
    SelectFilterComponent,
    SliderFilterComponent,
    TextInputFilterComponent,
  ],
  exports: [
    CheckboxGroupFilterComponent,
    CheckboxTreeFilterComponent,
    ComboboxFilterComponent,
    DateFilterComponent,
    FilterContextDirective,
    FilterProviderDirective,
    FilterSetProviderDirective,
    RadioGroupFilterComponent,
    SelectFilterComponent,
    SliderFilterComponent,
    TextInputFilterComponent,
  ],
  imports: [
    CheckboxModule,
    ComboboxModule,
    DatePickerModule,
    FilterContextDirective,
    FilterOptionLabelComponent,
    FormsModule,
    QBindDirective,
    RadioModule,
    SelectModule,
    SliderModule,
    TextInputModule,
    TreeModule,
  ],
})
export class FiltersModule {}
