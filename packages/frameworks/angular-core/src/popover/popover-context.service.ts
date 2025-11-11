import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {PopoverApi} from "@qualcomm-ui/core/popover"

@Injectable()
export class PopoverContextService extends BaseApiContextService<PopoverApi> {}

export const [POPOVER_CONTEXT, usePopoverContext, providePopoverContext] =
  createApiContext<PopoverApi>("PopoverContext", PopoverContextService)
