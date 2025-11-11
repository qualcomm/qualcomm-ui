import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {
  InputEndIconComponent,
  InputStartIconComponent,
} from "@qualcomm-ui/angular/input"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {TextInputClearTriggerDirective} from "./text-input-clear-trigger.directive"
import {TextInputErrorIndicatorDirective} from "./text-input-error-indicator.directive"
import {TextInputErrorTextDirective} from "./text-input-error-text.directive"
import {TextInputHintDirective} from "./text-input-hint.directive"
import {TextInputInputGroupDirective} from "./text-input-input-group.directive"
import {TextInputInputDirective} from "./text-input-input.directive"
import {TextInputLabelDirective} from "./text-input-label.directive"
import {TextInputRootDirective} from "./text-input-root.directive"
import {TextInputComponent} from "./text-input.component"

@NgModule({
  declarations: [
    TextInputComponent,
    TextInputClearTriggerDirective,
    TextInputRootDirective,
    TextInputErrorTextDirective,
    TextInputHintDirective,
    TextInputInputDirective,
    TextInputInputGroupDirective,
    TextInputLabelDirective,
    TextInputErrorIndicatorDirective,
  ],
  exports: [
    TextInputComponent,
    TextInputClearTriggerDirective,
    TextInputRootDirective,
    TextInputErrorTextDirective,
    TextInputHintDirective,
    TextInputInputDirective,
    TextInputInputGroupDirective,
    TextInputLabelDirective,
    TextInputErrorIndicatorDirective,
  ],
  imports: [
    QBindDirective,
    IconDirective,
    InputStartIconComponent,
    InputEndIconComponent,
  ],
})
export class TextInputModule {}
