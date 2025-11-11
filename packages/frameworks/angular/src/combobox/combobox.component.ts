// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from "@angular/core"

import {provideQdsInputContext} from "@qualcomm-ui/angular/input"
import {provideComboboxContext} from "@qualcomm-ui/angular-core/combobox"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {ComboboxContentDirective} from "./combobox-content.directive"
import {ComboboxRootDirective} from "./combobox-root.directive"
import {ComboboxVirtualContentDirective} from "./combobox-virtual-content.directive"
import {provideQdsComboboxContext} from "./qds-combobox-context.service"

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComboboxContext(),
    provideQdsComboboxContext(),
    provideQdsInputContext(),
    providePresenceContext(),
  ],
  selector: "q-combobox",
  standalone: false,
  template: `
    <ng-content select="[q-combobox-label]">
      @if (label()) {
        <div q-combobox-label>{{ label() }}</div>
      }
    </ng-content>

    <ng-content select="[q-combobox-control]">
      <div q-combobox-control [attr.aria-label]="ariaLabel()">
        <ng-content select="[q-combobox-icon]" />
        <ng-content select="[q-combobox-input]">
          <input q-combobox-input [placeholder]="placeholder()" />
        </ng-content>
        <ng-content select="[q-combobox-clear-trigger]">
          @if (clearable()) {
            <button q-combobox-clear-trigger></button>
          }
        </ng-content>
        <ng-content select="[q-combobox-trigger]">
          <button q-combobox-trigger></button>
        </ng-content>
        <ng-content select="[q-combobox-error-indicator]">
          <div q-combobox-error-indicator></div>
        </ng-content>
      </div>
    </ng-content>

    <ng-content select="[q-combobox-hint]">
      @if (hint()) {
        <div q-combobox-hint>{{ hint() }}</div>
      }
    </ng-content>

    <ng-content select="[q-combobox-error-text]">
      @if (errorText()) {
        <div q-combobox-error-text>{{ errorText() }}</div>
      }
    </ng-content>

    <ng-template qPortal [disabled]="disablePortal()">
      <div q-combobox-positioner>
        @if (shouldRenderCustom()) {
          <ng-content select="[q-combobox-content]" />
        } @else if (shouldRenderVirtual()) {
          <ng-content select="[q-combobox-virtual-content]" />
        } @else {
          @if (virtual()) {
            <div q-combobox-virtual-content>
              <ng-content select="[q-combobox-empty]">
                @if (emptyText()) {
                  <div q-combobox-empty>{{ emptyText() }}</div>
                }
              </ng-content>
              <ng-container *comboboxVirtualizer="let virtualizer">
                @for (
                  virtualItem of virtualizer.getVirtualItems();
                  track virtualItem.index
                ) {
                  @let item = collection().items.at(virtualItem.index);
                  <div q-combobox-virtual-item [virtualItem]="virtualItem">
                    @if (highlightMatchingText()) {
                      <span
                        ignoreCase
                        q-combobox-item-text
                        q-highlight
                        [query]="inputValue()"
                        [text]="collection().stringifyItem(item)"
                      ></span>
                    } @else {
                      <span q-combobox-item-text>
                        {{ collection().stringifyItem(item) }}
                      </span>
                    }
                    <span q-combobox-item-indicator></span>
                  </div>
                }
              </ng-container>
            </div>
          } @else {
            <div q-combobox-content>
              <ng-content select="[q-combobox-empty]">
                @if (emptyText()) {
                  <div q-combobox-empty>{{ emptyText() }}</div>
                }
              </ng-content>
              @for (
                item of collection().items;
                track collection().getItemValue(item)
              ) {
                <div q-combobox-item [item]="item">
                  @if (highlightMatchingText()) {
                    <span
                      ignoreCase
                      q-combobox-item-text
                      q-highlight
                      [query]="inputValue()"
                      [text]="collection().stringifyItem(item)"
                    ></span>
                  } @else {
                    <span q-combobox-item-text>
                      {{ collection().stringifyItem(item) }}
                    </span>
                  }
                  <span q-combobox-item-indicator></span>
                </div>
              }
            </div>
          }
        }
      </div>
    </ng-template>
  `,
})
export class ComboboxComponent extends ComboboxRootDirective {
  /**
   * ARIA label applied to the control element. Use this if you omit the {@link
   * label}
   */
  readonly ariaLabel = input<string | undefined>()

  /**
   * When `true`, renders a clear button that resets the input value on click.
   * The button only appears when the input has a value.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Set to true to disable portalling behavior for the combobox dropdown content.
   */
  readonly disablePortal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Text to display when no items match the filter.
   *
   * @default 'No results found'
   */
  readonly emptyText = input<string | undefined | null>("No results found")

  /**
   * Optional error that describes the element when {@link invalid} is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-combobox-error-text>...</div>
   * ```
   */
  readonly errorText = input<string | undefined | null>()

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-combobox-hint>...</div>
   * ```
   */
  readonly hint = input<string | undefined | null>()

  /**
   * Set to `true` to highlight option text matches during filtering.
   */
  readonly highlightMatchingText = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * Optional label describing the element. Recommended. This element is
   * automatically associated with the component's input element for
   * accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-combobox-label>...</div>
   * ```
   */
  readonly label = input<string | undefined>()

  /**
   * When `true`, the list items will be virtually rendered. Useful for large lists.
   */
  readonly virtual = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  protected readonly customContent = contentChild(ComboboxContentDirective)
  protected readonly customVirtualContent = contentChild(
    ComboboxVirtualContentDirective,
  )
  protected readonly shouldRenderCustom = computed(() => !!this.customContent())
  protected readonly shouldRenderVirtual = computed(
    () => !!this.customVirtualContent(),
  )
}
