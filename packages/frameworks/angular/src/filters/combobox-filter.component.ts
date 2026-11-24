// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {useFilter as useLocaleFilter} from "@qualcomm-ui/angular-core/locale"
import type {
  ComboboxInputValueChangeDetails,
  ComboboxPositioningOptions,
} from "@qualcomm-ui/core/combobox"
import {
  createComboboxFilterApi,
  type FilterControlLabelProps,
  narrowFilterCollection,
} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import {isEqual} from "@qualcomm-ui/utils/equal"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A searchable combobox listing the items of the filter's list collection.
 * Supports `multiple`. Writes a `string[]`. The input text narrows the items
 * shown, never the filter's collection. For server-side search, read the text
 * with `inputValueChanged` and narrow the collection resolved by
 * `getFilterCollection`. Keep the selected items in the narrowed collection,
 * since the filter labels its values from the collection.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.assignee">
 *   <q-combobox-filter multiple placeholder="Search people" />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-combobox-filter",
  standalone: false,
  template: `
    @if (api(); as api) {
      <q-combobox
        [aria-label]="labelProps()['aria-label']"
        [aria-labelledby]="labelProps()['aria-labelledby']"
        [clearable]="clearable()"
        [collection]="collection()"
        [disabled]="!!disabled()"
        [emptyText]="emptyText()"
        [highlightMatchingText]="highlightMatchingText()"
        [multiple]="multiple()"
        [ngModel]="selectedItems()"
        [ngModelOptions]="{standalone: true}"
        [placeholder]="placeholder()"
        [positioning]="positioning()"
        [size]="qdsContext().size"
        (inputValueChanged)="onInputValueChange($event)"
        (ngModelChange)="api.setValue(api.collection.getValues($event))"
      />
    }
  `,
})
export class ComboboxFilterComponent {
  /**
   * When `true`, renders a clear button that resets the value on click.
   *
   * @default true
   */
  readonly clearable = input<boolean | undefined, Booleanish>(true, {
    transform: booleanAttribute,
  })

  /**
   * Controls whether the combobox is disabled.
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Text to display when no items match the input.
   *
   * @default 'No results found'
   */
  readonly emptyText = input<string | undefined | null>("No results found")

  /**
   * When `true`, highlights the text of items that match the input.
   */
  readonly highlightMatchingText = input<boolean | undefined, Booleanish>(
    undefined,
    {transform: booleanAttribute},
  )

  /**
   * Whether to allow multiple selection.
   *
   * @default false
   */
  readonly multiple = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The placeholder text of the combobox's input.
   */
  readonly placeholder = input<string | undefined>()

  /**
   * The positioning options of the menu.
   *
   * @inheritDoc
   */
  readonly positioning = input<ComboboxPositioningOptions | undefined>()

  /**
   * Emitted when the input text changes. Use it to narrow the collection
   * resolved by `getFilterCollection` on the server.
   */
  readonly inputValueChanged = output<ComboboxInputValueChangeDetails>()

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filter = useFilter<ListFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  protected readonly localeFilter = useLocaleFilter({sensitivity: "base"})

  protected readonly inputValue = signal("")

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter ? createComboboxFilterApi(filter) : undefined
  })

  /**
   * The narrowed collection is a new instance whenever the input text is set,
   * so it is derived here rather than in the template.
   */
  protected readonly collection = computed(() => {
    const api = this.api()!
    return narrowFilterCollection(
      api.collection,
      this.inputValue(),
      this.localeFilter().contains,
    )
  })

  protected readonly labelProps = computed<FilterControlLabelProps>(
    () => this.api()?.getLabelProps() ?? {},
  )

  /**
   * Selected items come from the filter's collection rather than the narrowed
   * one, so that the selection survives narrowing.
   */
  protected readonly selectedItems = computed(
    () => {
      const api = this.api()
      return api ? api.collection.findMany(api.value) : []
    },
    {equal: isEqual},
  )

  protected onInputValueChange(details: ComboboxInputValueChangeDetails) {
    this.inputValue.set(details.inputValue)
    this.inputValueChanged.emit(details)
  }
}
