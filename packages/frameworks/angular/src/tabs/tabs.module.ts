import {NgModule} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {QBindDirective} from "@qualcomm-ui/angular-core/machine"

import {TabButtonDirective} from "./tab-button.directive"
import {TabDismissButtonDirective} from "./tab-dismiss-button.directive"
import {TabRootDirective} from "./tab-root.directive"
import {TabsContextDirective} from "./tabs-context.directive"
import {TabsIndicatorDirective} from "./tabs-indicator.directive"
import {TabsListDirective} from "./tabs-list.directive"
import {TabsPanelDirective} from "./tabs-panel.directive"
import {TabsRootDirective} from "./tabs-root.directive"

@NgModule({
  declarations: [
    TabsContextDirective,
    TabRootDirective,
    TabButtonDirective,
    TabDismissButtonDirective,
    TabsIndicatorDirective,
    TabsPanelDirective,
    TabsListDirective,
    TabsRootDirective,
  ],
  exports: [
    TabsContextDirective,
    TabRootDirective,
    TabButtonDirective,
    TabDismissButtonDirective,
    TabsIndicatorDirective,
    TabsPanelDirective,
    TabsListDirective,
    TabsRootDirective,
  ],
  imports: [IconDirective, QBindDirective],
})
export class TabsModule {}
