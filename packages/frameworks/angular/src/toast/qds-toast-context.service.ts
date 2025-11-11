import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsToastApi} from "@qualcomm-ui/qds-core/toast"

@Injectable()
export class QdsToastContextService extends BaseApiContextService<QdsToastApi> {}

export const [
  QDS_TOAST_CONTEXT,
  useQdsToastContext,
  provideQdsToastContext,
]: ApiContext<QdsToastApi> = createApiContext<QdsToastApi>(
  "QdsToastContext",
  QdsToastContextService,
)
