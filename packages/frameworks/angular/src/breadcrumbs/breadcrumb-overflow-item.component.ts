// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
} from "@angular/core"
import {ChevronRight} from "lucide-angular"

import {
  provideQdsMenuContext,
  QdsMenuContextService,
} from "@qualcomm-ui/angular/menu"
import {
  type LucideIconOrString,
  provideIcons,
} from "@qualcomm-ui/angular-core/lucide"
import {
  normalizeProps,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {
  CoreMenuRootDirective,
  provideMenuContext,
  provideMenuMachineContext,
  provideMenuTriggerContext,
} from "@qualcomm-ui/angular-core/menu"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {createQdsMenuApi, type QdsMenuSize} from "@qualcomm-ui/qds-core/menu"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"

const breadcrumbsSizeToMenuSize: Record<string, QdsMenuSize> = {
  lg: "md",
  md: "sm",
  sm: "sm",
}

@Component({
  providers: [
    provideIcons({ChevronRight}),
    provideMenuContext(),
    provideMenuTriggerContext(),
    provideMenuMachineContext(),
    providePresenceContext(),
    provideQdsMenuContext(),
  ],
  selector: "[q-breadcrumb-overflow-item]",
  standalone: false,
  template: `
    <ng-content select="[q-breadcrumb-overflow-trigger]">
      <button
        q-breadcrumb-overflow-trigger
        q-menu-trigger
        [attr.aria-label]="ariaLabel()"
      >
        @if (icon()) {
          <svg q-breadcrumb-item-icon [qIcon]="icon()!"></svg>
        }
        &hellip;
      </button>
    </ng-content>
    <ng-template qPortal>
      <div q-menu-positioner>
        <div q-menu-content>
          <ng-content />
        </div>
      </div>
    </ng-template>

    <ng-content select="[q-breadcrumb-item-separator]">
      <svg q-breadcrumb-item-separator [qIcon]="separator()"></svg>
    </ng-content>
  `,
})
export class BreadcrumbOverflowItemComponent extends CoreMenuRootDirective {
  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Accessible label for the overflow trigger button.
   * @default 'Show more'
   */
  readonly ariaLabel = input("Show more")

  /**
   * The icon to display next to the ellipsis.
   */
  readonly icon = input<LucideIconOrString>()

  /**
   * The separator element to render between items.
   *
   * @default ChevronRight
   */
  readonly separator = input<LucideIconOrString>("ChevronRight")

  private readonly qdsContext = useQdsBreadcrumbsContext()
  private readonly qdsMenuService = inject(QdsMenuContextService)

  private readonly menuSize = computed(
    () => breadcrumbsSizeToMenuSize[this.qdsContext().size] ?? "sm",
  )

  private readonly trackItemBindings = useTrackBindings(() =>
    this.qdsContext().getItemBindings({disabled: this.disabled()}),
  )

  override ngOnInit() {
    super.ngOnInit()

    this.qdsMenuService.init(
      computed(() => createQdsMenuApi({size: this.menuSize()}, normalizeProps)),
    )

    this.trackItemBindings()
  }
}
