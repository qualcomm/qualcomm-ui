import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsRadioApi} from "@qualcomm-ui/qds-core/radio"

@Injectable()
export class QdsRadioContextService extends BaseApiContextService<QdsRadioApi> {}

export const [
  QDS_RADIO_CONTEXT,
  useQdsRadioContext,
  provideQdsRadioContext,
]: ApiContext<QdsRadioApi> = createApiContext<QdsRadioApi>(
  "QdsRadioContext",
  QdsRadioContextService,
)
