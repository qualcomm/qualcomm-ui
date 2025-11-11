import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ItemState, OptionItemProps} from "@qualcomm-ui/core/menu"

type MenuOptionItemContext = OptionItemProps & ItemState

@Injectable()
export class MenuOptionItemContextService extends BaseApiContextService<MenuOptionItemContext> {}

export const [
  MENU_OPTION_ITEM_CONTEXT,
  useMenuOptionItemContext,
  provideMenuOptionItemContext,
]: ApiContext<MenuOptionItemContext> = createApiContext<MenuOptionItemContext>(
  "MenuOptionItemContext",
  MenuOptionItemContextService,
)
