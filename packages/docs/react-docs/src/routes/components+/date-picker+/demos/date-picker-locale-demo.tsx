import {type ReactElement, useState} from "react"

import {DatePicker} from "@qualcomm-ui/react/date-picker"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

const locales = [
  {label: "English (US)", value: "en-US"},
  {label: "German", value: "de-DE"},
  {label: "Japanese", value: "ja-JP"},
]

export function DatePickerLocaleDemo(): ReactElement {
  const [locale, setLocale] = useState("en-US")

  return (
    <div className="flex flex-col gap-6">
      {/* preview */}
      <DatePicker className="w-64" label="Departure date" locale={locale} />
      {/* preview */}

      <RadioGroup.Root
        onValueChange={(value) => setLocale(value ?? "en-US")}
        orientation="horizontal"
        value={locale}
      >
        <RadioGroup.Label>Locale</RadioGroup.Label>
        <RadioGroup.Items>
          {locales.map(({label, value}) => (
            <Radio key={value} label={label} value={value} />
          ))}
        </RadioGroup.Items>
      </RadioGroup.Root>
    </div>
  )
}
