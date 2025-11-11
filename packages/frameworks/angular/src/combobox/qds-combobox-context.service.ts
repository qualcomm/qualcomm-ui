import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsSelectApi} from "@qualcomm-ui/qds-core/select"

@Injectable()
export class QdsComboboxContextService extends BaseApiContextService<QdsSelectApi> {}

export const [
  QDS_COMBOBOX_CONTEXT,
  useQdsComboboxContext,
  provideQdsComboboxContext,
]: ApiContext<QdsSelectApi> = createApiContext<QdsSelectApi>(
  "QdsComboboxContext",
  QdsComboboxContextService,
)
