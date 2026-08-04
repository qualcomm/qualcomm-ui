import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {
  FieldGroupErrorText,
  FieldGroupHint,
  FieldGroupItems,
  FieldGroupLabel,
  FieldGroupRoot,
} from "@qualcomm-ui/react/field-group"

const groupLabel = "Notification Preferences"
const hintText = "Select at least one option."
const errorMessage = "Please select a valid option."
const customIconTestId = "custom-error-icon"

function renderFullGroup(
  rootProps: React.ComponentProps<typeof FieldGroupRoot> = {},
  errorTextProps: React.ComponentProps<typeof FieldGroupErrorText> = {},
) {
  return render(
    <FieldGroupRoot {...rootProps}>
      <FieldGroupLabel>{groupLabel}</FieldGroupLabel>
      <FieldGroupHint>{hintText}</FieldGroupHint>
      <FieldGroupItems>
        <label>
          <input name="option" type="radio" value="email" />
          Email
        </label>
        <label>
          <input name="option" type="radio" value="sms" />
          SMS
        </label>
      </FieldGroupItems>
      <FieldGroupErrorText {...errorTextProps}>
        {errorMessage}
      </FieldGroupErrorText>
    </FieldGroupRoot>,
  )
}

describe("FieldGroup", () => {
  test("renders an accessible group with label, hint, and error text visible", async () => {
    await renderFullGroup()

    await expect
      .element(page.getByRole("group", {name: groupLabel}))
      .toBeVisible()
    await expect.element(page.getByText(hintText)).toBeVisible()
    await expect.element(page.getByText(errorMessage)).toBeVisible()
  })

  test("renders child form controls inside the items container", async () => {
    await renderFullGroup()

    await expect.element(page.getByLabelText("Email")).toBeVisible()
    await expect.element(page.getByLabelText("SMS")).toBeVisible()
  })

  test("renders the default error message when no custom icon is supplied", async () => {
    await renderFullGroup()

    await expect.element(page.getByText(errorMessage)).toBeVisible()
  })

  test("renders a user-supplied ReactElement as the error icon", async () => {
    await renderFullGroup(
      {},
      {icon: <span data-test-id={customIconTestId}>!!</span>},
    )

    await expect.element(page.getByTestId(customIconTestId)).toBeVisible()
    await expect.element(page.getByText(errorMessage)).toBeVisible()
  })
})
