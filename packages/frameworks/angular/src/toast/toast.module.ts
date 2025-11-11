import {NgTemplateOutlet} from "@angular/common"
import {NgModule} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {IconDirective} from "@qualcomm-ui/angular/icon"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {ToastActionDirective} from "./toast-action.directive"
import {ToastCloseButtonDirective} from "./toast-close-button.directive"
import {ToastContextDirective} from "./toast-context.directive"
import {ToastDescriptionDirective} from "./toast-description.directive"
import {ToastIconDirective} from "./toast-icon.directive"
import {ToastLabelDirective} from "./toast-label.directive"
import {ToastProviderDirective} from "./toast-provider.directive"
import {ToastRootDirective} from "./toast-root.directive"
import {ToasterDirective} from "./toaster.directive"

@NgModule({
  declarations: [
    ToastRootDirective,
    ToastLabelDirective,
    ToastDescriptionDirective,
    ToastCloseButtonDirective,
    ToastProviderDirective,
    ToastIconDirective,
    ToastContextDirective,
    ToastActionDirective,
    ToasterDirective,
  ],
  exports: [
    ToastRootDirective,
    ToastLabelDirective,
    ToastDescriptionDirective,
    ToastCloseButtonDirective,
    ToastIconDirective,
    ToastContextDirective,
    ToastActionDirective,
    ToasterDirective,
  ],
  imports: [
    IconDirective,
    QBindDirective,
    NgTemplateOutlet,
    ButtonModule,
    ProgressRingModule,
  ],
})
export class ToastModule {}
