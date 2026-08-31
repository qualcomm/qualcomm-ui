// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  type OnInit,
} from "@angular/core"
import {LucideCalendar} from "@lucide/angular"

import {useId} from "@qualcomm-ui/angular-core/common"
import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

/**
 * Groups the label, input, clear, and calendar trigger. For a range picker the
 * start and end inputs are grouped into a single bordered field separated by
 * {@link separator}.
 */
@Component({
  providers: [provideIcons({LucideCalendar})],
  selector: "div[q-date-picker-input-group]",
  standalone: false,
  template: `
    @if (label()) {
      <label q-date-picker-label [id]="labelId">{{ label() }}</label>
    }
    <div q-date-picker-input-group-trigger [groupLabelId]="groupLabelId()">
      @if (isMultiple()) {
        <span
          q-date-picker-value-tags
          [dismissLabel]="dismissLabel()"
          [placeholder]="placeholder()"
        ></span>
      } @else {
        <input q-date-picker-input [fixOnBlur]="fixOnBlur()" [index]="0" />
        @if (isRange()) {
          <span aria-hidden [q-bind]="qdsContext().getRangeSeparatorBindings()">
            {{ separator() }}
          </span>
          <input q-date-picker-input [fixOnBlur]="fixOnBlur()" [index]="1" />
        }
      }
      <button q-date-picker-input-clear-trigger></button>
      <span aria-hidden [q-bind]="qdsContext().getDividerBindings()"></span>
      <span q-date-picker-error-indicator></span>
      @if (isMultiple()) {
        <svg
          aria-hidden
          qIcon="LucideCalendar"
          [q-bind]="qdsContext().getInputIconBindings()"
        ></svg>
      } @else {
        <button q-date-picker-input-trigger></button>
      }
    </div>
  `,
})
export class DatePickerInputGroupDirective implements OnInit {
  /**
   * Returns the accessible label for a tag's remove button. Only applicable in
   * `multiple` mode.
   *
   * @default (dateText) => `Remove ${dateText}`
   */
  readonly dismissLabel = input<(dateText: string) => string>(
    (dateText) => `Remove ${dateText}`,
  )

  /**
   * Whether to fix the input value on blur.
   *
   * @default true
   */
  readonly fixOnBlur = input<boolean, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Label text rendered above the field.
   */
  readonly label = input<string | undefined>()

  /**
   * Text shown when no date is selected. Only applicable in `multiple` mode.
   *
   * @default 'Select dates'
   */
  readonly placeholder = input("Select dates")

  /**
   * Character shown between the start and end inputs of a range picker.
   *
   * @default '-'
   */
  readonly separator = input("-")

  protected readonly labelId = useId(this, undefined)

  protected readonly api = useDatePickerContext()
  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly isMultiple = computed(
    () => this.api().selectionMode === "multiple",
  )
  protected readonly isRange = computed(
    () => this.api().selectionMode === "range",
  )

  protected readonly groupLabelId = computed(() => {
    const hasGroupLabel =
      (this.isRange() || this.isMultiple()) && !!this.label()
    return hasGroupLabel ? this.labelId : undefined
  })

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getControlGroupBindings(),
  )

  ngOnInit() {
    this.trackBindings()
  }
}
