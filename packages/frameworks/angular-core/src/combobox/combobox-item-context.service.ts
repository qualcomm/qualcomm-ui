import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ComboboxItemContext} from "@qualcomm-ui/core/combobox"

@Injectable()
export class ComboboxItemContextService extends BaseApiContextService<ComboboxItemContext> {}

export const [
  COMBOBOX_ITEM_CONTEXT,
  useComboboxItemContext,
  provideComboboxItemContext,
]: ApiContext<ComboboxItemContext> = createApiContext<ComboboxItemContext>(
  "ComboboxItemContext",
  ComboboxItemContextService,
)
