import {Component, input} from "@angular/core"
import {render} from "@testing-library/angular"
import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"

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
class AvatarDemoComponent {
  readonly src = input("")
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
})
