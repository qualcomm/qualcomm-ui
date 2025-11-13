// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgTemplateOutlet} from "@angular/common"
import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  type OnInit,
} from "@angular/core"

import {IconDirective} from "@qualcomm-ui/angular/icon"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  QBindDirective,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  createQdsBadgeApi,
  type QdsBadgeApiProps,
  type QdsBadgeBasicSize,
  type QdsBadgeCountVariant,
  type QdsBadgeExtendedSize,
  type QdsBadgeIconSize,
  type QdsBadgeIconTextEmphasis,
  type QdsBadgeIconTextVariant,
  type QdsBadgeSize,
  type QdsBadgeStatusEmphasis,
  type QdsBadgeStatusVariant,
  type QdsBadgeType,
} from "@qualcomm-ui/qds-core/badge"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {QdsBadgeContextService} from "./qds-badge-context.service"

@Component({
  imports: [IconDirective, QBindDirective, NgTemplateOutlet],
  providers: [QdsBadgeContextService, provideIcons({})],
  selector: "[q-badge]",
  template: `
    <ng-template #content>
      <ng-content>
        @if (type() === "count") {
          {{ displayCount() }}
        }
        @if (type() === "icon" && icon()) {
          <svg
            [q-bind]="qdsBadgeApi.context().getIconBindings()"
            [qIcon]="icon()!"
          ></svg>
        }
      </ng-content>
    </ng-template>

    @switch (type()) {
      @case ("status") {
        <!-- Status variant has no content -->
      }
      @case ("icon") {
        <span [q-bind]="qdsBadgeApi.context().getIconBindings()">
          <ng-container *ngTemplateOutlet="content" />
        </span>
      }
      @default {
        <ng-container *ngTemplateOutlet="content" />
      }
    }
  `,
})
export class BadgeDirective implements OnInit {
  /**
   * The badge type.
   * @default 'text'
   */
  readonly type = input<QdsBadgeType>()

  /**
   * Governs the size of the badge.
   * - count: sm / md / lg
   * - status: xs / sm / md / lg / xl
   * - icon: xxs / xs / sm / md / lg / xl
   * - text: sm / md / lg
   * @default 'md'
   */
  readonly size = input<QdsBadgeSize>()

  /**
   * The badge disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Governs the color of the text, icon and status badges.
   */
  readonly emphasis = input<QdsBadgeStatusEmphasis | QdsBadgeIconTextEmphasis>()

  /**
   * Governs the style of the badge.
   */
  readonly variant = input<
    QdsBadgeCountVariant | QdsBadgeStatusVariant | QdsBadgeIconTextVariant
  >()

  /**
   * The numeric count to display for the count badge.
   */
  readonly count = input<number | undefined, string | number>(undefined, {
    transform: numberAttribute,
  })

  /**
   * Maximum count to display for the count badge.
   * @default 99
   */
  readonly max = input<number | undefined, string | number>(undefined, {
    transform: numberAttribute,
  })

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon to display in the icon badge.
   */
  readonly icon = input<LucideIconOrString>()

  protected readonly displayCount = computed(() =>
    this.qdsBadgeApi.context().getDisplayCount(),
  )

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsBadgeApi.context().getRootBindings(),
  )

  protected readonly qdsBadgeApi = inject(QdsBadgeContextService)

  ngOnInit() {
    this.qdsBadgeApi.init(
      computed(() => {
        const type = this.type() || "text"

        let apiProps: QdsBadgeApiProps

        if (type === "count") {
          apiProps = {
            count: this.count(),
            disabled: this.disabled(),
            max: this.max(),
            size: this.size() as QdsBadgeBasicSize | undefined,
            type: "count",
            variant: this.variant() as QdsBadgeCountVariant | undefined,
          }
        } else if (type === "status") {
          apiProps = {
            disabled: this.disabled(),
            emphasis: this.emphasis() as QdsBadgeStatusEmphasis | undefined,
            size: this.size() as QdsBadgeExtendedSize | undefined,
            type: "status",
            variant: this.variant() as QdsBadgeStatusVariant | undefined,
          }
        } else if (type === "icon") {
          apiProps = {
            disabled: this.disabled(),
            emphasis: this.emphasis() as QdsBadgeIconTextEmphasis | undefined,
            size: this.size() as QdsBadgeIconSize | undefined,
            type: "icon",
            variant: this.variant() as QdsBadgeIconTextVariant | undefined,
          }
        } else {
          apiProps = {
            disabled: this.disabled(),
            emphasis: this.emphasis() as QdsBadgeIconTextEmphasis | undefined,
            size: this.size() as QdsBadgeBasicSize | undefined,
            type: "text",
            variant: this.variant() as QdsBadgeIconTextVariant | undefined,
          }
        }

        return createQdsBadgeApi(
          apiProps as Explicit<QdsBadgeApiProps>,
          normalizeProps,
        )
      }),
    )

    this.trackBindings()
  }
}
