import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {TriangleAlert} from "lucide-angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {FieldGroupModule} from "@qualcomm-ui/angular/field-group"

const groupLabel = "Notification Preferences"
const hintText = "Select at least one option."
const errorMessage = "Please select a valid option."

@Component({
  imports: [FieldGroupModule],
  template: `
    <fieldset q-field-group-root>
      <legend q-field-group-label>{{ groupLabel() }}</legend>
      <div q-field-group-hint>{{ hintText() }}</div>
      <div q-field-group-items>
        <label>
          <input name="option" type="radio" value="email" />
          Email
        </label>
        <label>
          <input name="option" type="radio" value="sms" />
          SMS
        </label>
      </div>
      <q-field-group-error-text>{{ errorMessage() }}</q-field-group-error-text>
    </fieldset>
  `,
})
class FieldGroupComponent {
  protected readonly errorMessage = signal(errorMessage)
  protected readonly groupLabel = signal(groupLabel)
  protected readonly hintText = signal(hintText)
}

describe("FieldGroup", () => {
  test("renders an accessible group with label, hint, and error text visible", async () => {
    await render(FieldGroupComponent)

    await expect
      .element(page.getByRole("group", {name: groupLabel}))
      .toBeVisible()
    await expect.element(page.getByText(hintText)).toBeVisible()
    await expect.element(page.getByText(errorMessage)).toBeVisible()
  })

  test("renders child form controls inside the items container", async () => {
    await render(FieldGroupComponent)

    await expect.element(page.getByLabelText("Email")).toBeVisible()
    await expect.element(page.getByLabelText("SMS")).toBeVisible()
  })

  test("renders the default error message when no custom icon is supplied", async () => {
    await render(FieldGroupComponent)

    await expect.element(page.getByText(errorMessage)).toBeVisible()
  })

  test("renders a user-supplied icon with the error text", async () => {
    @Component({
      imports: [FieldGroupModule],
      template: `
        <fieldset q-field-group-root>
          <legend q-field-group-label>{{ groupLabel() }}</legend>
          <q-field-group-error-text [icon]="icon()">
            {{ errorMessage() }}
          </q-field-group-error-text>
        </fieldset>
      `,
    })
    class FieldGroupCustomIconComponent {
      protected readonly errorMessage = signal(errorMessage)
      protected readonly groupLabel = signal(groupLabel)
      protected readonly icon = signal(TriangleAlert)
    }

    await render(FieldGroupCustomIconComponent)

    const errorText = page.getByText(errorMessage).element()
    await expect.element(page.getByText(errorMessage)).toBeVisible()
    expect(
      errorText.closest("q-field-group-error-text")?.querySelector("svg"),
    ).toBeTruthy()
  })
})
