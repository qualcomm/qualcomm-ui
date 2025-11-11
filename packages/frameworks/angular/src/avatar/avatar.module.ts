// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
