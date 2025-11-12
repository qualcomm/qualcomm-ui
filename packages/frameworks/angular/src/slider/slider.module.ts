// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {CommonModule} from "@angular/common"
import {NgModule} from "@angular/core"

import {TooltipModule} from "@qualcomm-ui/angular/tooltip"

import {SliderControlDirective} from "./slider-control.directive"
import {SliderErrorTextDirective} from "./slider-error-text.directive"
import {SliderHiddenInputDirective} from "./slider-hidden-input.directive"
import {SliderHintDirective} from "./slider-hint.directive"
import {SliderLabelDirective} from "./slider-label.directive"
import {SliderMarkerGroupDirective} from "./slider-marker-group.directive"
import {SliderMarkerDirective} from "./slider-marker.directive"
import {SliderMarkersComponent} from "./slider-markers.component"
import {SliderMaxDirective} from "./slider-max.directive"
import {SliderMinDirective} from "./slider-min.directive"
import {SliderRangeDirective} from "./slider-range.directive"
import {SliderRootDirective} from "./slider-root.directive"
import {SliderThumbDirective} from "./slider-thumb.directive"
import {SliderThumbsComponent} from "./slider-thumbs.component"
import {SliderTrackDirective} from "./slider-track.directive"
import {SliderValueTextDirective} from "./slider-value-text.directive"
import {SliderComponent} from "./slider.component"

@NgModule({
  declarations: [
    SliderRootDirective,
    SliderLabelDirective,
    SliderValueTextDirective,
    SliderControlDirective,
    SliderTrackDirective,
    SliderRangeDirective,
    SliderThumbDirective,
    SliderHiddenInputDirective,
    SliderHintDirective,
    SliderMarkerGroupDirective,
    SliderMarkerDirective,
    SliderErrorTextDirective,
    SliderMinDirective,
    SliderMaxDirective,
    SliderComponent,
    SliderThumbsComponent,
    SliderMarkersComponent,
  ],
  exports: [
    SliderRootDirective,
    SliderLabelDirective,
    SliderValueTextDirective,
    SliderControlDirective,
    SliderTrackDirective,
    SliderRangeDirective,
    SliderThumbDirective,
    SliderHiddenInputDirective,
    SliderHintDirective,
    SliderMarkerGroupDirective,
    SliderMarkerDirective,
    SliderErrorTextDirective,
    SliderMinDirective,
    SliderMaxDirective,
    SliderComponent,
    SliderThumbsComponent,
    SliderMarkersComponent,
  ],
  imports: [CommonModule, TooltipModule],
})
export class SliderModule {}
