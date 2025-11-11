import {NgModule} from "@angular/core"

import {ProgressRingBarDirective} from "./progress-ring-bar.directive"
import {ProgressRingCircleContainerDirective} from "./progress-ring-circle-container.directive"
import {ProgressRingCircleDirective} from "./progress-ring-circle.directive"
import {ProgressRingContextDirective} from "./progress-ring-context.directive"
import {ProgressRingErrorTextDirective} from "./progress-ring-error-text.directive"
import {ProgressRingLabelDirective} from "./progress-ring-label.directive"
import {ProgressRingRootDirective} from "./progress-ring-root.directive"
import {ProgressRingTrackDirective} from "./progress-ring-track.directive"
import {ProgressRingValueTextDirective} from "./progress-ring-value-text.directive"
import {ProgressRingDirective} from "./progress-ring.directive"

@NgModule({
  declarations: [
    ProgressRingDirective,
    ProgressRingRootDirective,
    ProgressRingBarDirective,
    ProgressRingCircleDirective,
    ProgressRingCircleContainerDirective,
    ProgressRingContextDirective,
    ProgressRingErrorTextDirective,
    ProgressRingLabelDirective,
    ProgressRingTrackDirective,
    ProgressRingValueTextDirective,
  ],
  exports: [
    ProgressRingDirective,
    ProgressRingRootDirective,
    ProgressRingBarDirective,
    ProgressRingCircleDirective,
    ProgressRingCircleContainerDirective,
    ProgressRingContextDirective,
    ProgressRingErrorTextDirective,
    ProgressRingLabelDirective,
    ProgressRingTrackDirective,
    ProgressRingValueTextDirective,
  ],
})
export class ProgressRingModule {}
