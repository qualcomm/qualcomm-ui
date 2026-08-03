import {useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {DatePicker, parseDate} from "@qualcomm-ui/react/date-picker"

const seeded = parseDate("2024-06-15")
const input = () => page.getByRole("textbox")

describe("DatePicker - Locale", () => {
  test("the placeholder follows the locale's field order and separators", async () => {
    await render(<DatePicker label="Abflug" locale="de-DE" />)

    await expect.element(input()).toHaveAttribute("placeholder", "dd.mm.yyyy")
  })

  test("an explicit placeholder overrides the locale-derived one", async () => {
    await render(
      <DatePicker label="Abflug" locale="de-DE" placeholder="Pick a day" />,
    )

    await expect.element(input()).toHaveAttribute("placeholder", "Pick a day")
  })

  test("the committed value is formatted for the locale", async () => {
    await render(
      <DatePicker defaultValue={[seeded]} label="Abflug" locale="de-DE" />,
    )

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("typing in the locale's own format commits the date", async () => {
    await render(<DatePicker label="Abflug" locale="de-DE" />)

    await input().fill("20.06.2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input()).toHaveValue("20.06.2024")
  })

  test("a date typed in another locale's format is rejected, not reinterpreted", async () => {
    await render(
      <DatePicker defaultValue={[seeded]} label="Abflug" locale="de-DE" />,
    )
    await expect.element(input()).toHaveValue("15.06.2024")

    await input().fill("10/06/2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("a date whose month is out of range for the locale's field order is rejected", async () => {
    await render(
      <DatePicker defaultValue={[seeded]} label="Abflug" locale="de-DE" />,
    )

    await input().fill("06.20.2024")
    await userEvent.keyboard("{Enter}")

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("the weekday header starts on the locale's first day of the week", async () => {
    await render(
      <DatePicker
        defaultFocusedValue={seeded}
        label="Abflug"
        locale="de-DE"
        variant="inline"
      />,
    )
    await expect.element(page.getByRole("grid")).toBeVisible()

    const headers = Array.from(
      page.getByRole("grid").element().querySelectorAll("thead th"),
    ).map((cell) => cell.getAttribute("aria-label"))

    expect(headers[0]).toBe("Montag")
    expect(headers.at(-1)).toBe("Sonntag")
  })

  test("the month heading is localized", async () => {
    await render(
      <DatePicker
        defaultFocusedValue={seeded}
        label="Abflug"
        locale="de-DE"
        variant="inline"
      />,
    )

    await expect
      .element(page.getByRole("button", {name: /switch to month view/i}))
      .toHaveTextContent("Juni")
  })

  test("switching locale reformats the value already in the field", async () => {
    function Switcher() {
      const [locale, setLocale] = useState("en-US")
      return (
        <>
          <button onClick={() => setLocale("de-DE")}>German</button>
          <DatePicker
            defaultValue={[seeded]}
            label="Departure"
            locale={locale}
          />
        </>
      )
    }

    await render(<Switcher />)
    await expect.element(input()).toHaveValue("06/15/2024")

    await page.getByRole("button", {name: "German"}).click()

    await expect.element(input()).toHaveValue("15.06.2024")
  })

  test("an explicitly undefined translation falls back to the built-in label", async () => {
    await render(
      <DatePicker
        label="Abflug"
        translations={{trigger: undefined, viewCloseTrigger: undefined}}
      />,
    )

    await expect
      .element(page.getByRole("button", {name: "Open calendar"}))
      .toBeVisible()
  })

  test("translations override the built-in accessible labels", async () => {
    await render(
      <DatePicker
        label="Abflug"
        translations={{
          trigger: (open) => (open ? "Kalender schließen" : "Kalender öffnen"),
        }}
      />,
    )

    await expect
      .element(page.getByRole("button", {name: "Kalender öffnen"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Kalender öffnen"}).click()

    await expect
      .element(page.getByRole("button", {name: "Kalender schließen"}))
      .toBeVisible()
  })
})
