import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsTagApi} from "@qualcomm-ui/qds-core/tag"

@Injectable()
export class QdsTagContextService extends BaseApiContextService<QdsTagApi> {}

export const [
  QDS_TAG_CONTEXT,
  useQdsTagContext,
  provideQdsTagContext,
]: ApiContext<QdsTagApi> = createApiContext<QdsTagApi>(
  "QdsTagContext",
  QdsTagContextService,
)
