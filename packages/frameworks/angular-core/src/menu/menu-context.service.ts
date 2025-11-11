import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {MenuApi} from "@qualcomm-ui/core/menu"

@Injectable()
export class MenuContextService extends BaseApiContextService<MenuApi> {}

export const [
  MENU_CONTEXT,
  useMenuContext,
  provideMenuContext,
]: ApiContext<MenuApi> = createApiContext<MenuApi>(
  "MenuContext",
  MenuContextService,
)
