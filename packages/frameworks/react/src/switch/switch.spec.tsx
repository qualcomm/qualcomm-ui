import {
  type FormEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  useState,
} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Switch} from "@qualcomm-ui/react/switch"

import {type MultiComponentTest, runTests} from "~test-utils/runner"

const demoLabel = "Demo Label"
const demoHint = "Demo Hint"
const demoError = "Demo Error"

const testIds = {
  control: "switch-control",
  errorText: "error-text",
  hiddenInput: "switch-hidden-input",
  label: "switch-label",
  root: "switch-root",
  thumb: "switch-thumb",
}

const customIds = {
  errorText: "custom-switch-error",
  hiddenInput: "custom-switch-input",
  hint: "custom-switch-hint",
  label: "custom-switch-label",
  root: "custom-switch-root",
}

function handleSubmit(
  event: FormEvent<HTMLFormElement>,
  onSubmit?: (data: Record<string, FormDataEntryValue>) => void,
) {
  event.preventDefault()
  onSubmit?.(Object.fromEntries(new FormData(event.currentTarget)))
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      return (
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("checked/unchecked state", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("toggles checked state with Space when focused", async () => {
        await render(getComponent())

        const input = page.getByLabelText(demoLabel)
        await userEvent.tab()
        await expect.element(input).toHaveFocus()

        await userEvent.keyboard("{Space}")
        await expect.element(input).toBeChecked()

        await userEvent.keyboard("{Space}")
        await expect.element(input).not.toBeChecked()
      })
    },
  },
  {
    composite(props) {
      return (
        <Switch.Root
          onCheckedChange={(checked) => props?.onCheckedChange?.(checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple(props) {
      return (
        <Switch
          label={demoLabel}
          onCheckedChange={(checked) => props?.onCheckedChange?.(checked)}
        />
      )
    },
    testCase: (getComponent) => {
      test("calls onCheckedChange with the next checked value", async () => {
        const onCheckedChange = vi.fn()
        await render(getComponent({onCheckedChange}))

        await page.getByText(demoLabel).click()
        expect(onCheckedChange).toHaveBeenNthCalledWith(1, true)

        await page.getByText(demoLabel).click()
        expect(onCheckedChange).toHaveBeenNthCalledWith(2, false)
      })
    },
  },
  {
    composite(props) {
      const onCheckedChange = props?.onCheckedChange

      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Switch.Root
            checked={checked}
            onCheckedChange={(nextChecked) => {
              onCheckedChange?.(nextChecked)
              setChecked(nextChecked)
            }}
          >
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
        )
      }

      return <Component />
    },
    simple(props) {
      const onCheckedChange = props?.onCheckedChange

      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Switch
            checked={checked}
            label={demoLabel}
            onCheckedChange={(nextChecked) => {
              onCheckedChange?.(nextChecked)
              setChecked(nextChecked)
            }}
          />
        )
      }

      return <Component />
    },
    testCase: (getComponent) => {
      test("updates controlled checked state from onCheckedChange", async () => {
        const onCheckedChange = vi.fn()
        await render(getComponent({onCheckedChange}))

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).not.toBeChecked()

        await page.getByText(demoLabel).click()
        await expect.element(input).toBeChecked()
        expect(onCheckedChange).toHaveBeenNthCalledWith(1, true)

        await page.getByText(demoLabel).click()
        await expect.element(input).not.toBeChecked()
        expect(onCheckedChange).toHaveBeenNthCalledWith(2, false)
      })
    },
  },
  {
    composite(props) {
      return (
        <Switch.Root
          onCheckedChange={(checked) => props?.onCheckedChange?.(checked)}
          readOnly
        >
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple(props) {
      return (
        <Switch
          label={demoLabel}
          onCheckedChange={(checked) => props?.onCheckedChange?.(checked)}
          readOnly
        />
      )
    },
    testCase: (getComponent) => {
      test("does not toggle or call onCheckedChange when read-only", async () => {
        const onCheckedChange = vi.fn()
        await render(getComponent({onCheckedChange}))

        const input = page.getByLabelText(demoLabel)
        await page.getByText(demoLabel).click()

        await expect.element(input).not.toBeChecked()
        expect(onCheckedChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite(props) {
      return (
        <>
          <Switch.Root
            onFocusChange={(focused) => props?.onFocusChange?.(focused)}
          >
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
          <button type="button">After</button>
        </>
      )
    },
    simple(props) {
      return (
        <>
          <Switch
            label={demoLabel}
            onFocusChange={(focused) => props?.onFocusChange?.(focused)}
          />
          <button type="button">After</button>
        </>
      )
    },
    testCase: (getComponent) => {
      test("reports focus changes for the hidden input", async () => {
        const onFocusChange = vi.fn()
        await render(getComponent({onFocusChange}))

        await userEvent.tab()
        await expect.element(page.getByLabelText(demoLabel)).toHaveFocus()
        expect(onFocusChange).toHaveBeenNthCalledWith(1, true)

        await userEvent.tab()
        await expect
          .element(page.getByRole("button", {name: "After"}))
          .toHaveFocus()
        expect(onFocusChange).toHaveBeenNthCalledWith(2, false)
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root disabled>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch disabled label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("disabled", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText(demoLabel)).toBeDisabled()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <fieldset disabled>
          <Switch.Root>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
        </fieldset>
      )
    },
    simple() {
      return (
        <fieldset disabled>
          <Switch label={demoLabel} />
        </fieldset>
      )
    },
    testCase: (getComponent) => {
      test("inherits disabled state from a disabled fieldset", async () => {
        await render(getComponent())

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeDisabled()
        await expect.element(input).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root data-test-id={testIds.root}>
          <Switch.HiddenInput data-test-id={testIds.hiddenInput} />
          <Switch.Control data-test-id={testIds.control}>
            <Switch.Thumb data-test-id={testIds.thumb} />
          </Switch.Control>
          <Switch.Label data-test-id={testIds.label}>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return (
        <Switch
          controlProps={
            {
              "data-test-id": testIds.control,
            } as HTMLAttributes<HTMLElement>
          }
          data-test-id={testIds.root}
          hiddenInputProps={
            {
              "data-test-id": testIds.hiddenInput,
            } as InputHTMLAttributes<HTMLInputElement>
          }
          label={demoLabel}
          labelProps={
            {
              "data-test-id": testIds.label,
            } as HTMLAttributes<HTMLElement>
          }
          thumbProps={
            {
              "data-test-id": testIds.thumb,
            } as HTMLAttributes<HTMLElement>
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        await render(getComponent())

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect.element(page.getByTestId(testIds.thumb)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.hiddenInput))
          .toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [checked, setChecked] = useState(true)
        return (
          <Switch.Root checked={checked} onCheckedChange={setChecked}>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [checked, setChecked] = useState(true)
        return (
          <Switch
            checked={checked}
            label={demoLabel}
            onCheckedChange={setChecked}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state - initially checked", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Switch.Root checked={checked} onCheckedChange={setChecked}>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Switch
            checked={checked}
            label={demoLabel}
            onCheckedChange={setChecked}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state - initially unchecked", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root defaultChecked>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch defaultChecked label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("default checked state", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
          <Switch.Hint>{demoHint}</Switch.Hint>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch hint={demoHint} label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("hint is visible", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoHint)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root id={customIds.root} invalid required>
          <Switch.HiddenInput id={customIds.hiddenInput} />
          <Switch.Control />
          <Switch.Label id={customIds.label}>{demoLabel}</Switch.Label>
          <Switch.Hint id={customIds.hint}>{demoHint}</Switch.Hint>
          <Switch.ErrorText id={customIds.errorText}>
            {demoError}
          </Switch.ErrorText>
        </Switch.Root>
      )
    },
    simple() {
      return (
        <Switch
          errorText={demoError}
          hint={demoHint}
          ids={customIds}
          invalid
          label={demoLabel}
          required
        />
      )
    },
    testCase: (getComponent) => {
      test("marks invalid switches as required and exposes error text", async () => {
        await render(getComponent())

        const input = page.getByRole("checkbox", {
          name: `${demoLabel} ${demoError}`,
        })
        await expect.element(input).toBeRequired()
        await expect.element(input).toHaveAttribute("aria-invalid", "true")
        await expect.element(input).toHaveAttribute("id", customIds.hiddenInput)
        await expect
          .element(input)
          .toHaveAttribute(
            "aria-labelledby",
            `${customIds.label} ${customIds.errorText}`,
          )
        await expect.element(page.getByText(demoError)).toBeVisible()
        await expect.element(page.getByText(demoHint)).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
          <Switch.Hint>{demoHint}</Switch.Hint>
          <Switch.ErrorText>{demoError}</Switch.ErrorText>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch errorText={demoError} hint={demoHint} label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("hides error text while valid", async () => {
        await render(getComponent())

        await expect.element(page.getByText(demoHint)).toBeVisible()
        await expect.element(page.getByText(demoError)).not.toBeVisible()
      })
    },
  },
  {
    composite(props) {
      return (
        <form onSubmit={(event) => handleSubmit(event, props?.onSubmit)}>
          <Switch.Root name="notifications" value="enabled">
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
          <button type="submit">Submit</button>
        </form>
      )
    },
    simple(props) {
      return (
        <form onSubmit={(event) => handleSubmit(event, props?.onSubmit)}>
          <Switch label={demoLabel} name="notifications" value="enabled" />
          <button type="submit">Submit</button>
        </form>
      )
    },
    testCase: (getComponent) => {
      test("submits the named value only while checked", async () => {
        const onSubmit = vi.fn()
        await render(getComponent({onSubmit}))

        await page.getByRole("button", {name: "Submit"}).click()
        expect(onSubmit).toHaveBeenNthCalledWith(1, {})

        await page.getByText(demoLabel).click()
        await page.getByRole("button", {name: "Submit"}).click()
        expect(onSubmit).toHaveBeenNthCalledWith(2, {
          notifications: "enabled",
        })
      })
    },
  },
  {
    composite() {
      return (
        <form>
          <Switch.Root defaultChecked>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
          <button type="reset">Reset</button>
        </form>
      )
    },
    simple() {
      return (
        <form>
          <Switch defaultChecked label={demoLabel} />
          <button type="reset">Reset</button>
        </form>
      )
    },
    testCase: (getComponent) => {
      test("resets to the initial checked state on form reset", async () => {
        await render(getComponent())

        const input = page.getByLabelText(demoLabel)
        await expect.element(input).toBeChecked()

        await page.getByText(demoLabel).click()
        await expect.element(input).not.toBeChecked()

        await page.getByRole("button", {name: "Reset"}).click()
        await expect.element(input).toBeChecked()
      })
    },
  },
]

describe("Switch", () => {
  runTests(tests)

  test("uses aria-label as the simple switch accessible name", async () => {
    await render(<Switch aria-label="Airplane mode" />)

    await expect
      .element(page.getByRole("checkbox", {name: "Airplane mode"}))
      .not.toBeChecked()
  })

  test("uses aria-labelledby as the simple switch accessible name", async () => {
    await render(
      <>
        <span id="external-switch-label">External switch label</span>
        <Switch aria-labelledby="external-switch-label" />
      </>,
    )

    await expect
      .element(page.getByRole("checkbox", {name: "External switch label"}))
      .not.toBeChecked()
  })
})
