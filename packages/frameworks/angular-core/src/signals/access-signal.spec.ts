// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {accessSignal} from "./access-signal"

describe("accessSignal", () => {
  test("returns the value directly when given a plain value", async () => {
    @Component({
      template: `
        <span>{{ result }}</span>
      `,
    })
    class TestComponent {
      protected readonly result = accessSignal("hello")
    }

    await render(TestComponent)

    await expect.element(page.getByText("hello")).toBeVisible()
  })

  test("unwraps and returns the signal value when given a signal", async () => {
    @Component({
      template: `
        <span>{{ result }}</span>
      `,
    })
    class TestComponent {
      protected readonly result = accessSignal(signal("from signal"))
    }

    await render(TestComponent)

    await expect.element(page.getByText("from signal")).toBeVisible()
  })
})
