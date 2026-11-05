import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {FileInput} from "@qualcomm-ui/react/file-input"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const demoLabel = "Upload file"
const demoPlaceholder = "Select a file"
const demoClearLabel = "Clear file"
const demoErrorText = "Choose a PDF before continuing"
const demoFileName = "release-notes.pdf"

interface FileChangeDetails {
  acceptedFiles: File[]
  rejectedFiles: unknown[]
}

type FileChangeHandler = (details: FileChangeDetails) => void

interface TestPartProps {
  className?: string
  "data-test-id"?: string
}

interface TestHiddenInputProps extends TestPartProps {
  accept?: string
}

interface TestFileInputProps {
  controlProps?: TestPartProps
  disabled?: boolean
  displayProps?: TestPartProps
  errorText?: string
  hiddenInputProps?: TestHiddenInputProps
  invalid?: boolean
  onFileChange?: (details: FileChangeDetails) => void
  required?: boolean
}

function createDemoFile() {
  return new File(["release notes"], demoFileName, {
    type: "application/pdf",
  })
}

function assertLastFileChangeAcceptedFile(
  onFileChange: ReturnType<typeof vi.fn<FileChangeHandler>>,
) {
  expect(onFileChange).toHaveBeenCalled()

  const details = onFileChange.mock.lastCall?.[0]
  expect(details?.rejectedFiles).toEqual([])
  expect(details?.acceptedFiles).toHaveLength(1)
  expect(details?.acceptedFiles[0]?.name).toBe(demoFileName)
  expect(details?.acceptedFiles[0]?.type).toBe("application/pdf")
}

const tests: MultiComponentTestCase<TestFileInputProps>[] = [
  {
    composite({
      controlProps,
      displayProps,
      errorText,
      hiddenInputProps,
      ...rootProps
    } = {}) {
      return (
        <FileInput.Root {...rootProps}>
          <FileInput.Label>{demoLabel}</FileInput.Label>
          <FileInput.Control {...controlProps}>
            <FileInput.Display
              placeholder={demoPlaceholder}
              {...displayProps}
            />
            <FileInput.ClearTrigger />
          </FileInput.Control>
          <FileInput.HiddenInput {...hiddenInputProps} />
          {errorText ? (
            <FileInput.ErrorText>{errorText}</FileInput.ErrorText>
          ) : null}
        </FileInput.Root>
      )
    },
    simple({
      controlProps,
      displayProps,
      errorText,
      hiddenInputProps,
      ...rootProps
    } = {}) {
      return (
        <FileInput
          controlProps={controlProps}
          displayProps={displayProps}
          errorText={errorText}
          hiddenInputProps={hiddenInputProps}
          label={demoLabel}
          placeholder={demoPlaceholder}
          {...rootProps}
        />
      )
    },
    testCase: (getComponent) => {
      test("label is visible and labels the hidden file input", async () => {
        await render(getComponent())

        await expect.element(page.getByText(demoLabel)).toBeVisible()

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeInTheDocument()
        await expect.element(input).toHaveAttribute("type", "file")
      })

      test("shows placeholder text before a file is selected", async () => {
        await render(getComponent())

        await expect.element(page.getByText(demoPlaceholder)).toBeVisible()
      })

      test("selecting a file updates the display and calls onFileChange with accepted files", async () => {
        const onFileChange = vi.fn<FileChangeHandler>()
        const file = createDemoFile()

        await render(getComponent({onFileChange}))
        await page.getByLabelText(demoLabel).upload(file)

        await expect.element(page.getByText(demoFileName)).toBeVisible()
        assertLastFileChangeAcceptedFile(onFileChange)
      })

      test("clears the selected file with an inline clear trigger", async () => {
        const file = createDemoFile()

        await render(getComponent())
        await page.getByLabelText(demoLabel).upload(file)
        await expect.element(page.getByText(demoFileName)).toBeVisible()

        await page.getByRole("button", {name: demoClearLabel}).click()

        await expect.element(page.getByText(demoPlaceholder)).toBeVisible()
        await expect
          .element(page.getByText(demoFileName))
          .not.toBeInTheDocument()
      })

      test("disables the hidden input and control", async () => {
        await render(
          getComponent({
            controlProps: {
              "data-test-id": "file-input-control",
            },
            disabled: true,
          }),
        )

        await expect.element(page.getByLabelText(demoLabel)).toBeDisabled()
        await expect
          .element(page.getByTestId("file-input-control"))
          .toHaveAttribute("data-disabled")
      })

      test("marks the control focused when the dropzone receives focus", async () => {
        await render(
          getComponent({
            controlProps: {
              "data-test-id": "file-input-control",
            },
          }),
        )

        const control = page.getByTestId("file-input-control")
        await userEvent.tab()

        await expect.element(control).toHaveFocus()
        await expect.element(control).toHaveAttribute("data-focus")
      })

      test("marks the hidden input invalid and shows error text", async () => {
        await render(
          getComponent({
            errorText: demoErrorText,
            invalid: true,
          }),
        )

        await expect.element(page.getByText(demoErrorText)).toBeVisible()
        await expect
          .element(page.getByLabelText(demoLabel))
          .toHaveAttribute("aria-invalid", "true")
      })

      test("marks the hidden input required", async () => {
        await render(getComponent({required: true}))

        await expect.element(page.getByLabelText(demoLabel)).toBeRequired()
        await expect.element(page.getByText(demoLabel)).toBeVisible()
      })

      test("spreads props to the control, display, and hidden input", async () => {
        await render(
          getComponent({
            controlProps: {
              className: "custom-control",
              "data-test-id": "file-input-control",
            },
            displayProps: {
              className: "custom-display",
              "data-test-id": "file-input-display",
            },
            hiddenInputProps: {
              accept: ".pdf",
              className: "custom-input",
              "data-test-id": "file-input-hidden-input",
            },
          }),
        )

        const control = page.getByTestId("file-input-control")
        await expect.element(control).toBeVisible()
        await expect.element(control).toHaveClass("custom-control")

        const display = page.getByTestId("file-input-display")
        await expect.element(display).toBeVisible()
        await expect.element(display).toHaveClass("custom-display")

        const input = page.getByTestId("file-input-hidden-input")
        await expect.element(input).toHaveClass("custom-input")
        await expect.element(input).toHaveAttribute("accept", ".pdf")
      })
    },
  },
]

describe("FileInput", () => {
  runTests(tests)
})
