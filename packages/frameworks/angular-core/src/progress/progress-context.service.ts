import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import {type ProgressApi} from "@qualcomm-ui/core/progress"

@Injectable()
export class ProgressContextService extends BaseApiContextService<ProgressApi> {}

export const [
  PROGRESS_CONTEXT,
  useProgressContext,
  provideProgressContext,
]: ApiContext<ProgressApi> = createApiContext<ProgressApi>(
  "ProgressContext",
  ProgressContextService,
)
