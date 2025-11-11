import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsProgressRingApi} from "@qualcomm-ui/qds-core/progress-ring"

@Injectable()
export class QdsProgressRingContextService extends BaseApiContextService<QdsProgressRingApi> {}

export const [
  QDS_PROGRESS_RING_CONTEXT,
  useQdsProgressRingContext,
  provideQdsProgressRingContext,
]: ApiContext<QdsProgressRingApi> = createApiContext<QdsProgressRingApi>(
  "QdsProgressRingContext",
  QdsProgressRingContextService,
)
