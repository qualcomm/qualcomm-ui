// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  signal,
} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {
  createDateFilterApi,
  type FilterControlLabelProps,
} from "@qualcomm-ui/core/filter-control"
import type {DateFilterDefinition} from "@qualcomm-ui/core/filters"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {DateValue} from "@qualcomm-ui/utils/date-utils"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A date range picker, optionally preceded by a radio group of the
 * definition's presets. Writes `{range: [start, end]}` with ISO 8601 dates, or
 * `{preset}`. Resolve a preset to dates with `resolveDateFilterPreset`.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.created">
 *   <q-date-filter />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-date-filter",
  standalone: false,
  template: `
    @if (api(); as api) {
      @if (api.choices.length) {
        <fieldset
          q-radio-group
          [aria-label]="labelProps()['aria-label']"
          [aria-labelledby]="labelProps()['aria-labelledby']"
          [disabled]="!!disabled()"
          [ngModel]="api.choice"
          [ngModelOptions]="{standalone: true}"
          [q-bind]="optionGroupBindings()"
          [size]="qdsContext().size"
          (ngModelChange)="api.selectChoice($event)"
        >
          <div q-radio-group-items>
            @for (choice of api.choices; track choice.value) {
              <label
                q-radio
                [label]="choice.label"
                [value]="choice.value"
              ></label>
            }
          </div>
        </fieldset>
      }
      @if (api.showPicker) {
        <q-date-picker
          selectionMode="range"
          [disabled]="!!disabled()"
          [locale]="locale()"
          [max]="max()"
          [min]="min()"
          [ngModel]="api.pickerValue"
          [ngModelOptions]="{standalone: true}"
          [placeholder]="placeholder()"
          [size]="qdsContext().size"
          [timeZone]="timeZone()"
          (ngModelChange)="api.setPickerValue($event ?? [])"
        />
      }
    }
  `,
})
export class DateFilterComponent {
  /**
   * Label of the option that clears the filter. Only rendered with presets.
   *
   * @default "Any time"
   */
  readonly anyLabel = input<string | undefined>()

  /**
   * Whether a custom range can be picked alongside the definition's presets.
   * Without presets, the filter is always a custom range.
   *
   * @default true
   */
  readonly customRange = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Label of the custom range option. Only rendered with presets.
   *
   * @default "Custom range"
   */
  readonly customRangeLabel = input<string | undefined>()

  /**
   * Controls whether the presets and the date picker are disabled.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The locale (BCP 47 language tag) to use when formatting the date.
   *
   * @default 'en-US'
   */
  readonly locale = input<string | undefined>()

  /**
   * The maximum date that can be selected.
   */
  readonly max = input<DateValue | undefined>()

  /**
   * The minimum date that can be selected.
   */
  readonly min = input<DateValue | undefined>()

  /**
   * The placeholder text to display in the input.
   */
  readonly placeholder = input<string | undefined>()

  /**
   * The time zone to use.
   *
   * @default 'UTC'
   */
  readonly timeZone = input<string | undefined>()

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filter = useFilter<DateFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  /**
   * Whether the user picked the custom range choice. Kept by the control,
   * since an empty custom range has no filter value to record it.
   */
  protected readonly customSelected = signal(false)

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter
      ? createDateFilterApi(filter, {
          anyLabel: this.anyLabel(),
          customRange: this.customRange(),
          customRangeLabel: this.customRangeLabel(),
          customSelected: this.customSelected(),
          onCustomSelectedChange: (customSelected) =>
            this.customSelected.set(customSelected),
        })
      : undefined
  })

  protected readonly labelProps = computed<FilterControlLabelProps>(
    () => this.api()?.getLabelProps() ?? {},
  )

  protected readonly optionGroupBindings = computed(() =>
    this.qdsContext().getOptionGroupBindings(),
  )
}
