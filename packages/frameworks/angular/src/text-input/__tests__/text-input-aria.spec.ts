// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {TextInputModule} from "@qualcomm-ui/angular/text-input"

describe("Text input ARIA labels", () => {
  test("simple text input forwards static native aria-labelledby to the input", async () => {
    @Component({
      imports: [TextInputModule],
      template: `
        <span id="external-label">External label</span>
        <q-text-input aria-labelledby="external-label" label="Internal label" />
      `,
    })
    class TestComponent {}

    const {container} = await render(TestComponent)

    await expect
      .element(page.getByRole("textbox", {name: "External label"}))
      .toBeVisible()
    expect(container.querySelector("q-text-input")).not.toHaveAttribute(
      "aria-labelledby",
    )
  })

  test("simple text input forwards dynamic native aria-label to the input", async () => {
    @Component({
      imports: [TextInputModule],
      template: `
        <button (click)="label.set('Updated search')">Update label</button>
        <q-text-input [aria-label]="label()" />
      `,
    })
    class TestComponent {
      readonly label = signal("Search query")
    }

    const {container} = await render(TestComponent)

    await expect
      .element(page.getByRole("textbox", {name: "Search query"}))
      .toHaveAttribute("aria-label", "Search query")
    expect(container.querySelector("q-text-input")).not.toHaveAttribute(
      "aria-label",
    )

    await page.getByRole("button", {name: "Update label"}).click()

    await expect
      .element(page.getByRole("textbox", {name: "Updated search"}))
      .toHaveAttribute("aria-label", "Updated search")
    expect(container.querySelector("q-text-input")).not.toHaveAttribute(
      "aria-label",
    )
  })

  test("text input control uses native aria-label input", async () => {
    @Component({
      imports: [TextInputModule],
      template: `
        <div q-text-input-root>
          <div q-text-input-input-group>
            <input aria-label="External label" q-text-input-input />
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const input = page.getByRole("textbox", {name: "External label"})
    await expect.element(input).toHaveAttribute("aria-label", "External label")
  })

  test("text input control uses static aria-labelledby instead of the internal label reference", async () => {
    @Component({
      imports: [TextInputModule],
      template: `
        <span id="external-label">External label</span>
        <div q-text-input-root>
          <label q-text-input-label>Internal label</label>
          <div q-text-input-input-group>
            <input aria-labelledby="external-label" q-text-input-input />
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    await expect
      .element(page.getByRole("textbox", {name: "External label"}))
      .toBeVisible()
  })
})
