import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ItemProps, ItemState} from "@qualcomm-ui/core/menu"

type MenuItemContext = ItemProps & ItemState

@Injectable()
export class MenuItemContextService extends BaseApiContextService<MenuItemContext> {}

export const [
  MENU_ITEM_CONTEXT,
  useMenuItemContext,
  provideMenuItemContext,
]: ApiContext<MenuItemContext> = createApiContext<MenuItemContext>(
  "MenuItemContext",
  MenuItemContextService,
)
