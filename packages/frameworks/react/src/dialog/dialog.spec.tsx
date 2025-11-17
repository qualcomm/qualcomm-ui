import {type ComponentPropsWithRef, useRef, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Button} from "@qualcomm-ui/react/button"
import {Portal} from "@qualcomm-ui/react-core/portal"

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
        <Dialog.Positioner>
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
})
