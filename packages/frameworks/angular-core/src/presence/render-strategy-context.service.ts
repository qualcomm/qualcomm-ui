import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {RenderStrategyApi} from "@qualcomm-ui/core/presence"

@Injectable()
export class RenderStrategyContextService extends BaseApiContextService<RenderStrategyApi> {}

export const [
  RENDER_STRATEGY_CONTEXT,
  useRenderStrategyContext,
  provideRenderStrategyContext,
]: ApiContext<RenderStrategyApi> = createApiContext<RenderStrategyApi>(
  "RenderStrategyContext",
  RenderStrategyContextService,
)
