import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {
  InputEndIconComponent,
  InputStartIconComponent,
} from "@qualcomm-ui/angular/input"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {NumberInputControlDirective} from "./number-input-control.directive"
import {NumberInputDecrementTriggerDirective} from "./number-input-decrement-trigger.directive"
import {NumberInputErrorIndicatorDirective} from "./number-input-error-indicator.directive"
import {NumberInputErrorTextDirective} from "./number-input-error-text.directive"
import {NumberInputHintDirective} from "./number-input-hint.directive"
import {NumberInputIncrementTriggerDirective} from "./number-input-increment-trigger.directive"
import {NumberInputInputGroupDirective} from "./number-input-input-group.directive"
import {NumberInputInputDirective} from "./number-input-input.directive"
import {NumberInputLabelDirective} from "./number-input-label.directive"
import {NumberInputRootDirective} from "./number-input-root.directive"
import {NumberInputComponent} from "./number-input.component"

@NgModule({
  declarations: [
    NumberInputControlDirective,
    NumberInputErrorTextDirective,
    NumberInputHintDirective,
    NumberInputInputDirective,
    NumberInputInputGroupDirective,
    NumberInputLabelDirective,
    NumberInputErrorIndicatorDirective,
    NumberInputRootDirective,
    NumberInputDecrementTriggerDirective,
    NumberInputIncrementTriggerDirective,
    NumberInputComponent,
  ],
  exports: [
    NumberInputControlDirective,
    NumberInputErrorTextDirective,
    NumberInputHintDirective,
    NumberInputInputDirective,
    NumberInputInputGroupDirective,
    NumberInputLabelDirective,
    NumberInputErrorIndicatorDirective,
    NumberInputRootDirective,
    NumberInputDecrementTriggerDirective,
    NumberInputIncrementTriggerDirective,
    NumberInputComponent,
  ],
  imports: [
    QBindDirective,
    IconDirective,
    InputStartIconComponent,
    InputEndIconComponent,
  ],
})
export class NumberInputModule {}
