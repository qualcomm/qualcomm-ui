import {type ComponentPropsWithRef, useRef, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react/button"

import {Dialog, type DialogRootProps} from "./index"

const labels = {
  closeButton: "Close",
  confirmButton: "Confirm",
  description: "Description",
  openButton: "Open Dialog",
  outerButton: "Outer Button",
  title: "Title",
}

const testIds = {
  content: "dialog-content",
  positioner: "dialog-positioner",
  shortcutBackdrop: "shortcut-dialog-backdrop",
  shortcutContent: "shortcut-dialog-content",
  shortcutPositioner: "shortcut-dialog-positioner",
}

interface Props extends Partial<DialogRootProps> {
  confirmButtonProps?: ComponentPropsWithRef<"button">
  contentProps?: ComponentPropsWithRef<"div">
}

function SimpleDialog({confirmButtonProps, contentProps, ...props}: Props) {
  return (
    <Dialog.Root {...props}>
      <Button>{labels.outerButton}</Button>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          {labels.openButton}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner data-test-id={testIds.positioner}>
          <Dialog.Content data-test-id={testIds.content} {...contentProps}>
            <Dialog.Body>
              <Dialog.Heading>{labels.title}</Dialog.Heading>
              <Dialog.CloseButton aria-label={labels.closeButton} />
              <Dialog.Description>{labels.description}</Dialog.Description>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger>
                <Button
                  emphasis="primary"
                  size="sm"
                  variant="fill"
                  {...confirmButtonProps}
                >
                  {labels.confirmButton}
                </Button>
              </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

function ShortcutDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button emphasis="primary" variant="fill">
          {labels.openButton}
        </Button>
      </Dialog.Trigger>
      <Dialog.FloatingPortal
        backdropProps={{"data-test-id": testIds.shortcutBackdrop}}
        contentProps={{"data-test-id": testIds.shortcutContent}}
        positionerProps={{"data-test-id": testIds.shortcutPositioner}}
      >
        <Dialog.Body>
          <Dialog.Heading>{labels.title}</Dialog.Heading>
          <Dialog.CloseButton aria-label={labels.closeButton} />
          <Dialog.Description>{labels.description}</Dialog.Description>
        </Dialog.Body>
      </Dialog.FloatingPortal>
    </Dialog.Root>
  )
}

function assertVisible() {
  return expect.element(page.getByTestId(testIds.content)).toBeVisible()
}

function assertHidden() {
  return expect.element(page.getByTestId(testIds.content)).not.toBeVisible()
}

describe("Dialog", () => {
  test("controlled state", async () => {
    const spy = vi.fn()
    function ControlledState() {
      const [open, setOpen] = useState<boolean>(true)
      const handleOpenChange = (open: boolean) => {
        spy(open)
        setOpen(open)
      }
      return <SimpleDialog onOpenChange={handleOpenChange} open={open} />
    }
    await render(<ControlledState />)

    await assertVisible()
    await userEvent.click(page.getByLabelText(labels.closeButton))
    await assertHidden()
    expect(spy).toHaveBeenLastCalledWith(false)
  })

  test("restoreFocus", async () => {
    await render(<SimpleDialog restoreFocus />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await page.getByLabelText(labels.closeButton).click()
    await assertHidden()
    await expect.element(page.getByText(labels.openButton)).toHaveFocus()
  })

  test("restoreFocus: false", async () => {
    await render(<SimpleDialog restoreFocus={false} />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await page.getByLabelText(labels.closeButton).click()
    await assertHidden()
    await expect.element(page.getByText(labels.openButton)).not.toHaveFocus()
  })

  test("trapFocus, initialFocusEl", async () => {
    function Component() {
      const buttonRef = useRef<HTMLButtonElement>(null)

      return (
        <SimpleDialog
          confirmButtonProps={{ref: buttonRef}}
          initialFocusEl={() => buttonRef.current}
          trapFocus
        />
      )
    }

    await render(<Component />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await expect.element(page.getByText(labels.confirmButton)).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByLabelText(labels.closeButton)).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByText(labels.confirmButton)).toHaveFocus()
  })

  test("closeOnEscape", async () => {
    await render(<SimpleDialog closeOnEscape />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await userEvent.keyboard("{Escape}")
    await assertHidden()
  })

  test("closeOnEscape: false", async () => {
    await render(<SimpleDialog closeOnEscape={false} />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await userEvent.keyboard("{Escape}")
    // the open state applies immediately on close, which we need to check because
    // of the animation.
    await expect
      .element(page.getByTestId(testIds.content))
      .toHaveAttribute("data-state", "open")
    await assertVisible()
  })

  test("trigger opens dialog", async () => {
    await render(<SimpleDialog />)

    await assertHidden()
    await page.getByText(labels.openButton).click()
    await assertVisible()
  })

  test("defaultOpen", async () => {
    await render(<SimpleDialog defaultOpen />)

    await assertVisible()
  })

  test("onOpenChange callback", async () => {
    const spy = vi.fn()
    await render(<SimpleDialog onOpenChange={spy} />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    expect(spy).toHaveBeenLastCalledWith(true)

    await page.getByLabelText(labels.closeButton).click()
    await assertHidden()
    expect(spy).toHaveBeenLastCalledWith(false)
  })

  test("closeOnInteractOutside", async () => {
    await render(<SimpleDialog />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    // The positioner is the full-screen overlay layered above the backdrop that
    // a user sees as the "backdrop"; clicking it fires the interact-outside event.
    await page.getByTestId(testIds.positioner).click({position: {x: 5, y: 5}})
    await assertHidden()
  })

  test("closeOnInteractOutside: false", async () => {
    await render(<SimpleDialog closeOnInteractOutside={false} />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await page.getByTestId(testIds.positioner).click({position: {x: 5, y: 5}})
    await assertVisible()
  })

  test("CloseTrigger closes dialog", async () => {
    await render(<SimpleDialog />)

    await page.getByText(labels.openButton).click()
    await assertVisible()
    await page.getByText(labels.confirmButton).click()
    await assertHidden()
  })

  test("exposes dialog role and accessible name/description", async () => {
    await render(<SimpleDialog defaultOpen />)

    const dialog = page.getByRole("dialog")
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleName(labels.title)
    await expect.element(dialog).toHaveAccessibleDescription(labels.description)
  })

  test("FloatingPortal renders an accessible dialog and closes on outside interaction", async () => {
    await render(<ShortcutDialog />)

    await expect
      .element(page.getByTestId(testIds.shortcutContent))
      .not.toBeVisible()
    await page.getByText(labels.openButton).click()

    const dialog = page.getByRole("dialog", {name: labels.title})
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleDescription(labels.description)
    await expect
      .element(page.getByTestId(testIds.shortcutBackdrop))
      .toBeVisible()

    await page
      .getByTestId(testIds.shortcutPositioner)
      .click({position: {x: 5, y: 5}})
    await expect
      .element(page.getByTestId(testIds.shortcutContent))
      .not.toBeVisible()
  })

  test("Context render prop reflects whether the dialog is open", async () => {
    await render(
      <Dialog.Root>
        <Dialog.Context>
          {(dialog) => (
            <p>{dialog.open ? "Dialog is open" : "Dialog is closed"}</p>
          )}
        </Dialog.Context>
        <Dialog.Trigger>
          <Button>{labels.openButton}</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Body>
                <Dialog.Heading>{labels.title}</Dialog.Heading>
                <Dialog.CloseButton aria-label={labels.closeButton} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>,
    )

    await expect.element(page.getByText("Dialog is closed")).toBeVisible()
    await page.getByText(labels.openButton).click()
    await expect.element(page.getByText("Dialog is open")).toBeVisible()
    await page.getByLabelText(labels.closeButton).click()
    await expect.element(page.getByText("Dialog is closed")).toBeVisible()
  })

  const emphases: NonNullable<DialogRootProps["emphasis"]>[] = [
    "neutral",
    "info",
    "success",
    "warning",
    "danger",
  ]

  for (const emphasis of emphases) {
    test(`IndicatorIcon renders a status icon for ${emphasis} emphasis`, async () => {
      await render(
        <Dialog.Root defaultOpen emphasis={emphasis}>
          <Portal>
            <Dialog.Positioner>
              <Dialog.Content aria-label={`${emphasis} dialog`}>
                <Dialog.Body>
                  <Dialog.IndicatorIcon
                    aria-label={`${emphasis} status`}
                    role="img"
                  />
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>,
      )

      await expect
        .element(page.getByRole("img", {name: `${emphasis} status`}))
        .toBeVisible()
    })
  }

  test("IndicatorIcon renders a custom icon element when provided", async () => {
    await render(
      <Dialog.Root defaultOpen emphasis="danger">
        <Portal>
          <Dialog.Positioner>
            <Dialog.Content aria-label="Custom indicator dialog">
              <Dialog.Body>
                <Dialog.IndicatorIcon icon={<span>Custom status</span>} />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>,
    )

    await expect.element(page.getByText("Custom status")).toBeVisible()
  })
})
