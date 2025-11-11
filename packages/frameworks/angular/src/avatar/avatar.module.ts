import {NgModule} from "@angular/core"

import {AvatarContentDirective} from "./avatar-content.directive"
import {AvatarImageDirective} from "./avatar-image.directive"
import {AvatarStatusDirective} from "./avatar-status.directive"
import {AvatarDirective} from "./avatar.directive"

@NgModule({
  declarations: [
    AvatarDirective,
    AvatarContentDirective,
    AvatarImageDirective,
    AvatarStatusDirective,
  ],
  exports: [
    AvatarDirective,
    AvatarContentDirective,
    AvatarImageDirective,
    AvatarStatusDirective,
  ],
})
export class AvatarModule {}
