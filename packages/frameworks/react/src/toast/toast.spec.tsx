import {useState} from "react"

import {page} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"

import {Button} from "@qualcomm-ui/react/button"
import {createToaster, Toast, Toaster} from "@qualcomm-ui/react/toast"

const labels = {
  actionButton: "Action",
  description: "Toast Description",
  pauseToast: "Pause Toast",
  resumeToast: "Resume Toast",
  showToast: "Show Toast",
  title: "Toast Title",
}

const testIds = {
  actionButton: "toast-action-button",
  closeButton: "toast-close-button",
  description: "toast-description",
  heading: "toast-heading",
  icon: "toast-icon",
  root: "toast-root",
  toaster: "toaster",
}

describe("Toast", () => {
  test("toast with custom duration", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                duration: 1000,
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await vi.advanceTimersByTimeAsync(4000)
    vi.runAllTimers()

    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  test("loading toast persists until manually dismissed", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                label: labels.title,
                removeDelay: 0,
                type: "loading",
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await vi.advanceTimersByTimeAsync(6000)

    await expect.element(page.getByText(labels.title)).toBeVisible()
    vi.useRealTimers()
  })

  test("pause and resume toast functionality", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      const [paused, setPaused] = useState(false)
      const [toastVisible, setToastVisible] = useState(false)

      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toaster.create({
                duration: 3000,
                label: labels.title,
                onStatusChange: (details) => {
                  if (details.status === "visible") {
                    setToastVisible(true)
                  } else if (details.status === "dismissing") {
                    setToastVisible(false)
                  }
                },
              })
            }}
          >
            {labels.showToast}
          </Button>
          <Button
            disabled={!toastVisible || paused}
            onClick={() => {
              toaster.pause()
              setPaused(true)
            }}
          >
            {labels.pauseToast}
          </Button>
          <Button
            disabled={!toastVisible || !paused}
            onClick={() => {
              toaster.resume()
              setPaused(false)
            }}
          >
            {labels.resumeToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await page.getByText(labels.pauseToast).click()

    await vi.advanceTimersByTimeAsync(4000)
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await page.getByText(labels.resumeToast).click()

    await vi.advanceTimersByTimeAsync(3200)
    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  test("respects max visible toasts limit", async () => {
    const toaster = createToaster({
      max: 2,
      placement: "bottom-end",
      removeDelay: 0,
    })

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toaster.create({
                duration: 10000,
                label: "Toast 1",
              })
              toaster.create({
                duration: 10000,
                label: "Toast 2",
              })
              toaster.create({
                duration: 10000,
                label: "Toast 3",
              })
            }}
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()

    await expect.element(page.getByText("Toast 1")).toBeVisible()
    await expect.element(page.getByText("Toast 2")).toBeVisible()
    await expect.element(page.getByText("Toast 3")).not.toBeInTheDocument()
  })

  test("overlapping toasts configuration", async () => {
    const toaster = createToaster({
      overlap: true,
      placement: "bottom-end",
      removeDelay: 0,
    })

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toaster.create({
                duration: 10000,
                label: "Overlapping Toast 1",
              })
              toaster.create({
                duration: 10000,
                label: "Overlapping Toast 2",
              })
            }}
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()

    await expect.element(page.getByText("Overlapping Toast 1")).toBeVisible()
    await expect.element(page.getByText("Overlapping Toast 2")).toBeVisible()
  })

  test("custom children render prop", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster}>
            {(toast) => (
              <Toast.Root key={toast.id} data-test-id={testIds.root}>
                <Toast.Label data-test-id={testIds.heading}>
                  Custom: {toast.label}
                </Toast.Label>
                <Toast.Description data-test-id={testIds.description}>
                  {toast.description}
                </Toast.Description>
                <Toast.CloseButton data-test-id={testIds.closeButton} />
              </Toast.Root>
            )}
          </Toaster>
          <Button
            onClick={() =>
              toaster.create({
                description: labels.description,
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()

    await expect.element(page.getByTestId(testIds.root)).toBeVisible()
    await expect.element(page.getByTestId(testIds.heading)).toBeVisible()
    await expect.element(page.getByTestId(testIds.description)).toBeVisible()
    await expect.element(page.getByTestId(testIds.closeButton)).toBeVisible()
    await expect
      .element(page.getByText(`Custom: ${labels.title}`))
      .toBeVisible()
  })

  test("onStatusChange callback", async () => {
    vi.useFakeTimers()
    const statusSpy = vi.fn()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                duration: 1000,
                label: labels.title,
                onStatusChange: statusSpy,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()

    await vi.advanceTimersByTimeAsync(1200)

    expect(statusSpy).toHaveBeenCalledWith({status: "visible"})
    expect(statusSpy).toHaveBeenCalledWith({src: "timer", status: "dismissing"})
    expect(statusSpy).toHaveBeenCalledWith({status: "unmounted"})
    vi.useRealTimers()
  })

  test("individual toast components render correctly", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster}>
            {(toast) => (
              <Toast.Root key={toast.id} data-test-id={testIds.root}>
                <Toast.Icon data-test-id={testIds.icon} />
                <Toast.Label data-test-id={testIds.heading}>
                  {toast.label}
                </Toast.Label>
                <Toast.Description data-test-id={testIds.description}>
                  {toast.description}
                </Toast.Description>
                {toast.action && (
                  <Toast.ActionButton
                    action={toast.action}
                    data-test-id={testIds.actionButton}
                  />
                )}
                <Toast.CloseButton data-test-id={testIds.closeButton} />
              </Toast.Root>
            )}
          </Toaster>
          <Button
            onClick={() =>
              toaster.create({
                action: {
                  label: labels.actionButton,
                  onClick: () => {},
                },
                description: labels.description,
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()

    await expect.element(page.getByTestId(testIds.root)).toBeVisible()
    await expect.element(page.getByTestId(testIds.icon)).toBeVisible()
    await expect.element(page.getByTestId(testIds.heading)).toBeVisible()
    await expect.element(page.getByTestId(testIds.description)).toBeVisible()
    await expect.element(page.getByTestId(testIds.actionButton)).toBeVisible()
    await expect.element(page.getByTestId(testIds.closeButton)).toBeVisible()
  })

  test("close button dismisses toast", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                closable: true,
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    const closeButton = page.getByLabelText("Dismiss notification")
    await closeButton.click()

    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
  })
})

describe("Toast - Toaster Configuration", () => {
  test("pauseOnPageIdle configuration", async () => {
    const toaster = createToaster({
      pauseOnPageIdle: true,
      placement: "bottom-end",
      removeDelay: 0,
    })

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                duration: 2000,
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()
  })

  test("offsets configuration", async () => {
    const toaster = createToaster({
      offsets: "20px",
      placement: "bottom-end",
      removeDelay: 0,
    })

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()
  })
})
