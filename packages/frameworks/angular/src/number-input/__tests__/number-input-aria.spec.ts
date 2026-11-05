// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {NumberInputModule} from "@qualcomm-ui/angular/number-input"

describe("Number input ARIA labels", () => {
  test("simple number input uses aria-labelledby input instead of the internal label reference", async () => {
    @Component({
      imports: [NumberInputModule],
      template: `
        <span id="external-label">External label</span>
        <q-number-input
          aria-labelledby="external-label"
          label="Internal label"
        />
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    await expect
      .element(page.getByRole("spinbutton", {name: "External label"}))
      .toBeVisible()
  })

  test("simple number input forwards dynamic aria-label to the input", async () => {
    @Component({
      imports: [NumberInputModule],
      template: `
        <q-number-input [aria-label]="inputLabel()" />
        <button (click)="inputLabel.set('Updated amount')">Update label</button>
      `,
    })
    class TestComponent {
      readonly inputLabel = signal("Amount")
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("spinbutton", {name: "Amount"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Update label"}).click()

    await expect
      .element(page.getByRole("spinbutton", {name: "Updated amount"}))
      .toBeVisible()
  })

  test("simple number input does not retain aria label attributes on the host", async () => {
    @Component({
      imports: [NumberInputModule],
      template: `
        <span id="external-label">External label</span>
        <q-number-input aria-label="Amount" aria-labelledby="external-label" />
      `,
    })
    class TestComponent {}

    const {container} = await render(TestComponent)

    const host = container.querySelector("q-number-input")
    expect(host).not.toHaveAttribute("aria-label")
    expect(host).not.toHaveAttribute("aria-labelledby")
    await expect
      .element(page.getByRole("spinbutton", {name: "External label"}))
      .toBeVisible()
  })

  test("number input control uses aria-label input", async () => {
    @Component({
      imports: [NumberInputModule],
      template: `
        <div q-number-input-root>
          <div q-number-input-input-group>
            <input aria-label="External label" q-number-input-input />
            <div q-number-input-control></div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    const input = page.getByRole("spinbutton", {name: "External label"})
    await expect.element(input).toHaveAttribute("aria-label", "External label")
  })

  test("number input control uses static aria-labelledby instead of the internal label reference", async () => {
    @Component({
      imports: [NumberInputModule],
      template: `
        <span id="external-label">External label</span>
        <div q-number-input-root>
          <label q-number-input-label>Internal label</label>
          <div q-number-input-input-group>
            <input aria-labelledby="external-label" q-number-input-input />
            <div q-number-input-control></div>
          </div>
        </div>
      `,
    })
    class TestComponent {}

    await render(TestComponent)

    await expect
      .element(page.getByRole("spinbutton", {name: "External label"}))
      .toBeVisible()
  })
})
