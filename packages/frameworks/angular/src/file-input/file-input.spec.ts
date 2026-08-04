import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {FileInputModule} from "@qualcomm-ui/angular/file-input"
import type {FileDetails} from "@qualcomm-ui/core/file-upload"

import {type MultiComponentTest, runTests} from "~test-utils"

const demoLabel = "Upload file"
const demoPlaceholder = "Select a file"
const demoErrorText = "Choose a PDF before continuing"
const demoFileName = "release-notes.pdf"
const onFileChanged = vi.fn<(details: FileDetails) => void>()

function createDemoFile() {
  return new File(["release notes"], demoFileName, {
    type: "application/pdf",
  })
}

function assertLastFileChangeAcceptedFile() {
  expect(onFileChanged).toHaveBeenCalled()

  const details = onFileChanged.mock.lastCall?.[0]
  expect(details?.rejectedFiles).toEqual([])
  expect(details?.acceptedFiles).toHaveLength(1)
  expect(details?.acceptedFiles[0]?.name).toBe(demoFileName)
  expect(details?.acceptedFiles[0]?.type).toBe("application/pdf")
}

const testCases: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [FileInputModule],
        template: `
          <div
            accept=".pdf"
            class="w-72"
            q-file-input-root
            (fileChanged)="onFileChanged($event)"
          >
            <label q-file-input-label>{{ label }}</label>
            <div data-test-id="file-input-control" q-file-input-control>
              <span
                data-test-id="file-input-display"
                q-file-input-display
                [placeholder]="placeholder"
              ></span>
              <button q-file-input-clear-trigger></button>
            </div>
            <input
              data-test-id="file-input-hidden-input"
              q-file-input-hidden-input
            />
            <div q-file-input-error-text>{{ errorText }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly errorText = demoErrorText
        protected readonly label = demoLabel
        protected readonly onFileChanged = onFileChanged
        protected readonly placeholder = demoPlaceholder
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [FileInputModule],
        template: `
          <q-file-input
            accept=".pdf"
            class="w-72"
            [errorText]="errorText"
            [label]="label"
            [placeholder]="placeholder"
            (fileChanged)="onFileChanged($event)"
          />
        `,
      })
      class SimpleComponent {
        protected readonly errorText = demoErrorText
        protected readonly label = demoLabel
        protected readonly onFileChanged = onFileChanged
        protected readonly placeholder = demoPlaceholder
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`labels the hidden file input and shows the placeholder — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(demoLabel)).toBeVisible()
        await expect.element(page.getByText(demoPlaceholder)).toBeVisible()

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toHaveAttribute("type", "file")
        await expect.element(input).toHaveAttribute("accept", ".pdf")
      })

      test(`selecting a file updates the display and emits fileChanged — ${component.name}`, async () => {
        onFileChanged.mockClear()

        await render(component)
        await page.getByLabelText(demoLabel).upload(createDemoFile())

        await expect.element(page.getByText(demoFileName)).toBeVisible()
        assertLastFileChangeAcceptedFile()
      })

      test(`clears the selected file with the inline clear trigger — ${component.name}`, async () => {
        await render(component)
        await page.getByLabelText(demoLabel).upload(createDemoFile())
        await expect.element(page.getByText(demoFileName)).toBeVisible()

        await page.getByRole("button", {name: "Clear file"}).click()

        await expect.element(page.getByText(demoPlaceholder)).toBeVisible()
        await expect
          .element(page.getByText(demoFileName))
          .not.toBeInTheDocument()
      })

      test(`marks the control focused when tabbed to — ${component.name}`, async () => {
        await render(component)

        await userEvent.tab()

        const control =
          component.name === "CompositeComponent"
            ? page.getByTestId("file-input-control")
            : page.getByRole("button", {name: "dropzone"})

        await expect.element(control).toHaveFocus()
        await expect.element(control).toHaveAttribute("data-focus")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [FileInputModule],
        template: `
          <div disabled invalid q-file-input-root required>
            <label q-file-input-label>{{ label }}</label>
            <div data-test-id="file-input-control" q-file-input-control>
              <span q-file-input-display [placeholder]="placeholder"></span>
              <button q-file-input-clear-trigger></button>
            </div>
            <input q-file-input-hidden-input />
            <div q-file-input-error-text>{{ errorText }}</div>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly errorText = demoErrorText
        protected readonly label = demoLabel
        protected readonly placeholder = demoPlaceholder
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [FileInputModule],
        template: `
          <q-file-input
            disabled
            invalid
            required
            [errorText]="errorText"
            [label]="label"
            [placeholder]="placeholder"
          />
        `,
      })
      class SimpleComponent {
        protected readonly errorText = demoErrorText
        protected readonly label = demoLabel
        protected readonly placeholder = demoPlaceholder
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`reflects disabled, invalid, and required state — ${component.name}`, async () => {
        await render(component)

        await expect.element(page.getByText(demoErrorText)).toBeVisible()

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).toBeRequired()
        await expect.element(input).toHaveAttribute("aria-invalid", "true")

        const control =
          component.name === "CompositeComponent"
            ? page.getByTestId("file-input-control")
            : page.getByRole("button", {name: "dropzone"})
        await expect.element(control).toHaveAttribute("data-disabled")
      })
    },
  },
]

describe("FileInput", () => {
  runTests(testCases)
})
