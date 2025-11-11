import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {RadioApi} from "@qualcomm-ui/core/radio"

@Injectable()
export class RadioContextService extends BaseApiContextService<RadioApi> {}

export const [
  RADIO_CONTEXT,
  useRadioContext,
  provideRadioContext,
]: ApiContext<RadioApi> = createApiContext<RadioApi>(
  "RadioContext",
  RadioContextService,
)
