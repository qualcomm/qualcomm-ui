import {Component, input, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {AvatarModule} from "@qualcomm-ui/angular/avatar"

// @ts-expect-error vitest understands this import
import imgURL from "./avatar-man.png"

const testIds = {
  avatarContent: "avatar-content",
  avatarImage: "avatar-image",
} as const

@Component({
  imports: [AvatarModule],
  standalone: true,
  template: `
    <div q-avatar status="active" (stateChanged)="stateChanged.emit($event)">
      <img
        alt="John Doe"
        data-test-id="${testIds.avatarImage}"
        q-avatar-image
        [src]="src()"
      />
      <div data-test-id="${testIds.avatarContent}" q-avatar-content>JD</div>
      <div q-avatar-status></div>
    </div>
  `,
})
class AvatarDemoComponent {
  readonly src = input("")
  readonly stateChanged = output<{state: string | null}>()
}

@Component({
  imports: [AvatarModule],
  standalone: true,
  template: `
    <button type="button" (click)="src.set(invalidSrc)">Break image</button>
    <div q-avatar status="active">
      <img
        alt="John Doe"
        data-test-id="${testIds.avatarImage}"
        q-avatar-image
        [src]="src()"
      />
      <div data-test-id="${testIds.avatarContent}" q-avatar-content>JD</div>
      <div q-avatar-status></div>
    </div>
  `,
})
class AvatarSrcChangeComponent {
  readonly invalidSrc = "http://example.invalid"
  readonly src = signal(imgURL)
}

describe("avatar", () => {
  test("Content should not be displayed if an image is loaded", async () => {
    await render(AvatarDemoComponent, {inputs: {src: imgURL}})
    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .element(page.getByTestId(testIds.avatarContent))
      .not.toBeVisible()
  })

  test("Content should be displayed if an image can't be loaded", async () => {
    await render(AvatarDemoComponent, {inputs: {src: "http://example.invalid"}})
    await expect
      .element(page.getByTestId(testIds.avatarImage))
      .not.toBeVisible()
    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
  })

  test("`stateChanged` should emit loaded when the image loads", async () => {
    const stateChangedSpy = vi.fn()
    await render(AvatarDemoComponent, {
      inputs: {src: imgURL},
      on: {
        stateChanged: (event) => {
          stateChangedSpy(event)
        },
      },
    })

    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .poll(() => stateChangedSpy)
      .toHaveBeenCalledWith({state: "loaded"})
  })

  test("`stateChanged` should emit error when the image fails to load", async () => {
    const stateChangedSpy = vi.fn()
    await render(AvatarDemoComponent, {
      inputs: {src: "http://example.invalid"},
      on: {
        stateChanged: (event) => {
          stateChangedSpy(event)
        },
      },
    })

    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
    await expect
      .poll(() => stateChangedSpy)
      .toHaveBeenCalledWith({state: "error"})
  })

  test("changing `src` from valid to invalid swaps the image for fallback content", async () => {
    await render(AvatarSrcChangeComponent)

    await expect.element(page.getByTestId(testIds.avatarImage)).toBeVisible()
    await expect
      .element(page.getByTestId(testIds.avatarContent))
      .not.toBeVisible()

    await page.getByRole("button", {name: "Break image"}).click()

    await expect
      .element(page.getByTestId(testIds.avatarImage))
      .not.toBeVisible()
    await expect.element(page.getByTestId(testIds.avatarContent)).toBeVisible()
  })
})
