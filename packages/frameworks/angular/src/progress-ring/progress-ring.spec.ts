import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {ProgressRingModule} from "@qualcomm-ui/angular/progress-ring"

import {type MultiComponentTest, runTests} from "~test-utils"

const testLabel = "Test Progress Ring"
const errorMessage = "Error occurred"

const testIds = {
  bar: "progress-ring-bar",
  circle: "progress-ring-circle",
  circleContainer: "progress-ring-circle-container",
  errorText: "progress-ring-error-text",
  label: "progress-ring-label",
  root: "progress-ring-root",
  track: "progress-ring-track",
  valueText: "progress-ring-value-text",
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root>
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring [label]="testLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`basic accessibility — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByLabelText(testLabel)).toBeVisible()
        await expect
          .element(page.getByLabelText(testLabel))
          .toHaveRole("progressbar")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root [value]="50">
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring [label]="testLabel()" [value]="50"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`progress ring with value — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "50")
        await expect.element(progressbar).toHaveAttribute("aria-valuemin", "0")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuemax", "100")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root [value]="100">
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring [label]="testLabel()" [value]="100"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`complete progress ring — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root>
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring [label]="testLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`indeterminate progress ring — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).not.toHaveAttribute("aria-valuenow")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root [max]="200" [min]="10" [value]="100">
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div
            q-progress-ring
            [label]="testLabel()"
            [max]="200"
            [min]="10"
            [value]="100"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`custom min/max values — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuenow", "100")
        await expect.element(progressbar).toHaveAttribute("aria-valuemin", "10")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuemax", "200")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root>
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring [label]="testLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`label renders — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(testLabel)).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root size="lg" [value]="50">
            <div q-progress-ring-circle-container>
              <ng-container *progressRingContext="let context">
                <div q-progress-ring-value-text>
                  {{ context.valuePercent }}%
                </div>
              </ng-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div
            q-progress-ring
            size="lg"
            [label]="testLabel()"
            [value]="50"
            [valueText]="valueText()"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
        protected readonly valueText = signal("50%")
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`value text renders — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("50%")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div>
            <div q-progress-ring-root [value]="value()">
              <div q-progress-ring-circle-container>
                <svg q-progress-ring-circle></svg>
              </div>
              <div q-progress-ring-label>{{ testLabel() }}</div>
            </div>
            <button type="button" (click)="value.set(75)">
              Update Progress
            </button>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
        protected readonly value = signal<number | undefined>(25)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div>
            <div q-progress-ring [label]="testLabel()" [value]="value()"></div>
            <button type="button" (click)="value.set(75)">
              Update Progress
            </button>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
        protected readonly value = signal<number | undefined>(25)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`controlled value updates aria-valuenow — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "25")
        await page.getByRole("button", {name: "Update Progress"}).click()
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "75")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring-root [defaultValue]="30">
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div q-progress-ring [defaultValue]="30" [label]="testLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`default value — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "30")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div invalid q-progress-ring-root>
            <div q-progress-ring-circle-container>
              <svg q-progress-ring-circle></svg>
            </div>
            <div q-progress-ring-label>{{ testLabel() }}</div>
            <div q-progress-ring-error-text>{{ errorMessage() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div
            invalid
            q-progress-ring
            [errorText]="errorMessage()"
            [label]="testLabel()"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`invalid progress ring with error text — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(errorMessage)).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressRingModule],
        template: `
          <div
            invalid
            q-progress-ring-root
            size="lg"
            [attr.data-test-id]="testIds.root"
            [value]="60"
          >
            <div
              q-progress-ring-circle-container
              [attr.data-test-id]="testIds.circleContainer"
            >
              <div
                q-progress-ring-value-text
                [attr.data-test-id]="testIds.valueText"
              >
                60%
              </div>
              <svg q-progress-ring-circle [attr.data-test-id]="testIds.circle">
                <circle
                  q-progress-ring-track
                  [attr.data-test-id]="testIds.track"
                />
                <circle q-progress-ring-bar [attr.data-test-id]="testIds.bar" />
              </svg>
            </div>
            <div q-progress-ring-label [attr.data-test-id]="testIds.label">
              {{ testLabel() }}
            </div>
            <div
              q-progress-ring-error-text
              [attr.data-test-id]="testIds.errorText"
            >
              {{ errorMessage() }}
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly testIds = testIds
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    testCase(component) {
      test(`renders all progress ring parts — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.circleContainer))
          .toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.valueText)).toBeVisible()
        await expect.element(page.getByTestId(testIds.circle)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.track))
          .toBeInTheDocument()
        await expect.element(page.getByTestId(testIds.bar)).toBeInTheDocument()
        await expect.element(page.getByTestId(testIds.errorText)).toBeVisible()
      })
    },
  },
]

describe("ProgressRing", () => {
  runTests(tests)
})
