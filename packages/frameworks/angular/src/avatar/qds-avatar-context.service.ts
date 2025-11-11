import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsAvatarApi} from "@qualcomm-ui/qds-core/avatar"

@Injectable()
export class QdsAvatarContextService extends BaseApiContextService<QdsAvatarApi> {}

export const [
  QDS_AVATAR_CONTEXT,
  useQdsAvatarContext,
  provideQdsAvatarContext,
]: ApiContext<QdsAvatarApi> = createApiContext<QdsAvatarApi>(
  "QdsAvatarContext",
  QdsAvatarContextService,
)
