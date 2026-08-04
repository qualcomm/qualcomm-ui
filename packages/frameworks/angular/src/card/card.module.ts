// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"

import {CardAvatarDirective} from "./card-avatar.directive"
import {CardBadgeDirective} from "./card-badge.directive"
import {CardButtonDirective} from "./card-button.directive"
import {CardContentDirective} from "./card-content.directive"
import {CardEyebrowTextDirective} from "./card-eyebrow-text.directive"
import {CardFooterDirective} from "./card-footer.directive"
import {CardHeadingTextDirective} from "./card-heading-text.directive"
import {CardHeadingDirective} from "./card-heading.directive"
import {CardLinkDirective} from "./card-link.directive"
import {CardMediaDirective} from "./card-media.directive"
import {CardMenuTriggerDirective} from "./card-menu-trigger.directive"
import {CardParagraphTextDirective} from "./card-paragraph-text.directive"
import {CardRootDirective} from "./card-root.directive"
import {CardSubheadingTextDirective} from "./card-subheading-text.directive"

@NgModule({
  declarations: [
    CardAvatarDirective,
    CardBadgeDirective,
    CardButtonDirective,
    CardContentDirective,
    CardEyebrowTextDirective,
    CardFooterDirective,
    CardHeadingDirective,
    CardHeadingTextDirective,
    CardLinkDirective,
    CardMediaDirective,
    CardMenuTriggerDirective,
    CardParagraphTextDirective,
    CardRootDirective,
    CardSubheadingTextDirective,
  ],
  exports: [
    CardAvatarDirective,
    CardBadgeDirective,
    CardButtonDirective,
    CardContentDirective,
    CardEyebrowTextDirective,
    CardFooterDirective,
    CardHeadingDirective,
    CardHeadingTextDirective,
    CardLinkDirective,
    CardMediaDirective,
    CardMenuTriggerDirective,
    CardParagraphTextDirective,
    CardRootDirective,
    CardSubheadingTextDirective,
  ],
  imports: [EndIconDirective, IconDirective, StartIconDirective],
})
export class CardModule {}
