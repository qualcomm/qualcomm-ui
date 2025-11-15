import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

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
