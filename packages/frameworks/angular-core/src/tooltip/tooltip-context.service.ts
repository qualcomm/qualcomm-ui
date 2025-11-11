import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TooltipApi} from "@qualcomm-ui/core/tooltip"

@Injectable()
export class TooltipContextService extends BaseApiContextService<TooltipApi> {}

export const [TOOLTIP_CONTEXT, useTooltipContext, provideTooltipContext] =
  createApiContext<TooltipApi>("TooltipContext", TooltipContextService)
