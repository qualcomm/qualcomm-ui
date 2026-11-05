import {Component} from "@angular/core"
import {LucideCircleAlert, LucideSearch} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  ErrorTextComponent,
  HintDirective,
  InputEndIconComponent,
  InputStartIconComponent,
} from "@qualcomm-ui/angular/input"

describe("Input primitives", () => {
  test("renders standalone hint and error text content", async () => {
    @Component({
      imports: [ErrorTextComponent, HintDirective],
      providers: [provideIcons({LucideCircleAlert})],
      template: `
        <p q-hint>Use 8 or more characters.</p>
        <p icon="LucideCircleAlert" q-error-text>Password is required.</p>
      `,
    })
    class InputTextComponent {}

    await render(InputTextComponent)

    await expect
      .element(page.getByText("Use 8 or more characters."))
      .toBeVisible()
    await expect.element(page.getByText("Password is required.")).toBeVisible()
    expect(
      page.getByText("Password is required.").element().querySelector("svg"),
    ).toBeTruthy()
  })

  test("renders standalone input start and end icons", async () => {
    @Component({
      imports: [InputEndIconComponent, InputStartIconComponent],
      providers: [provideIcons({LucideSearch})],
      template: `
        <span
          data-test-id="start-input-icon"
          icon="Search"
          q-input-start-icon
        ></span>
        <span
          data-test-id="end-input-icon"
          icon="Search"
          q-input-end-icon
        ></span>
      `,
    })
    class InputIconComponent {}

    await render(InputIconComponent)

    expect(
      page.getByTestId("start-input-icon").element().querySelector("svg"),
    ).toBeTruthy()
    expect(
      page.getByTestId("end-input-icon").element().querySelector("svg"),
    ).toBeTruthy()
  })
})
