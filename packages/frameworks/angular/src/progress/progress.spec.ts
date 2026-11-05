import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {ProgressModule} from "@qualcomm-ui/angular/progress"

import {type MultiComponentTest, runTests} from "~test-utils"

const testLabel = "Test Progress"
const hintMessage = "Upload in progress"
const errorMessage = "Error occurred"

const testIds = {
  bar: "progress-bar",
  errorText: "progress-error-text",
  hint: "progress-hint",
  label: "progress-label",
  root: "progress-root",
  track: "progress-track",
  valueText: "progress-value-text",
}

const getBar = (container: Element) =>
  container.querySelector("[q-progress-bar]")

const tests: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root>
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress [label]="testLabel()"></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress-root [value]="50">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress [label]="testLabel()" [value]="50"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`progress with value — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "50")
        await expect.element(progressbar).toHaveAttribute("aria-valuemin", "0")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuemax", "100")
        await expect
          .element(progressbar)
          .toHaveAttribute("data-state", "loading")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root [value]="100">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress [label]="testLabel()" [value]="100"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`complete progress — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuenow", "100")
        await expect
          .element(progressbar)
          .toHaveAttribute("data-state", "complete")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root>
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress [label]="testLabel()"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`indeterminate progress — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).not.toHaveAttribute("aria-valuenow")
        await expect
          .element(progressbar)
          .toHaveAttribute("data-state", "indeterminate")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root [max]="200" [min]="10" [value]="50">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div
            q-progress
            [label]="testLabel()"
            [max]="200"
            [min]="10"
            [value]="50"
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
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "50")
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
        imports: [ProgressModule],
        template: `
          <div q-progress-root [value]="40">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
            <div q-progress-hint>{{ hintMessage() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly hintMessage = signal(hintMessage)
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div
            q-progress
            [hint]="hintMessage()"
            [label]="testLabel()"
            [value]="40"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly hintMessage = signal(hintMessage)
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`progress with hint text — ${component.name}`, async () => {
        await render(component)

        const progressbar = page.getByLabelText(testLabel)
        const hint = page.getByText(hintMessage)

        await expect.element(hint).toBeVisible()
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-describedby", hint.element().id)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div invalid q-progress-root [value]="40">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
            <div q-progress-hint>{{ hintMessage() }}</div>
            <div q-progress-error-text>{{ errorMessage() }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly hintMessage = signal(hintMessage)
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div
            invalid
            q-progress
            [errorText]="errorMessage()"
            [hint]="hintMessage()"
            [label]="testLabel()"
            [value]="40"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly hintMessage = signal(hintMessage)
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`progress hides hint text while invalid — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(errorMessage)).toBeVisible()
        await expect.element(page.getByText(hintMessage)).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div invalid q-progress-root>
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
            <div q-progress-error-text>{{ errorMessage() }}</div>
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
        imports: [ProgressModule],
        template: `
          <div
            invalid
            q-progress
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
      test(`invalid progress with error text — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(errorMessage)).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root [value]="75">
            <div q-progress-label>{{ testLabel() }}</div>
            <ng-container *progressContext="let context">
              <div q-progress-value-text>
                {{ context.value }}/{{ context.max }}
              </div>
            </ng-container>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div
            q-progress
            [label]="testLabel()"
            [value]="75"
            [valueText]="valueText()"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
        protected readonly valueText = signal("75/100")
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`progress with value text — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText("75/100")).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div>
            <div q-progress-root [value]="value()">
              <div q-progress-label>{{ testLabel() }}</div>
              <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div>
            <div q-progress [label]="testLabel()" [value]="value()"></div>
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
      test(`controlled progress value — ${component.name}`, async () => {
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
        imports: [ProgressModule],
        template: `
          <div q-progress-root [defaultValue]="30">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress [defaultValue]="30" [label]="testLabel()"></div>
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
        imports: [ProgressModule],
        template: `
          <div
            invalid
            q-progress-root
            [attr.data-test-id]="testIds.root"
            [value]="60"
          >
            <div q-progress-label [attr.data-test-id]="testIds.label">
              {{ testLabel() }}
            </div>
            <div q-progress-value-text [attr.data-test-id]="testIds.valueText">
              60%
            </div>
            <div q-progress-track [attr.data-test-id]="testIds.track">
              <div q-progress-bar [attr.data-test-id]="testIds.bar"></div>
            </div>
            <div q-progress-error-text [attr.data-test-id]="testIds.errorText">
              {{ errorMessage() }}
            </div>
            <div q-progress-hint [attr.data-test-id]="testIds.hint">
              {{ hintMessage() }}
            </div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly hintMessage = signal(hintMessage)
        protected readonly testIds = testIds
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div
            invalid
            q-progress
            [attr.data-test-id]="testIds.root"
            [value]="60"
          >
            <div q-progress-label [attr.data-test-id]="testIds.label">
              {{ testLabel() }}
            </div>
            <div q-progress-value-text [attr.data-test-id]="testIds.valueText">
              60%
            </div>
            <div q-progress-track [attr.data-test-id]="testIds.track">
              <div q-progress-bar [attr.data-test-id]="testIds.bar"></div>
            </div>
            <div q-progress-error-text [attr.data-test-id]="testIds.errorText">
              {{ errorMessage() }}
            </div>
            <div q-progress-hint [attr.data-test-id]="testIds.hint">
              {{ hintMessage() }}
            </div>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly errorMessage = signal(errorMessage)
        protected readonly hintMessage = signal(hintMessage)
        protected readonly testIds = testIds
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`renders progress parts — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.valueText)).toBeVisible()
        await expect.element(page.getByTestId(testIds.track)).toBeVisible()
        await expect.element(page.getByTestId(testIds.bar)).toBeVisible()
        await expect.element(page.getByTestId(testIds.errorText)).toBeVisible()
        await expect.element(page.getByTestId(testIds.hint)).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root [value]="50">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div q-progress [label]="testLabel()" [value]="50"></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`shimmer enabled by default — ${component.name}`, async () => {
        const {container} = await render(component)

        expect(getBar(container)).toHaveAttribute("data-shimmer")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root [shimmer]="false" [value]="50">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div
            q-progress
            [label]="testLabel()"
            [shimmer]="false"
            [value]="50"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`shimmer disabled — ${component.name}`, async () => {
        const {container} = await render(component)

        expect(getBar(container)).not.toHaveAttribute("data-shimmer")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root [shimmer]="true" [value]="50">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div
            q-progress
            [label]="testLabel()"
            [shimmer]="true"
            [value]="50"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`shimmer explicitly enabled — ${component.name}`, async () => {
        const {container} = await render(component)

        expect(getBar(container)).toHaveAttribute("data-shimmer")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div q-progress-root shimmer="false" [value]="50">
            <div q-progress-label>{{ testLabel() }}</div>
            <div q-progress-track></div>
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
        imports: [ProgressModule],
        template: `
          <div
            q-progress
            shimmer="false"
            [label]="testLabel()"
            [value]="50"
          ></div>
        `,
      })
      class SimpleComponent {
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`shimmer disabled via static attribute — ${component.name}`, async () => {
        const {container} = await render(component)

        expect(getBar(container)).not.toHaveAttribute("data-shimmer")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div>
            <div q-progress-root [shimmer]="shimmer()" [value]="50">
              <div q-progress-label>{{ testLabel() }}</div>
              <div q-progress-track></div>
            </div>
            <button type="button" (click)="shimmer.set(false)">
              Disable Shimmer
            </button>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly shimmer = signal(true)
        protected readonly testLabel = signal(testLabel)
      }

      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [ProgressModule],
        template: `
          <div>
            <div
              q-progress
              [label]="testLabel()"
              [shimmer]="shimmer()"
              [value]="50"
            ></div>
            <button type="button" (click)="shimmer.set(false)">
              Disable Shimmer
            </button>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly shimmer = signal(true)
        protected readonly testLabel = signal(testLabel)
      }

      return SimpleComponent
    },
    testCase(component) {
      test(`shimmer reacts to input changes — ${component.name}`, async () => {
        const {container} = await render(component)

        expect(getBar(container)).toHaveAttribute("data-shimmer")
        await page.getByRole("button", {name: "Disable Shimmer"}).click()
        expect(getBar(container)).not.toHaveAttribute("data-shimmer")
      })
    },
  },
]

describe("Progress", () => {
  runTests(tests)
})
