// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
} from "@angular/core"

import {
  provideDatePickerContext,
  provideDatePickerViewContext,
} from "@qualcomm-ui/angular-core/date-picker"
import {INPUT_FORM_CONTROL_CONTEXT} from "@qualcomm-ui/angular-core/input"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import type {DatePickerPresetTriggerValue} from "@qualcomm-ui/core/date-picker"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {DatePickerActionsDirective} from "./date-picker-actions.directive"
import {DatePickerPresetsDirective} from "./date-picker-presets.directive"
import {DatePickerRootDirective} from "./date-picker-root.directive"
import {provideQdsDatePickerContext} from "./qds-date-picker-context.service"

export interface DatePickerPreset {
  /**
   * Text rendered inside the preset trigger.
   */
  label: string

  /**
   * The value applied when the preset is selected. Either a named range preset
   * (e.g. `"next7Days"`) or an explicit array of dates.
   */
  value: DatePickerPresetTriggerValue
}

export type DatePickerVariant = "input" | "inline"

/**
 * A date picker with the full calendar composed for you. Defaults to a labelled
 * field that opens a calendar popover; use {@link variant} for an always-on
 * `inline` calendar. For finer control, compose the parts yourself with
 * `q-date-picker-root` and friends.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: INPUT_FORM_CONTROL_CONTEXT,
      useFactory: () =>
        inject(DatePickerComponent, {self: true}).formControlContext,
    },
    provideDatePickerContext(),
    provideDatePickerViewContext(),
    provideQdsDatePickerContext(),
    providePresenceContext(),
  ],
  selector: "q-date-picker",
  standalone: false,
  template: `
    <ng-template #calendar>
      <div q-date-picker-view view="day">
        <div q-date-picker-view-control>
          <button q-date-picker-view-trigger view="month">
            <q-date-picker-month-text />
          </button>
          <button q-date-picker-view-trigger view="year">
            <q-date-picker-year-text />
          </button>
          <button q-date-picker-prev-trigger></button>
          <button q-date-picker-next-trigger></button>
          @if (hasPresets()) {
            <button q-date-picker-presets-trigger></button>
          }
        </div>
        <table q-date-picker-table>
          <thead q-date-picker-day-grid-header></thead>
          <tbody q-date-picker-day-grid></tbody>
        </table>
      </div>

      <div q-date-picker-view view="month">
        <div q-date-picker-view-control>
          <button disabled q-date-picker-view-trigger view="month">
            <q-date-picker-month-text />
          </button>
          <button disabled q-date-picker-view-trigger view="year">
            <q-date-picker-year-text />
          </button>
          <button q-date-picker-prev-trigger></button>
          <button q-date-picker-next-trigger></button>
          <button q-date-picker-view-close-trigger></button>
        </div>
        <table q-date-picker-table>
          <tbody q-date-picker-month-grid></tbody>
        </table>
      </div>

      <div q-date-picker-view view="year">
        <div q-date-picker-view-control>
          <button disabled q-date-picker-view-trigger view="month">
            <q-date-picker-month-text />
          </button>
          <button disabled q-date-picker-view-trigger view="year">
            <q-date-picker-year-text />
          </button>
          <button q-date-picker-prev-trigger></button>
          <button q-date-picker-next-trigger></button>
          <button q-date-picker-view-close-trigger></button>
        </div>
        <table q-date-picker-table>
          <tbody q-date-picker-year-grid></tbody>
        </table>
      </div>

      <ng-content select="[q-date-picker-presets]">
        @if (presets()?.length) {
          <div q-date-picker-presets>
            @for (preset of presets(); track $index) {
              <button q-date-picker-preset-trigger [value]="preset.value">
                {{ preset.label }}
              </button>
            }
          </div>
        }
      </ng-content>

      @if (!isInline()) {
        <ng-content select="[q-date-picker-actions]">
          @if (showActions()) {
            <div q-date-picker-actions>
              <button q-date-picker-cancel-trigger></button>
              <button q-date-picker-ok-trigger></button>
            </div>
          }
        </ng-content>
      }
    </ng-template>

    @if (isInline()) {
      <div data-variant="inline" q-date-picker-content>
        <ng-content select="[q-date-picker-headline]">
          @if (headline()) {
            <div q-date-picker-headline>
              <ng-content select="[q-date-picker-headline-label]">
                <span q-date-picker-headline-label></span>
              </ng-content>
              <ng-content select="[q-date-picker-headline-value]">
                <span q-date-picker-headline-value></span>
              </ng-content>
            </div>
          }
        </ng-content>
        <ng-container [ngTemplateOutlet]="calendar" />
      </div>
    } @else {
      <ng-content select="[q-date-picker-control]">
        <div q-date-picker-control>
          <ng-content select="[q-date-picker-input-group]">
            <div
              q-date-picker-input-group
              [fixOnBlur]="fixOnBlur()"
              [label]="label()"
              [separator]="separator()"
            ></div>
          </ng-content>
        </div>
      </ng-content>

      <ng-content select="[q-date-picker-hint]">
        @if (hint()) {
          <div q-date-picker-hint>{{ hint() }}</div>
        }
      </ng-content>
      <ng-content select="[q-date-picker-error-text]">
        @if (errorText()) {
          <div q-date-picker-error-text>{{ errorText() }}</div>
        }
      </ng-content>

      <ng-template qPortal [disabled]="disablePortal()">
        <div q-date-picker-positioner>
          <div q-date-picker-content>
            <ng-container [ngTemplateOutlet]="calendar" />
          </div>
        </div>
      </ng-template>
    }
  `,
})
export class DatePickerComponent extends DatePickerRootDirective {
  /**
   * Set to true to disable portalling behavior for the calendar popover.
   */
  readonly disablePortal = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Optional error that describes the element when `invalid` is true.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-date-picker-error-text>...</div>
   * ```
   */
  readonly errorText = input<string | undefined | null>()

  /**
   * Whether to fix the input value on blur.
   *
   * @default true
   */
  readonly fixOnBlur = input<boolean, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Whether to render the headline (label and selected value) above the
   * calendar. Only applies to the `inline` variant.
   *
   * @default true
   */
  readonly headline = input<boolean, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Optional hint describing the element. This element is automatically
   * associated with the component's input element for accessibility.
   *
   * @remarks
   * To customize the element, provide it using the directive instead:
   *
   * ```angular-html
   * <div q-date-picker-hint>...</div>
   * ```
   */
  readonly hint = input<string | undefined | null>()

  /**
   * Label text rendered above the field.
   */
  readonly label = input<string | undefined>()

  /**
   * Quick-select presets shown alongside the calendar. When provided, a toggle
   * is rendered in the day view to reveal the preset list.
   */
  readonly presets = input<DatePickerPreset[] | undefined>()

  /**
   * Character shown between the start and end inputs of a range picker.
   *
   * @default '-'
   */
  readonly separator = input("-")

  /**
   * The presentation of the date picker.
   * - `input` - a labelled field that opens the calendar in a popover.
   * - `inline` - an always-visible, flat calendar that commits on selection.
   *
   * @default 'input'
   */
  readonly variant = input<DatePickerVariant>("input")

  protected readonly projectedPresets = contentChild(DatePickerPresetsDirective)
  protected readonly projectedActions = contentChild(DatePickerActionsDirective)

  /**
   * Whether the presets trigger should be displayed.
   */
  protected readonly hasPresets = computed(
    () => !!this.presets()?.length || !!this.projectedPresets(),
  )

  /**
   * The inherited `inline` input must drive the rendered branch too, or it
   * configures an inline machine behind the input and popover layout.
   */
  protected readonly isInline = computed(
    () => this.variant() === "inline" || !!this.inline(),
  )

  protected override readonly resolvedInline = this.isInline

  protected readonly showActions = computed(
    () =>
      !this.isInline() &&
      (this.closeOnSelect() === false ||
        this.selectionMode() === "multiple" ||
        !!this.projectedActions()),
  )

  protected override readonly resolvedCloseOnSelect = computed(() =>
    this.showActions() ? false : this.closeOnSelect(),
  )
}
