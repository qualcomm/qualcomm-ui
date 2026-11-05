import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {DatePickerModule, parseDate} from "@qualcomm-ui/angular/date-picker"
import type {DatePickerIntlTranslations} from "@qualcomm-ui/core/date-picker"

const seeded = parseDate("2024-06-15")
const input = () => page.getByRole("textbox")

function germanTemplate(rootAttrs: string) {
  return `<q-date-picker label="Abflug" locale="de-DE" ${rootAttrs} />`
}

function switcherTemplate() {
  return `
    <button type="button" (click)="locale.set('de-DE')">German</button>
    <q-date-picker
      label="Departure"
      [defaultValue]="value"
      [locale]="locale()"
    />
  `
}

function translationsTemplate() {
  return `<q-date-picker label="Abflug" [translations]="translations" />`
}

function german(rootAttrs = "") {
  @Component({
    imports: [DatePickerModule],
    template: germanTemplate(rootAttrs),
  })
  class GermanComponent {
    readonly seeded = seeded
    readonly value = [seeded]
  }
  return GermanComponent
}

@Component({
  imports: [DatePickerModule],
  template: switcherTemplate(),
})
class LocaleSwitcherComponent {
  readonly locale = signal("en-US")
  readonly value = [seeded]
}

@Component({
  imports: [DatePickerModule],
  template: translationsTemplate(),
})
class UndefinedTranslationsComponent {
  readonly translations: DatePickerIntlTranslations = {
    trigger: undefined,
    viewCloseTrigger: undefined,
  }
}

@Component({
  imports: [DatePickerModule],
  template: translationsTemplate(),
})
class CustomTranslationsComponent {
  readonly translations: DatePickerIntlTranslations = {
    trigger: ({open}) => (open ? "Kalender schließen" : "Kalender öffnen"),
  }
}

@Component({
  imports: [DatePickerModule],
  template: `
    <q-date-picker
      label="Abflug"
      locale="de-DE"
      [translations]="translations"
    />
  `,
})
class GermanFormatTranslationComponent {
  readonly translations: DatePickerIntlTranslations = {
    inputDescription: (format) => `Datumsformat: ${format}`,
  }
}

describe("DatePicker - Locale", () => {
  test("the placeholder follows the locale's field order and separators", async () => {
    await render(german())

    await expect.element(input()).toHaveAttribute("placeholder", "dd.mm.yyyy")
  })

  test("an explicit placeholder overrides the locale-derived one", async () => {
    await render(german(`placeholder="Pick a day"`))

    await expect.element(input()).toHaveAttribute("placeholder", "Pick a day")
  })

  test("the input describes the expected format, following the locale", async () => {
    await render(german())

    await expect
      .element(input())
      .toHaveAttribute("aria-description", "Date format: dd.mm.yyyy")
  })

  test("an explicit placeholder does not change the described format", async () => {
    await render(german(`placeholder="Pick a day"`))

    await expect
      .element(input())
      .toHaveAttribute("aria-description", "Date format: dd.mm.yyyy")
  })

  test("translations override the described format", async () => {
    await render(GermanFormatTranslationComponent)

    await expect
      .element(input())
      .toHaveAttribute("aria-description", "Datumsformat: dd.mm.yyyy")
  })

  test("the committed value is formatted for the locale", async () => {
    await render(german(`[defaultValue]="value"`))

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("typing in the locale's own format commits the date", async () => {
    await render(german())

    await input().fill("20.06.2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input()).toHaveValue("20.06.2024")
  })

  test("a date typed in another locale's format is rejected, not reinterpreted", async () => {
    await render(german(`[defaultValue]="value"`))
    await expect.element(input()).toHaveValue("15.06.2024")

    await input().fill("10/06/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("a date whose month is out of range for the locale's field order is rejected", async () => {
    await render(german(`[defaultValue]="value"`))

    await input().fill("06.20.2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("the weekday header starts on the locale's first day of the week", async () => {
    await render(german(`variant="inline" [defaultFocusedValue]="seeded"`))
    await expect.element(page.getByRole("grid")).toBeVisible()

    const headers = Array.from(
      page.getByRole("grid").element().querySelectorAll("thead th"),
    ).map((cell) => cell.getAttribute("aria-label"))

    expect(headers[0]).toBe("Montag")
    expect(headers.at(-1)).toBe("Sonntag")
  })

  test("the month heading is localized", async () => {
    await render(german(`variant="inline" [defaultFocusedValue]="seeded"`))

    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .toHaveTextContent("Juni")
  })

  test("switching locale reformats the value already in the field", async () => {
    await render(LocaleSwitcherComponent)
    await expect.element(input()).toHaveValue("06/15/2024")

    await page.getByRole("button", {name: "German"}).click()

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("an explicitly undefined translation falls back to the built-in label", async () => {
    await render(UndefinedTranslationsComponent)

    await expect
      .element(page.getByRole("button", {name: "Choose date"}))
      .toBeVisible()
  })

  test("translations override the built-in accessible labels", async () => {
    await render(CustomTranslationsComponent)

    await expect
      .element(page.getByRole("button", {name: "Kalender öffnen"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Kalender öffnen"}).click()

    await expect
      .element(page.getByRole("button", {name: "Kalender schließen"}))
      .toBeVisible()
  })
})
