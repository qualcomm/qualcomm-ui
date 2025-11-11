import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsDialogApi} from "@qualcomm-ui/qds-core/dialog"

@Injectable()
export class QdsDialogContextService extends BaseApiContextService<QdsDialogApi> {}

export const [
  QDS_DIALOG_CONTEXT,
  useQdsDialogContext,
  provideQdsDialogContext,
]: ApiContext<QdsDialogApi> = createApiContext<QdsDialogApi>(
  "QdsDialogContext",
  QdsDialogContextService,
)
