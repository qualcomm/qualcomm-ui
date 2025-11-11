import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsMenuApi} from "@qualcomm-ui/qds-core/menu"

@Injectable()
export class QdsMenuContextService extends BaseApiContextService<QdsMenuApi> {}

export const [
  QDS_MENU_CONTEXT,
  useQdsMenuContext,
  provideQdsMenuContext,
]: ApiContext<QdsMenuApi> = createApiContext<QdsMenuApi>(
  "QdsMenuContext",
  QdsMenuContextService,
)
