// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {PasswordInputModule} from "@qualcomm-ui/angular/password-input"

describe("Password input ARIA labels", () => {
  test("simple password input forwards static native aria-labelledby to the input", async () => {
    @Component({
      imports: [PasswordInputModule],
      template: `
        <span id="external-label">External label</span>
        <q-password-input
          aria-labelledby="external-label"
          label="Internal label"
        />
      `,
    })
    class TestComponent {}

    const {container} = await render(TestComponent)

    await expect.element(page.getByLabelText("External label")).toBeVisible()
    expect(container.querySelector("q-password-input")).not.toHaveAttribute(
      "aria-labelledby",
    )
  })

  test("simple password input forwards dynamic native aria-label to the input", async () => {
    @Component({
      imports: [PasswordInputModule],
      template: `
        <button (click)="label.set('Updated password')">Update label</button>
        <q-password-input [aria-label]="label()" />
      `,
    })
    class TestComponent {
      readonly label = signal("Account password")
    }

    const {container} = await render(TestComponent)

    await expect
      .element(page.getByLabelText("Account password"))
      .toHaveAttribute("aria-label", "Account password")
    expect(container.querySelector("q-password-input")).not.toHaveAttribute(
      "aria-label",
    )

    await page.getByRole("button", {name: "Update label"}).click()

    await expect
      .element(page.getByLabelText("Updated password"))
      .toHaveAttribute("aria-label", "Updated password")
    expect(container.querySelector("q-password-input")).not.toHaveAttribute(
      "aria-label",
    )
  })

  test("password input control uses native aria-label input", async () => {
    @Component({
      imports: [PasswordInputModule],
      template: `
        <div q-password-input-root>
          <div q-password-input-input-group>
            <input aria-label="External label" q-password-input-input />
            <button q-password-input-visibility-trigger></button>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const input = page.getByLabelText("External label")
    await expect.element(input).toHaveAttribute("aria-label", "External label")
  })

  test("password input control uses static aria-labelledby instead of the internal label reference", async () => {
    @Component({
      imports: [PasswordInputModule],
      template: `
        <span id="external-label">External label</span>
        <div q-password-input-root>
          <label q-password-input-label>Internal label</label>
          <div q-password-input-input-group>
            <input aria-labelledby="external-label" q-password-input-input />
            <button q-password-input-visibility-trigger></button>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    await expect.element(page.getByLabelText("External label")).toBeVisible()
  })
})
