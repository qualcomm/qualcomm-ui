import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {InlineNotificationActionDirective} from "./inline-notification-action.directive"
import {InlineNotificationCloseButtonDirective} from "./inline-notification-close-button.directive"
import {InlineNotificationDescriptionDirective} from "./inline-notification-description.directive"
import {InlineNotificationIconDirective} from "./inline-notification-icon.directive"
import {InlineNotificationLabelDirective} from "./inline-notification-label.directive"
import {InlineNotificationRootDirective} from "./inline-notification-root.directive"
import {InlineNotificationDirective} from "./inline-notification.directive"

@NgModule({
  declarations: [
    InlineNotificationDirective,
    InlineNotificationRootDirective,
    InlineNotificationActionDirective,
    InlineNotificationCloseButtonDirective,
    InlineNotificationDescriptionDirective,
    InlineNotificationIconDirective,
    InlineNotificationLabelDirective,
  ],
  exports: [
    InlineNotificationDirective,
    InlineNotificationRootDirective,
    InlineNotificationActionDirective,
    InlineNotificationCloseButtonDirective,
    InlineNotificationDescriptionDirective,
    InlineNotificationIconDirective,
    InlineNotificationLabelDirective,
  ],
  imports: [IconDirective, QBindDirective, ProgressRingModule],
})
export class InlineNotificationModule {}
