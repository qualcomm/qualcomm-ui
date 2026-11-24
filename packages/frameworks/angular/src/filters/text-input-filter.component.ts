// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core"
import type {LucideIcon} from "@lucide/angular"

import {
  useFilter,
  useFilterSetContext,
} from "@qualcomm-ui/angular-core/filter-set"
import {
  createTextInputFilterApi,
  type FilterControlLabelProps,
} from "@qualcomm-ui/core/filter-control"
import type {TextFilterDefinition} from "@qualcomm-ui/core/filters"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A text input that captures free text. Writes a `string`.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.search">
 *   <q-text-input-filter placeholder="Search" />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-text-input-filter",
  standalone: false,
  template: `
    @if (api(); as api) {
      <q-text-input
        [aria-label]="labelProps()['aria-label']"
        [aria-labelledby]="labelProps()['aria-labelledby']"
        [clearable]="clearable()"
        [disabled]="!!disabled()"
        [ngModel]="api.value"
        [ngModelOptions]="{standalone: true}"
        [placeholder]="placeholder()"
        [size]="qdsContext().size"
        [startIcon]="startIcon()"
        (ngModelChange)="handleValueChange($event)"
      />
    }
  `,
})
export class TextInputFilterComponent {
  /**
   * When `true`, renders a clear button that resets the input value on click.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Milliseconds to wait after typing stops before committing in `auto`
   * apply mode. Manual mode writes the draft on every keystroke.
   *
   * @default 300
   */
  readonly debounce = input<number | undefined>()

  /**
   * Controls whether the input is disabled.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The input's placeholder text.
   */
  readonly placeholder = input<string>("")

  /**
   * {@link https://lucide.dev/icons lucide-angular} icon, positioned at the
   * start of the input field.
   */
  readonly startIcon = input<LucideIcon | string | undefined>()

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filterSet = useFilterSetContext()

  protected readonly filter = useFilter<TextFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  /**
   * The typed text not yet committed. `null` when nothing is pending.
   */
  protected readonly pending = signal<string | null>(null)

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter
      ? createTextInputFilterApi(filter, {
          applyMode: this.filterSet().applyMode,
          debounce: this.debounce(),
          pending: this.pending(),
        })
      : undefined
  })

  protected readonly labelProps = computed<FilterControlLabelProps>(
    () => this.api()?.getLabelProps() ?? {},
  )

  private timeout: ReturnType<typeof setTimeout> | undefined

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timeout))
  }

  protected handleValueChange(value: string) {
    const api = this.api()
    clearTimeout(this.timeout)
    if (!api) {
      return
    }
    if (!api.commitDelay) {
      this.pending.set(null)
      api.setValue(value)
      return
    }
    this.pending.set(value)
    this.timeout = setTimeout(() => {
      this.pending.set(null)
      api.setValue(value)
    }, api.commitDelay)
  }
}
