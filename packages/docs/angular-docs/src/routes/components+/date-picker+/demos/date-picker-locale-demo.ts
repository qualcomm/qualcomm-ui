import {Component, signal} from "@angular/core"

import {DatePickerModule} from "@qualcomm-ui/angular/date-picker"
import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [DatePickerModule, RadioModule],
  selector: "date-picker-locale-demo",
  template: `
    <div class="flex flex-col gap-6">
      <!-- preview -->
      <q-date-picker class="w-64" label="Departure date" [locale]="locale()" />
      <!-- preview -->

      <fieldset
        orientation="horizontal"
        q-radio-group
        [defaultValue]="locale()"
        (valueChanged)="onLocaleChange($event)"
      >
        <div q-radio-group-label>Locale</div>
        <div q-radio-group-items>
          @for (item of locales; track item.value) {
            <label q-radio [label]="item.label" [value]="item.value"></label>
          }
        </div>
      </fieldset>
    </div>
  `,
})
export class DatePickerLocaleDemo {
  readonly locale = signal("en-US")

  readonly locales = [
    {label: "English (US)", value: "en-US"},
    {label: "German", value: "de-DE"},
    {label: "Japanese", value: "ja-JP"},
  ]

  onLocaleChange(value: string | null) {
    this.locale.set(value ?? "en-US")
  }
}
