import {NgModule} from "@angular/core"

import {CheckmarkIconComponent} from "@qualcomm-ui/angular/checkmark"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {CheckboxControlComponent} from "./checkbox-control.component"
import {CheckboxErrorTextComponent} from "./checkbox-error-text.component"
import {CheckboxHiddenInputDirective} from "./checkbox-hidden-input.directive"
import {CheckboxIndicatorComponent} from "./checkbox-indicator.component"
import {CheckboxLabelDirective} from "./checkbox-label.directive"
import {CheckboxRootDirective} from "./checkbox-root.directive"
import {CheckboxComponent} from "./checkbox.component"

@NgModule({
  declarations: [
    CheckboxComponent,
    CheckboxRootDirective,
    CheckboxControlComponent,
    CheckboxLabelDirective,
    CheckboxHiddenInputDirective,
    CheckboxIndicatorComponent,
    CheckboxErrorTextComponent,
  ],
  exports: [
    CheckboxComponent,
    CheckboxRootDirective,
    CheckboxControlComponent,
    CheckboxLabelDirective,
    CheckboxHiddenInputDirective,
    CheckboxIndicatorComponent,
    CheckboxErrorTextComponent,
  ],
  imports: [QBindDirective, IconDirective, CheckmarkIconComponent],
})
export class CheckboxModule {}
