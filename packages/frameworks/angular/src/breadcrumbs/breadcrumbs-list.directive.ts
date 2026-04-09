// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  type OnInit,
  viewChild,
} from "@angular/core"

import type {LucideIconOrString} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import {
  getItemSegments,
  type QdsBreadcrumbItemData,
  type QdsBreadcrumbsMaxItems,
} from "@qualcomm-ui/qds-core/breadcrumbs"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context.service"
import {useAutoMaxItems} from "./use-auto-max-items"

export type BreadcrumbsItemData = QdsBreadcrumbItemData<
  LucideIconOrString,
  string | string[]
>

@Component({
  selector: "[q-breadcrumbs-list]",
  standalone: false,
  template: `
    <ng-template #itemTmpl let-current="current" let-item>
      <li
        q-breadcrumb-item
        [attr.aria-current]="current ? 'page' : null"
        [disabled]="!!item.disabled"
      >
        @if (item.link) {
          <a q-breadcrumb-item-trigger [routerLink]="item.link">
            @if (item.icon) {
              <svg q-breadcrumb-item-icon [qIcon]="item.icon"></svg>
            }
            {{ item.label }}
          </a>
        } @else if (item.href) {
          <a q-breadcrumb-item-trigger [attr.href]="item.href">
            @if (item.icon) {
              <svg q-breadcrumb-item-icon [qIcon]="item.icon"></svg>
            }
            {{ item.label }}
          </a>
        } @else {
          <a href="" q-breadcrumb-item-trigger>
            @if (item.icon) {
              <svg q-breadcrumb-item-icon [qIcon]="item.icon"></svg>
            }
            {{ item.label }}
          </a>
        }
      </li>
    </ng-template>

    @if (items()) {
      @if (isMeasuring()) {
        @for (item of items(); track $index) {
          <ng-container
            *ngTemplateOutlet="itemTmpl; context: {$implicit: item}"
          />
        }
      } @else {
        @for (item of segments().before; track $index) {
          <ng-container
            *ngTemplateOutlet="itemTmpl; context: {$implicit: item}"
          />
        }
        @if (segments().collapsed.length) {
          <li q-breadcrumb-overflow-item>
            @for (item of segments().collapsed; track $index) {
              @if (item.link) {
                <a
                  q-menu-item
                  [disabled]="!!item.disabled"
                  [routerLink]="item.link"
                  [value]="'breadcrumb-overflow-' + $index"
                >
                  @if (item.icon) {
                    <span q-menu-item-start-icon [icon]="item.icon"></span>
                  }
                  {{ item.label }}
                </a>
              } @else if (item.href) {
                <a
                  q-menu-item
                  [attr.href]="item.href"
                  [disabled]="!!item.disabled"
                  [value]="'breadcrumb-overflow-' + $index"
                >
                  @if (item.icon) {
                    <span q-menu-item-start-icon [icon]="item.icon"></span>
                  }
                  {{ item.label }}
                </a>
              } @else {
                <button
                  q-menu-item
                  [disabled]="!!item.disabled"
                  [value]="'breadcrumb-overflow-' + $index"
                >
                  @if (item.icon) {
                    <span q-menu-item-start-icon [icon]="item.icon"></span>
                  }
                  {{ item.label }}
                </button>
              }
            }
          </li>
        }
        @for (item of segments().after; track $index; let last = $last) {
          <ng-container
            *ngTemplateOutlet="
              itemTmpl;
              context: {$implicit: item, current: last}
            "
          />
        }
      }
    } @else {
      <ng-content />
    }
    @if (isAutoOverflow()) {
      <div
        #triggerMeasure
        aria-hidden="true"
        class="qui-breadcrumbs__measure-container"
      >
        <li q-breadcrumb-overflow-item></li>
      </div>
    }
  `,
})
export class BreadcrumbsListDirective implements OnInit {
  /**
   * Data-driven breadcrumb items. When provided, the list renders items
   * automatically instead of using content projection.
   */
  readonly items = input<BreadcrumbsItemData[]>()

  /**
   * Number of items to always show after the overflow indicator when
   * `maxItems` triggers collapsing.
   * @default 1
   */
  readonly endItems = input(1)

  /**
   * Number of items to always show before the overflow indicator when
   * `maxItems` triggers collapsing.
   * @default 1
   */
  readonly startItems = input(1)

  /**
   * When the number of items exceeds this value, intermediate items are
   * collapsed into a dropdown menu. Set to `"auto"` to dynamically
   * collapse items based on container width.
   */
  readonly maxItems = input<QdsBreadcrumbsMaxItems>()

  protected readonly qdsContext = useQdsBreadcrumbsContext()

  private readonly elementRef = inject(ElementRef)
  private readonly triggerMeasureRef =
    viewChild<ElementRef<HTMLElement>>("triggerMeasure")

  protected readonly isAutoOverflow = computed(
    () => this.maxItems() === "auto" && !!this.items(),
  )

  private readonly autoMaxItems = useAutoMaxItems({
    element: this.elementRef,
    endItems: () => this.endItems(),
    startItems: () => this.startItems(),
    triggerElement: () => this.triggerMeasureRef(),
  })

  protected readonly isMeasuring = this.autoMaxItems.isMeasuring

  protected readonly trackBindings = useTrackBindings(() => ({
    ...this.qdsContext().getListBindings(),
    "data-auto-overflow": this.isAutoOverflow() || undefined,
    "data-measuring": this.isMeasuring() || undefined,
  }))

  private readonly effectiveMaxItems = computed(() => {
    if (this.maxItems() === "auto") {
      return this.autoMaxItems.computedMaxItems()
    }
    return this.maxItems() as number | undefined
  })

  protected readonly segments = computed(() => {
    const items = this.items()
    if (!items || this.isMeasuring()) {
      return {after: [], before: [], collapsed: []}
    }

    return getItemSegments(
      items,
      this.effectiveMaxItems(),
      this.startItems(),
      this.endItems(),
    )
  })

  constructor() {
    effect(() => {
      const maxItems = this.maxItems()
      const items = this.items()

      if (maxItems !== "auto" || !items || items.length === 0) {
        this.autoMaxItems.reset()
        return
      }

      this.autoMaxItems.startMeasurement()
    })
  }

  ngOnInit() {
    this.trackBindings()
  }
}
