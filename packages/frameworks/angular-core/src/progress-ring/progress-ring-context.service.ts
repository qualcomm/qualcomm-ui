import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ProgressApi} from "@qualcomm-ui/core/progress"

@Injectable()
export class ProgressRingContextService extends BaseApiContextService<ProgressApi> {}

export const [
  PROGRESS_RING_CONTEXT,
  useProgressRingContext,
  provideProgressRingContext,
]: ApiContext<ProgressApi> = createApiContext<ProgressApi>(
  "ProgressRingContext",
  ProgressRingContextService,
)
