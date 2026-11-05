import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {ButtonModule} from "@qualcomm-ui/angular/button"

import {createToaster} from "./create-toaster"
import {ToastModule} from "./toast.module"

const labels = {
  actionButton: "Action",
  description: "Toast Description",
  pauseToast: "Pause Toast",
  resumeToast: "Resume Toast",
  showToast: "Show Toast",
  title: "Toast Title",
}

describe("Toast", () => {
  test("toast with custom duration", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          duration: 1000,
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await vi.advanceTimersByTimeAsync(500)
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await vi.advanceTimersByTimeAsync(4000)
    vi.runAllTimers()

    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  test("loading toast persists until manually dismissed", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          label: labels.title,
          type: "loading",
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await vi.advanceTimersByTimeAsync(500)
    await expect.element(page.getByText(labels.title)).toBeVisible()

    await vi.advanceTimersByTimeAsync(6000)

    await expect.element(page.getByText(labels.title)).toBeVisible()
    vi.useRealTimers()
  })

  test("pause and resume toast functionality", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
        <button
          q-button
          [disabled]="!toastVisible() || paused()"
          (click)="pauseToast()"
        >
          {{ labels.pauseToast }}
        </button>
        <button
          q-button
          [disabled]="!toastVisible() || !paused()"
          (click)="resumeToast()"
        >
          {{ labels.resumeToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster
      protected readonly paused = signal(false)
      protected readonly toastVisible = signal(false)

      showToast() {
        this.toaster.create({
          duration: 3000,
          label: labels.title,
          onStatusChange: (details) => {
            if (details.status === "visible") {
              this.toastVisible.set(true)
            } else if (details.status === "dismissing") {
              this.toastVisible.set(false)
            }
          },
        })
      }

      pauseToast() {
        this.toaster.pause()
        this.paused.set(true)
      }

      resumeToast() {
        this.toaster.resume()
        this.paused.set(false)
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await vi.advanceTimersByTimeAsync(500)
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
    vi.useFakeTimers()
    const toaster = createToaster({
      max: 2,
      placement: "bottom-end",
      removeDelay: 0,
    })

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToasts()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToasts() {
        this.toaster.create({
          duration: 10000,
          label: "Toast 1",
        })
        this.toaster.create({
          duration: 10000,
          label: "Toast 2",
        })
        this.toaster.create({
          duration: 10000,
          label: "Toast 3",
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()

    await vi.advanceTimersByTimeAsync(500)

    await expect.element(page.getByText("Toast 1")).toBeVisible()
    await expect.element(page.getByText("Toast 2")).toBeVisible()
    await expect.element(page.getByText("Toast 3")).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  test("overlapping toasts configuration", async () => {
    const toaster = createToaster({
      overlap: true,
      placement: "bottom-end",
      removeDelay: 0,
    })

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToasts()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToasts() {
        this.toaster.create({
          duration: 10000,
          label: "Overlapping Toast 1",
        })
        this.toaster.create({
          duration: 10000,
          label: "Overlapping Toast 2",
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()

    await expect.element(page.getByText("Overlapping Toast 1")).toBeVisible()
    await expect.element(page.getByText("Overlapping Toast 2")).toBeVisible()
  })

  test("custom children render prop", async () => {
    vi.useFakeTimers()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster">
          <ng-template let-toast q-toast-context>
            <div q-toast-root>
              <div q-toast-label>Custom: {{ toast.label }}</div>
              <div q-toast-description>{{ toast.description }}</div>
              <button q-toast-close-button></button>
            </div>
          </ng-template>
        </div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          description: labels.description,
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await vi.advanceTimersByTimeAsync(500)

    await expect
      .element(page.getByText(`Custom: ${labels.title}`))
      .toBeVisible()
    await expect.element(page.getByText(labels.description)).toBeVisible()
    await expect
      .element(page.getByLabelText("Dismiss notification"))
      .toBeVisible()
    vi.useRealTimers()
  })

  test("onStatusChange callback", async () => {
    vi.useFakeTimers()
    const statusSpy = vi.fn()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          duration: 1000,
          label: labels.title,
          onStatusChange: statusSpy,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()

    await vi.advanceTimersByTimeAsync(1200)

    expect(statusSpy).toHaveBeenCalledWith({status: "visible"})
    expect(statusSpy).toHaveBeenCalledWith({src: "timer", status: "dismissing"})
    expect(statusSpy).toHaveBeenCalledWith({status: "unmounted"})
    vi.useRealTimers()
  })

  test("individual toast components render correctly", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster">
          <ng-template let-toast q-toast-context>
            <div q-toast-root>
              <span q-toast-icon></span>
              <div q-toast-label>{{ toast.label }}</div>
              <div q-toast-description>{{ toast.description }}</div>
              @if (toast.action) {
                <button q-toast-action>
                  {{ toast.action.label }}
                </button>
              }
              <button q-toast-close-button></button>
            </div>
          </ng-template>
        </div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          action: {
            label: labels.actionButton,
            onClick: () => {},
          },
          description: labels.description,
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()

    await expect.element(page.getByText(labels.title)).toBeVisible()
    await expect.element(page.getByText(labels.description)).toBeVisible()
    await expect.element(page.getByText(labels.actionButton)).toBeVisible()
    await expect
      .element(page.getByLabelText("Dismiss notification"))
      .toBeVisible()
  })

  test("close button dismisses toast", async () => {
    vi.useFakeTimers()
    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = createToaster({
        placement: "bottom-end",
        removeDelay: 0,
      })

      showToast() {
        this.toaster.create({
          closable: true,
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await vi.advanceTimersByTimeAsync(1000)
    await expect.element(page.getByText(labels.title)).toBeVisible()

    const closeButton = page.getByLabelText("Dismiss notification")
    await closeButton.click()

    await vi.advanceTimersByTimeAsync(1000)
    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  test("action button invokes the action and dismisses the toast", async () => {
    const actionSpy = vi.fn()
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          action: {
            label: labels.actionButton,
            onClick: actionSpy,
          },
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByRole("button", {name: labels.showToast}).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    page.getByRole("button", {name: labels.actionButton}).element().click()

    expect(actionSpy).toHaveBeenCalledOnce()
    await expect.element(page.getByText(labels.title)).not.toBeInTheDocument()
  })

  test("updates an existing toast by id", async () => {
    const toaster = createToaster({placement: "bottom-end", removeDelay: 0})
    let toastId = ""

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="createToast()">Create toast</button>
        <button q-button (click)="updateToast()">Update toast</button>
      `,
    })
    class TestComponent {
      protected readonly toaster = toaster

      createToast() {
        toastId = this.toaster.create({
          description: "Initial description",
          duration: 10000,
          id: "toast-to-update",
          label: "Initial toast",
        })
      }

      updateToast() {
        this.toaster.update(toastId, {
          description: "Updated description",
          duration: 10000,
          label: "Updated toast",
        })
      }
    }

    await render(TestComponent)

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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="createQueuedToasts()">
          Create queued toasts
        </button>
        <button q-button (click)="removeFirstToast()">
          Remove first toast
        </button>
      `,
    })
    class TestComponent {
      protected readonly toaster = toaster

      createQueuedToasts() {
        firstToastId = this.toaster.create({
          duration: 10000,
          label: "Queued toast 1",
        })
        this.toaster.create({
          duration: 10000,
          label: "Queued toast 2",
        })
      }

      removeFirstToast() {
        this.toaster.remove(firstToastId)
      }
    }

    await render(TestComponent)

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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="createVisibleAndPendingToasts()">
          Create visible and pending toasts
        </button>
        <button q-button (click)="removeAllToasts()">Remove all toasts</button>
        <button q-button (click)="createLaterPair()">Create later pair</button>
        <button q-button (click)="removeLaterActiveToast()">
          Remove later active toast
        </button>
      `,
    })
    class TestComponent {
      protected readonly toaster = toaster

      createVisibleAndPendingToasts() {
        this.toaster.create({
          duration: Infinity,
          label: "Visible toast",
        })
        this.toaster.create({
          duration: Infinity,
          label: "Pending notification",
        })
      }

      removeAllToasts() {
        this.toaster.remove()
      }

      createLaterPair() {
        laterToastId = this.toaster.create({
          duration: Infinity,
          label: "Later visible toast",
        })
        this.toaster.create({
          duration: Infinity,
          label: "Later queued toast",
        })
      }

      removeLaterActiveToast() {
        this.toaster.remove(laterToastId)
      }
    }

    await render(TestComponent)

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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="createDismissableToasts()">
          Create dismissable toasts
        </button>
        <button q-button (click)="dismissAllToasts()">
          Dismiss all toasts
        </button>
      `,
    })
    class TestComponent {
      protected readonly toaster = toaster

      createDismissableToasts() {
        this.toaster.create({
          duration: 10000,
          label: "Dismissable toast 1",
        })
        this.toaster.create({
          duration: 10000,
          label: "Dismissable toast 2",
        })
      }

      dismissAllToasts() {
        this.toaster.dismiss()
      }
    }

    await render(TestComponent)

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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="startSave()">Start save</button>
        <button q-button (click)="resolveSave()">Resolve save</button>
      `,
    })
    class TestComponent {
      protected readonly toaster = toaster

      startSave() {
        const promiseResult = this.toaster.promise(
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
      }

      resolveSave() {
        resolveSave("profile")
      }
    }

    await render(TestComponent)

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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="startUpload()">Start upload</button>
        <button q-button (click)="failUpload()">Fail upload</button>
      `,
    })
    class TestComponent {
      protected readonly toaster = toaster

      startUpload() {
        this.toaster.promise(
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
      }

      failUpload() {
        resolveUpload(new Response(null, {status: 500}))
      }
    }

    await render(TestComponent)

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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          duration: 10000,
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByRole("button", {name: labels.showToast}).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()

    page.getByRole("status").element().focus()
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

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          duration: 2000,
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()
  })

  test("offsets configuration", async () => {
    const toaster = createToaster({
      offsets: "20px",
      placement: "bottom-end",
      removeDelay: 0,
    })

    @Component({
      imports: [ToastModule, ButtonModule],
      template: `
        <div q-toaster [toaster]="toaster"></div>
        <button q-button (click)="showToast()">
          {{ labels.showToast }}
        </button>
      `,
    })
    class TestComponent {
      protected readonly labels = labels
      protected readonly toaster = toaster

      showToast() {
        this.toaster.create({
          label: labels.title,
        })
      }
    }

    await render(TestComponent)

    await page.getByText(labels.showToast).click()
    await expect.element(page.getByText(labels.title)).toBeVisible()
  })
})
