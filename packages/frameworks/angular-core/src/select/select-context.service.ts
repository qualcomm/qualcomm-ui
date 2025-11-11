import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import {
  type SelectApi,
  type SelectValueChangeDetails,
} from "@qualcomm-ui/core/select"

export interface SelectValueChangeEvent<T> extends SelectValueChangeDetails<T> {
  value: string[]
}

@Injectable()
export class SelectContextService extends BaseApiContextService<SelectApi> {}

export const [
  SELECT_CONTEXT,
  useSelectContext,
  provideSelectContext,
]: ApiContext<SelectApi> = createApiContext<SelectApi>(
  "SelectContext",
  SelectContextService,
)
