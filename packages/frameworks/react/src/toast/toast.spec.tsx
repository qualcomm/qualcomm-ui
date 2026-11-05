import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

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

    await render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    const closeButton = page.getByLabelText("Dismiss notification")
    await closeButton.click()

    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
  })

  test("action button invokes the action and dismisses the toast", async () => {
    const actionSpy = vi.fn()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                action: {
                  label: labels.actionButton,
                  onClick: actionSpy,
                },
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: labels.showToast}).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await page.getByRole("button", {name: labels.actionButton}).click()

    expect(actionSpy).toHaveBeenCalledOnce()
    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
  })

  test("updates an existing toast by id", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})
    let toastId = ""

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toastId = toaster.create({
                description: "Initial description",
                duration: 10000,
                id: "toast-to-update",
                label: "Initial toast",
              })
            }}
          >
            Create toast
          </Button>
          <Button
            onClick={() =>
              toaster.update(toastId, {
                description: "Updated description",
                duration: 10000,
                label: "Updated toast",
              })
            }
          >
            Update toast
          </Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: "Create toast"}).click()
    await expect.element(page.getByText("Initial toast")).toBeVisible()
    await expect.element(page.getByText("Initial description")).toBeVisible()

    await page.getByRole("button", {name: "Update toast"}).click()

    await expect.element(page.getByText("Updated toast")).toBeVisible()
    await expect.element(page.getByText("Updated description")).toBeVisible()
    await expect
      .element(page.getByText("Initial toast"))
      .not.toBeInTheDocument()
  })

  test("removing a visible toast renders the next queued toast", async () => {
    const toaster = createToaster({
      max: 1,
      placement: "bottom-end",
      removeDelay: 0,
    })
    let firstToastId = ""

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              firstToastId = toaster.create({
                duration: 10000,
                label: "Queued toast 1",
              })
              toaster.create({
                duration: 10000,
                label: "Queued toast 2",
              })
            }}
          >
            Create queued toasts
          </Button>
          <Button onClick={() => toaster.remove(firstToastId)}>
            Remove first toast
          </Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: "Create queued toasts"}).click()
    await expect.element(page.getByText("Queued toast 1")).toBeVisible()
    await expect
      .element(page.getByText("Queued toast 2"))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "Remove first toast"}).click()

    await expect
      .element(page.getByText("Queued toast 1"))
      .not.toBeInTheDocument()
    await expect.element(page.getByText("Queued toast 2")).toBeVisible()
  })

  test("remove without an id clears visible and queued toasts", async () => {
    const toaster = createToaster({
      max: 1,
      placement: "bottom-end",
      removeDelay: 0,
    })
    let laterToastId = ""

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toaster.create({
                duration: Infinity,
                label: "Visible toast",
              })
              toaster.create({
                duration: Infinity,
                label: "Pending notification",
              })
            }}
          >
            Create visible and pending toasts
          </Button>
          <Button onClick={() => toaster.remove()}>Remove all toasts</Button>
          <Button
            onClick={() => {
              laterToastId = toaster.create({
                duration: Infinity,
                label: "Later visible toast",
              })
              toaster.create({
                duration: Infinity,
                label: "Later queued toast",
              })
            }}
          >
            Create later pair
          </Button>
          <Button onClick={() => toaster.remove(laterToastId)}>
            Remove later active toast
          </Button>
        </>
      )
    }

    await render(<Component />)

    await page
      .getByRole("button", {name: "Create visible and pending toasts"})
      .click()
    await expect.element(page.getByText("Visible toast")).toBeVisible()
    await expect
      .element(page.getByText("Pending notification"))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "Remove all toasts"}).click()

    await expect
      .element(page.getByText("Visible toast"))
      .not.toBeInTheDocument()
    await expect
      .element(page.getByText("Pending notification"))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "Create later pair"}).click()
    await expect.element(page.getByText("Later visible toast")).toBeVisible()
    await expect
      .element(page.getByText("Later queued toast"))
      .not.toBeInTheDocument()

    await page.getByRole("button", {name: "Remove later active toast"}).click()

    await expect
      .element(page.getByText("Later visible toast"))
      .not.toBeInTheDocument()
    await expect.element(page.getByText("Later queued toast")).toBeVisible()
    await expect
      .element(page.getByText("Pending notification"))
      .not.toBeInTheDocument()
  })

  test("dismiss without an id dismisses all visible toasts", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toaster.create({
                duration: 10000,
                label: "Dismissable toast 1",
              })
              toaster.create({
                duration: 10000,
                label: "Dismissable toast 2",
              })
            }}
          >
            Create dismissable toasts
          </Button>
          <Button onClick={() => toaster.dismiss()}>Dismiss all toasts</Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: "Create dismissable toasts"}).click()
    await expect.element(page.getByText("Dismissable toast 1")).toBeVisible()
    await expect.element(page.getByText("Dismissable toast 2")).toBeVisible()

    await page.getByRole("button", {name: "Dismiss all toasts"}).click()

    await expect
      .element(page.getByText("Dismissable toast 1"))
      .not.toBeInTheDocument()
    await expect
      .element(page.getByText("Dismissable toast 2"))
      .not.toBeInTheDocument()
  })

  test("promise toast updates from loading to success and unwraps the result", async () => {
    const finallySpy = vi.fn()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})
    let resolveSave: (value: string) => void = () => {}
    let unwrapSave: () => Promise<string> = () =>
      Promise.reject(new Error("Save has not started"))

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              const promiseResult = toaster.promise(
                () =>
                  new Promise<string>((resolve) => {
                    resolveSave = resolve
                  }),
                {
                  finally: finallySpy,
                  loading: {label: "Saving profile"},
                  success: (name) => ({label: `Saved ${name}`}),
                },
              )

              if (promiseResult) {
                unwrapSave = promiseResult.unwrap
              }
            }}
          >
            Start save
          </Button>
          <Button onClick={() => resolveSave("profile")}>Resolve save</Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: "Start save"}).click()
    await expect.element(page.getByText("Saving profile")).toBeVisible()

    await page.getByRole("button", {name: "Resolve save"}).click()

    await expect.element(page.getByText("Saved profile")).toBeVisible()
    await expect
      .element(page.getByText("Saving profile"))
      .not.toBeInTheDocument()
    await expect(unwrapSave()).resolves.toBe("profile")
    expect(finallySpy).toHaveBeenCalledOnce()
  })

  test("promise toast renders error state for non-ok responses", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})
    let resolveUpload: (value: Response) => void = () => {}

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() => {
              toaster.promise(
                () =>
                  new Promise<Response>((resolve) => {
                    resolveUpload = resolve
                  }),
                {
                  error: (response: Response) => ({
                    label: `Upload failed with ${response.status}`,
                  }),
                  loading: {label: "Uploading file"},
                },
              )
            }}
          >
            Start upload
          </Button>
          <Button
            onClick={() => resolveUpload(new Response(null, {status: 500}))}
          >
            Fail upload
          </Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: "Start upload"}).click()
    await expect.element(page.getByText("Uploading file")).toBeVisible()

    await page.getByRole("button", {name: "Fail upload"}).click()

    await expect.element(page.getByText("Upload failed with 500")).toBeVisible()
    await expect
      .element(page.getByText("Uploading file"))
      .not.toBeInTheDocument()
  })

  test("pressing Escape on a focused toast dismisses it", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    function Component() {
      return (
        <>
          <Toaster toaster={toaster} />
          <Button
            onClick={() =>
              toaster.create({
                duration: 10000,
                label: labels.title,
              })
            }
          >
            {labels.showToast}
          </Button>
        </>
      )
    }

    await render(<Component />)

    await page.getByRole("button", {name: labels.showToast}).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await page.getByRole("status").click()
    await expect.element(page.getByRole("status")).toHaveFocus()

    await userEvent.keyboard("{Escape}")

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

    await render(<Component />)

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

    await render(<Component />)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()
  })
})
