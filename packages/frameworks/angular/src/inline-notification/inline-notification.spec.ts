import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {InlineNotificationModule} from "@qualcomm-ui/angular/inline-notification"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Demo Label"
const demoDescription = "Demo Description"
const closeButtonLabel = "Dismiss notification"

const testIds = {
  action: "inline-notification-action",
  closeButton: "inline-notification-close-button",
  description: "inline-notification-description",
  icon: "inline-notification-icon",
  label: "inline-notification-label",
  root: "inline-notification-root",
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification-root>
            <span q-inline-notification-icon></span>
            <div q-inline-notification-label>{{ demoLabel() }}</div>
            <div q-inline-notification-description>
              {{ demoDescription() }}
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoDescription = signal(demoDescription)
        protected readonly demoLabel = signal(demoLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div
            q-inline-notification
            [description]="demoDescription()"
            [label]="demoLabel()"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly demoDescription = signal(demoDescription)
        protected readonly demoLabel = signal(demoLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`renders label and description — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(demoLabel)).toBeVisible()
        await expect.element(page.getByText(demoDescription)).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification-root>
            <span q-inline-notification-icon></span>
            <div q-inline-notification-label>{{ demoLabel() }}</div>
            <button q-inline-notification-close-button></button>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = signal(demoLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div dismissable q-inline-notification [label]="demoLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = signal(demoLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`close button dismisses notification — ${component.name}`, async () => {
        await render(component)
        await expect.element(page.getByText(demoLabel)).toBeVisible()

        await page.getByLabelText(closeButtonLabel).click()

        await expect.element(page.getByText(demoLabel)).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification-root (dismissed)="dismissed.emit()">
            <span q-inline-notification-icon></span>
            <div q-inline-notification-label>{{ demoLabel() }}</div>
            <button q-inline-notification-close-button></button>
          </div>
        `,
      })
      class CompositeComponent {
        readonly dismissed = output<void>()
        protected readonly demoLabel = signal(demoLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div
            dismissable
            q-inline-notification
            [label]="demoLabel()"
            (dismissed)="dismissed.emit()"
          ></div>
        `,
      })
      class SimpleComponent {
        readonly dismissed = output<void>()
        protected readonly demoLabel = signal(demoLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`dismissed output fires when close button is clicked — ${component.name}`, async () => {
        const dismissed = vi.fn()
        await render(component, {
          on: {
            dismissed,
          },
        })

        expect(dismissed).not.toHaveBeenCalled()

        await page.getByLabelText(closeButtonLabel).click()

        await expect.poll(() => dismissed).toHaveBeenCalledTimes(1)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification-root [attr.data-test-id]="testIds.root">
            <span
              q-inline-notification-icon
              [attr.data-test-id]="testIds.icon"
            ></span>
            <div
              q-inline-notification-label
              [attr.data-test-id]="testIds.label"
            >
              {{ demoLabel() }}
            </div>
            <div
              q-inline-notification-description
              [attr.data-test-id]="testIds.description"
            >
              {{ demoDescription() }}
            </div>
            <a
              href="#action"
              q-inline-notification-action
              [attr.data-test-id]="testIds.action"
            >
              Action
            </a>
            <button
              q-inline-notification-close-button
              [attr.data-test-id]="testIds.closeButton"
            ></button>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoDescription = signal(demoDescription)
        protected readonly demoLabel = signal(demoLabel)
        protected readonly testIds = testIds
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification [attr.data-test-id]="testIds.root">
            <span
              q-inline-notification-icon
              [attr.data-test-id]="testIds.icon"
            ></span>
            <div
              q-inline-notification-label
              [attr.data-test-id]="testIds.label"
            >
              {{ demoLabel() }}
            </div>
            <div
              q-inline-notification-description
              [attr.data-test-id]="testIds.description"
            >
              {{ demoDescription() }}
            </div>
            <a
              href="#action"
              q-inline-notification-action
              [attr.data-test-id]="testIds.action"
            >
              Action
            </a>
            <button
              q-inline-notification-close-button
              [attr.data-test-id]="testIds.closeButton"
            ></button>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly demoDescription = signal(demoDescription)
        protected readonly demoLabel = signal(demoLabel)
        protected readonly testIds = testIds
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`renders notification parts — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.icon)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.description))
          .toBeVisible()
        await expect
          .element(page.getByRole("link", {name: "Action"}))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.closeButton))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification-root role="alert">
            <span q-inline-notification-icon></span>
            <div q-inline-notification-label>{{ demoLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = signal(demoLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification role="alert" [label]="demoLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = signal(demoLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`role='alert' announces assertively — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("alert")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification-root>
            <span q-inline-notification-icon></span>
            <div q-inline-notification-label>{{ demoLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly demoLabel = signal(demoLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [InlineNotificationModule],
        template: `
          <div q-inline-notification [label]="demoLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly demoLabel = signal(demoLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`role defaults to 'status' — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByRole("status")).toBeVisible()
      })
    },
  },
]

describe("InlineNotification", () => {
  runTests(tests)
})
