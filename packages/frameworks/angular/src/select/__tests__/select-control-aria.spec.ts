// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {SelectModule} from "@qualcomm-ui/angular/select"
import {selectCollection} from "@qualcomm-ui/core/select"

const items = ["San Diego", "Nashville", "Denver"]

describe("Select control ARIA overrides", () => {
  test("simple select forwards static aria-labelledby to the control", async () => {
    @Component({
      imports: [SelectModule],
      template: `
        <span id="external-label">External label</span>
        <q-select
          aria-labelledby="external-label"
          label="Internal label"
          placeholder="Select a city"
          [collection]="collection"
        />
      `,
    })
    class TestComponent {
      readonly collection = selectCollection({items})
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "External label"}))
      .toBeVisible()
  })

  test("simple select forwards dynamic aria-label to the control", async () => {
    @Component({
      imports: [SelectModule],
      template: `
        <q-select
          placeholder="Select a city"
          [aria-label]="label()"
          [collection]="collection"
        />
        <button (click)="label.set('Updated label')">Update label</button>
      `,
    })
    class TestComponent {
      readonly collection = selectCollection({items})
      readonly label = signal("Initial label")
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "Initial label"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Update label"}).click()

    await expect
      .element(page.getByRole("combobox", {name: "Updated label"}))
      .toBeVisible()
  })

  test("simple select forwards dynamic aria-labelledby to the control", async () => {
    @Component({
      imports: [SelectModule],
      template: `
        <span id="initial-label">Initial label</span>
        <span id="updated-label">Updated label</span>
        <q-select
          label="Internal label"
          placeholder="Select a city"
          [aria-labelledby]="labelledby()"
          [collection]="collection"
        />
        <button (click)="labelledby.set('updated-label')">Update label</button>
      `,
    })
    class TestComponent {
      readonly collection = selectCollection({items})
      readonly labelledby = signal("initial-label")
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "Initial label"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Update label"}).click()

    await expect
      .element(page.getByRole("combobox", {name: "Updated label"}))
      .toBeVisible()
  })

  test("simple select does not retain forwarded ARIA labels on the host", async () => {
    @Component({
      imports: [SelectModule],
      template: `
        <span id="external-label">External label</span>
        <q-select
          aria-label="Host label"
          aria-labelledby="external-label"
          placeholder="Select a city"
          [collection]="collection"
        />
      `,
    })
    class TestComponent {
      readonly collection = selectCollection({items})
    }

    const {container} = await render(TestComponent)

    const host = container.querySelector("q-select")
    expect(host).not.toHaveAttribute("aria-label")
    expect(host).not.toHaveAttribute("aria-labelledby")

    const control = page.getByRole("combobox", {name: "External label"})
    await expect.element(control).toHaveAttribute("aria-label", "Host label")
    await expect
      .element(control)
      .toHaveAttribute("aria-labelledby", "external-label")
  })

  test("control uses aria-label input", async () => {
    @Component({
      imports: [SelectModule],
      template: `
        <q-select placeholder="Select a city" [collection]="collection">
          <div aria-label="External label" q-select-control>
            <span q-select-value-text></span>
          </div>
        </q-select>
      `,
    })
    class TestComponent {
      readonly collection = selectCollection({items})
    }

    await render(TestComponent)

    const control = page.getByRole("combobox")
    await expect
      .element(control)
      .toHaveAttribute("aria-label", "External label")
  })

  test("control uses static aria-labelledby instead of the internal label reference", async () => {
    @Component({
      imports: [SelectModule],
      template: `
        <span id="external-label">External label</span>
        <q-select placeholder="Select a city" [collection]="collection">
          <div q-select-label>Internal label</div>
          <div aria-labelledby="external-label" q-select-control>
            <span q-select-value-text></span>
          </div>
        </q-select>
      `,
    })
    class TestComponent {
      readonly collection = selectCollection({items})
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "External label"}))
      .toBeVisible()
  })
})
