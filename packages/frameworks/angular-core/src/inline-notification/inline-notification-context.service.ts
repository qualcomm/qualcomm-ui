import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {InlineNotificationApi} from "@qualcomm-ui/core/inline-notification"

@Injectable()
export class InlineNotificationContextService extends BaseApiContextService<InlineNotificationApi> {}

export const [
  INLINE_NOTIFICATION_CONTEXT,
  useInlineNotificationContext,
  provideInlineNotificationContext,
]: ApiContext<InlineNotificationApi> = createApiContext<InlineNotificationApi>(
  "InlineNotificationContext",
  InlineNotificationContextService,
)
