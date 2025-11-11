import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsIconButtonApi} from "@qualcomm-ui/qds-core/button"

@Injectable()
export class QdsIconButtonContextService extends BaseApiContextService<QdsIconButtonApi> {}

export const [
  QDS_ICON_BUTTON_CONTEXT,
  useQdsIconButtonContext,
  provideQdsIconButtonContext,
]: ApiContext<QdsIconButtonApi> = createApiContext<QdsIconButtonApi>(
  "QdsIconButtonContext",
  QdsIconButtonContextService,
)
