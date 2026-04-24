import {type ReactNode, useState} from "react"

import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {useControlledId} from "@qualcomm-ui/react-core/state"

import {useOptionalContentId} from "./use-optional-content-id"

type SlotProps = {children?: ReactNode; id?: string}

function Field({
  error,
  hint,
  label,
}: {
  error?: SlotProps
  hint?: SlotProps
  label: SlotProps
}) {
  const inputId = useControlledId()
  const labelId = useOptionalContentId(label?.children, label)
  const hintId = useOptionalContentId(hint?.children, hint)
  const errorId = useOptionalContentId(error?.children, error)

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div>
      {label?.children ? (
        <label htmlFor={inputId} id={labelId}>
          {label.children}
        </label>
      ) : null}
      <input
        aria-describedby={describedBy}
        aria-labelledby={labelId || undefined}
        id={inputId}
      />
      {hint?.children ? <p id={hintId}>{hint.children}</p> : null}
      {error?.children ? (
        <p id={errorId} role="alert">
          {error.children}
        </p>
      ) : null}
    </div>
  )
}

describe("useOptionalContentId (field integration)", () => {
  test("input references only rendered description slots", async () => {
    await render(
      <Field
        hint={{children: "We never share this."}}
        label={{children: "Email"}}
      />,
    )

    const input = page.getByRole("textbox")
    const hint = page.getByText("We never share this.")

    const hintId = hint.element().getAttribute("id")
    expect(hintId).toBeTruthy()

    await expect.element(input).toHaveAttribute("aria-describedby", hintId!)
  })

  test("input omits aria-describedby when no description slots are rendered", async () => {
    await render(<Field label={{children: "Email"}} />)

    const input = page.getByRole("textbox")
    expect(input.element().getAttribute("aria-describedby")).toBeNull()
  })

  test("toggling the hint slot updates aria-describedby without leaving a dangling reference", async () => {
    function Host() {
      const [show, setShow] = useState(true)
      return (
        <>
          <button onClick={() => setShow((s) => !s)}>toggle-hint</button>
          <Field
            hint={show ? {children: "Required"} : undefined}
            label={{children: "Email"}}
          />
        </>
      )
    }

    await render(<Host />)

    const input = page.getByRole("textbox")
    const hintId = page.getByText("Required").element().getAttribute("id")
    expect(hintId).toBeTruthy()
    await expect.element(input).toHaveAttribute("aria-describedby", hintId!)

    await page.getByRole("button", {name: "toggle-hint"}).click()

    expect(input.element().getAttribute("aria-describedby")).toBeNull()

    await page.getByRole("button", {name: "toggle-hint"}).click()
    const nextHintId = page.getByText("Required").element().getAttribute("id")
    expect(nextHintId).toBe(hintId)
    await expect.element(input).toHaveAttribute("aria-describedby", nextHintId!)
  })

  test("error appears alongside hint: aria-describedby lists both ids in order", async () => {
    function Host() {
      const [showError, setShowError] = useState(false)
      return (
        <>
          <button onClick={() => setShowError(true)}>show-error</button>
          <Field
            error={showError ? {children: "Too short"} : undefined}
            hint={{children: "At least 8 characters"}}
            label={{children: "Password"}}
          />
        </>
      )
    }

    await render(<Host />)

    const input = page.getByRole("textbox")
    const hintId = page
      .getByText("At least 8 characters")
      .element()
      .getAttribute("id")
    await expect.element(input).toHaveAttribute("aria-describedby", hintId!)

    await page.getByRole("button", {name: "show-error"}).click()

    const errorId = page.getByRole("alert").element().getAttribute("id")
    await expect
      .element(input)
      .toHaveAttribute("aria-describedby", `${hintId} ${errorId}`)
  })

  test("user-provided id on a slot is used verbatim in aria-describedby", async () => {
    await render(
      <Field
        hint={{children: "Required", id: "custom-hint-id"}}
        label={{children: "Email"}}
      />,
    )

    const input = page.getByRole("textbox")
    await expect
      .element(input)
      .toHaveAttribute("aria-describedby", "custom-hint-id")
    await expect
      .element(page.getByText("Required"))
      .toHaveAttribute("id", "custom-hint-id")
  })
})
