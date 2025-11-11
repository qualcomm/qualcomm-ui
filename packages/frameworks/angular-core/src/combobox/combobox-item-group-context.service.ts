import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ComboboxApiItemGroupProps} from "@qualcomm-ui/core/combobox"

@Injectable()
export class ComboboxItemGroupContextService extends BaseApiContextService<ComboboxApiItemGroupProps> {}

export const [
  COMBOBOX_ITEM_GROUP_CONTEXT,
  useComboboxItemGroupContext,
  provideComboboxItemGroupContext,
]: ApiContext<ComboboxApiItemGroupProps> =
  createApiContext<ComboboxApiItemGroupProps>(
    "ComboboxItemGroupContext",
    ComboboxItemGroupContextService,
  )
