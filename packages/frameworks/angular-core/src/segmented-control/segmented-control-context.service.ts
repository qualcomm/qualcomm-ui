import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {SegmentedControlApi} from "@qualcomm-ui/core/segmented-control"

@Injectable()
export class SegmentedControlContextService extends BaseApiContextService<SegmentedControlApi> {}

export const [
  SEGMENTED_CONTROL_CONTEXT,
  useSegmentedControlContext,
  provideSegmentedControlContext,
] = createApiContext<SegmentedControlApi>(
  "SegmentedControlContext",
  SegmentedControlContextService,
)
