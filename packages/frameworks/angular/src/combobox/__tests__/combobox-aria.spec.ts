// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ComboboxModule} from "@qualcomm-ui/angular/combobox"
import {comboboxCollection} from "@qualcomm-ui/core/combobox"

const items = ["San Diego", "Nashville", "Denver"]

describe("Combobox ARIA labels", () => {
  test("simple combobox uses aria-labelledby instead of the internal label reference", async () => {
    @Component({
      imports: [ComboboxModule],
      template: `
        <span id="external-label">External label</span>
        <q-combobox
          aria-labelledby="external-label"
          label="Internal label"
          [collection]="collection"
        />
      `,
    })
    class TestComponent {
      readonly collection = comboboxCollection({items})
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "External label"}))
      .toBeVisible()
  })

  test("simple combobox forwards dynamic aria-label to the input", async () => {
    @Component({
      imports: [ComboboxModule],
      template: `
        <q-combobox [aria-label]="label()" [collection]="collection" />
        <button type="button" (click)="label.set('Destination')">
          Rename label
        </button>
      `,
    })
    class TestComponent {
      readonly collection = comboboxCollection({items})
      readonly label = signal("City")
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "City"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Rename label"}).click()

    await expect
      .element(page.getByRole("combobox", {name: "Destination"}))
      .toBeVisible()
  })

  test("simple combobox forwards dynamic aria-labelledby to the input", async () => {
    @Component({
      imports: [ComboboxModule],
      template: `
        <span id="city-label">City</span>
        <span id="destination-label">Destination</span>
        <q-combobox
          label="Internal label"
          [aria-labelledby]="labelledby()"
          [collection]="collection"
        />
        <button type="button" (click)="labelledby.set('destination-label')">
          Rename label
        </button>
      `,
    })
    class TestComponent {
      readonly collection = comboboxCollection({items})
      readonly labelledby = signal("city-label")
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "City"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Rename label"}).click()

    await expect
      .element(page.getByRole("combobox", {name: "Destination"}))
      .toBeVisible()
  })

  test("simple combobox does not retain aria label attributes on the host", async () => {
    @Component({
      imports: [ComboboxModule],
      template: `
        <span id="external-label">External label</span>
        <q-combobox
          aria-label="Search"
          aria-labelledby="external-label"
          [collection]="collection"
        />
      `,
    })
    class TestComponent {
      readonly collection = comboboxCollection({items})
    }

    const {container} = await render(TestComponent)

    const host = container.querySelector("q-combobox")
    expect(host).not.toHaveAttribute("aria-label")
    expect(host).not.toHaveAttribute("aria-labelledby")
    await expect
      .element(page.getByRole("combobox", {name: "External label"}))
      .toBeVisible()
  })

  test("combobox input uses aria-label input", async () => {
    @Component({
      imports: [ComboboxModule, PortalDirective],
      template: `
        <div q-combobox-root [collection]="collection">
          <div q-combobox-control>
            <input aria-label="External label" q-combobox-input />
            <button q-combobox-trigger></button>
          </div>
          <ng-template qPortal>
            <div q-combobox-positioner>
              <div q-combobox-content>
                @for (item of collection.items; track item) {
                  <div q-combobox-item [item]="item">
                    <span q-combobox-item-text>
                      {{ collection.stringifyItem(item) }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </ng-template>
        </div>
      `,
    })
    class TestComponent {
      readonly collection = comboboxCollection({items})
    }

    await render(TestComponent)

    const input = page.getByRole("combobox", {name: "External label"})
    await expect.element(input).toHaveAttribute("aria-label", "External label")
  })

  test("combobox input uses static aria-labelledby instead of the internal label reference", async () => {
    @Component({
      imports: [ComboboxModule, PortalDirective],
      template: `
        <span id="external-label">External label</span>
        <div q-combobox-root [collection]="collection">
          <label q-combobox-label>Internal label</label>
          <div q-combobox-control>
            <input aria-labelledby="external-label" q-combobox-input />
            <button q-combobox-trigger></button>
          </div>
          <ng-template qPortal>
            <div q-combobox-positioner>
              <div q-combobox-content>
                @for (item of collection.items; track item) {
                  <div q-combobox-item [item]="item">
                    <span q-combobox-item-text>
                      {{ collection.stringifyItem(item) }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </ng-template>
        </div>
      `,
    })
    class TestComponent {
      readonly collection = comboboxCollection({items})
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("combobox", {name: "External label"}))
      .toBeVisible()
  })
})
