// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, type OnInit} from "@angular/core"

import {useDatePickerContext} from "@qualcomm-ui/angular-core/date-picker"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {DateValue} from "@qualcomm-ui/core/date-picker"

import {useQdsDatePickerContext} from "./qds-date-picker-context.service"

interface ValueTag {
  date: DateValue
  label: string
}

/**
 * Displays the dates selected in `multiple` mode as dismissible tags. Renders a
 * visually hidden input per selected date so the selection participates in form
 * submission under the picker's `name`.
 */
@Component({
  host: {
    "[attr.data-empty]": "tags().length ? null : ''",
  },
  selector: "span[q-date-picker-value-tags]",
  standalone: false,
  template: `
    @if (tags().length) {
      @for (tag of tags(); track tag.date.toString()) {
        <span
          emphasis="neutral"
          q-tag
          variant="dismissable"
          [disabled]="isDisabled()"
          [dismissLabel]="dismissLabel()(tag.label)"
          (click)="$event.stopPropagation()"
          (dismiss)="api().toggleValue(tag.date)"
        >
          {{ tag.label }}
        </span>
      }
    } @else {
      {{ placeholder() }}
    }
    @for (formValue of formValues(); track $index) {
      <input
        [q-bind]="
          api().getHiddenInputBindings({index: $index, value: formValue})
        "
      />
    }
  `,
})
export class DatePickerValueTagsDirective implements OnInit {
  /**
   * Returns the accessible label for a tag's remove button.
   *
   * @default (dateText) => `Remove ${dateText}`
   */
  readonly dismissLabel = input<(dateText: string) => string>(
    (dateText) => `Remove ${dateText}`,
  )

  /**
   * Text shown when no date is selected.
   *
   * @default 'Select dates'
   */
  readonly placeholder = input("Select dates")

  protected readonly qdsContext = useQdsDatePickerContext()

  protected readonly trackBindings = useTrackBindings(() =>
    this.qdsContext().getValueTagsBindings(),
  )

  protected readonly api = useDatePickerContext()

  protected readonly tags = computed<ValueTag[]>(() => {
    const api = this.api()
    return api.value.flatMap((date, index) =>
      date == null ? [] : [{date, label: api.valueAsString[index]}],
    )
  })

  /**
   * An empty selection still needs one input so `required` blocks submission.
   */
  protected readonly formValues = computed(() => {
    const tags = this.tags()
    return tags.length ? tags.map((tag) => tag.label) : [""]
  })

  protected readonly isDisabled = computed(() => {
    const api = this.api()
    return api.disabled || api.readOnly
  })

  ngOnInit() {
    this.trackBindings()
  }
}
