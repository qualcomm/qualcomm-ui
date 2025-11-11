import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"

import {ProgressBarDirective} from "./progress-bar.directive"
import {ProgressContextDirective} from "./progress-context.directive"
import {ProgressErrorTextDirective} from "./progress-error-text.directive"
import {ProgressHintDirective} from "./progress-hint.directive"
import {ProgressLabelDirective} from "./progress-label.directive"
import {ProgressRootDirective} from "./progress-root.directive"
import {ProgressTrackDirective} from "./progress-track.directive"
import {ProgressValueTextDirective} from "./progress-value-text.directive"
import {ProgressDirective} from "./progress.directive"

@NgModule({
  declarations: [
    ProgressRootDirective,
    ProgressBarDirective,
    ProgressTrackDirective,
    ProgressLabelDirective,
    ProgressValueTextDirective,
    ProgressContextDirective,
    ProgressErrorTextDirective,
    ProgressHintDirective,
    ProgressDirective,
  ],
  exports: [
    ProgressRootDirective,
    ProgressBarDirective,
    ProgressTrackDirective,
    ProgressLabelDirective,
    ProgressValueTextDirective,
    ProgressContextDirective,
    ProgressErrorTextDirective,
    ProgressHintDirective,
    ProgressDirective,
  ],
  imports: [IconDirective],
})
export class ProgressModule {}
