import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsButtonApi} from "@qualcomm-ui/qds-core/button"

@Injectable()
export class QdsButtonContextService extends BaseApiContextService<QdsButtonApi> {}

export const [
  QDS_BUTTON_CONTEXT,
  useQdsButtonContext,
  provideQdsButtonContext,
]: ApiContext<QdsButtonApi> = createApiContext<QdsButtonApi>(
  "QdsButtonContext",
  QdsButtonContextService,
)
