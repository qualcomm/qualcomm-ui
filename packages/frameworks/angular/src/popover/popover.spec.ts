import {Component, output, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {PopoverModule} from "@qualcomm-ui/angular/popover"

import {type MultiComponentTest, runTests} from "~test-utils"

const triggerText = "Click me"
const popoverLabel = "Popover Label"
const popoverDescription = "Popover Description"
const focusableLinkText = "Focusable Link"
const outsideButtonText = "Outside Button"
const closeButtonLabel = "Close Popover"

function trigger() {
  return page.getByRole("button", {name: triggerText})
}

function popoverLabelElement() {
  return page.getByText(popoverLabel)
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <div q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <div q-popover-description>{{ popoverDescription() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverDescription = signal(popoverDescription)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <div
            q-popover
            [description]="popoverDescription()"
            [label]="popoverLabel()"
          >
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverDescription = signal(popoverDescription)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`trigger click toggles open/closed — ${component.name}`, async () => {
        await render(component)

        await expect.element(popoverLabelElement()).not.toBeVisible()

        await trigger().click()
        await expect.element(popoverLabelElement()).toBeVisible()

        await trigger().click()
        await expect.element(popoverLabelElement()).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <div q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <div q-popover [label]="popoverLabel()">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`escape key closes popover — ${component.name}`, async () => {
        await render(component)

        await trigger().click()
        await expect.element(popoverLabelElement()).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect.element(popoverLabelElement()).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <button type="button">{{ outsideButtonText() }}</button>
          <div q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly outsideButtonText = signal(outsideButtonText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <button type="button">{{ outsideButtonText() }}</button>
          <div q-popover [label]="popoverLabel()">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly outsideButtonText = signal(outsideButtonText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`closes when clicking outside — ${component.name}`, async () => {
        await render(component)

        await trigger().click()
        await expect.element(popoverLabelElement()).toBeVisible()

        await page.getByRole("button", {name: outsideButtonText}).click()
        await expect.element(popoverLabelElement()).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <button type="button">{{ outsideButtonText() }}</button>
          <div q-popover-root [closeOnInteractOutside]="false">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly outsideButtonText = signal(outsideButtonText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <button type="button">{{ outsideButtonText() }}</button>
          <div
            q-popover
            [closeOnInteractOutside]="false"
            [label]="popoverLabel()"
          >
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly outsideButtonText = signal(outsideButtonText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`closeOnInteractOutside false keeps popover open — ${component.name}`, async () => {
        await render(component)

        await trigger().click()
        await expect.element(popoverLabelElement()).toBeVisible()

        await page.getByRole("button", {name: outsideButtonText}).click()
        await expect.element(popoverLabelElement()).toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <output>{{ open() ? "open" : "closed" }}</output>
          <div
            q-popover-root
            [open]="open()"
            (openChanged)="open.set($event.open)"
          >
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly open = signal(false)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <output>{{ open() ? "open" : "closed" }}</output>
          <div
            q-popover
            [label]="popoverLabel()"
            [open]="open()"
            (openChanged)="open.set($event.open)"
          >
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly open = signal(false)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`controlled open state with openChanged — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("status"))
          .toHaveTextContent("closed")
        await expect.element(popoverLabelElement()).not.toBeVisible()

        await trigger().click()
        await expect.element(page.getByRole("status")).toHaveTextContent("open")
        await expect.element(popoverLabelElement()).toBeVisible()

        await trigger().click()
        await expect
          .element(page.getByRole("status"))
          .toHaveTextContent("closed")
        await expect.element(popoverLabelElement()).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <div q-popover-root (openChanged)="openChangedHandler.emit($event)">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        readonly openChangedHandler = output<{open: boolean}>()

        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <div
            q-popover
            [label]="popoverLabel()"
            (openChanged)="openChangedHandler.emit($event)"
          >
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        readonly openChangedHandler = output<{open: boolean}>()

        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`openChanged callback fires with open and close values — ${component.name}`, async () => {
        const openChangedWatcher = vi.fn()
        await render(component, {
          on: {openChangedHandler: (event) => openChangedWatcher(event)},
        })

        await trigger().click()
        await expect
          .poll(() => openChangedWatcher)
          .toHaveBeenCalledWith({open: true})

        await userEvent.keyboard("{Escape}")
        await expect
          .poll(() => openChangedWatcher)
          .toHaveBeenLastCalledWith({open: false})
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <div defaultOpen q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <div defaultOpen q-popover [label]="popoverLabel()">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`defaultOpen renders with popover visible — ${component.name}`, async () => {
        await render(component)

        await expect.element(popoverLabelElement()).toBeVisible()

        await trigger().click()
        await expect.element(popoverLabelElement()).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <button type="button">{{ outsideButtonText() }}</button>
          <div modal q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <a href="#">{{ focusableLinkText() }}</a>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly outsideButtonText = signal(outsideButtonText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <button type="button">{{ outsideButtonText() }}</button>
          <div modal q-popover [label]="popoverLabel()">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly outsideButtonText = signal(outsideButtonText)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`modal traps focus inside popover — ${component.name}`, async () => {
        await render(component)

        await trigger().click()
        await expect.element(page.getByText(focusableLinkText)).toHaveFocus()

        await userEvent.tab()
        await expect
          .element(page.getByRole("button", {name: outsideButtonText}))
          .not.toHaveFocus()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <div q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <button q-popover-close-trigger type="button">
                    {{ closeButtonLabel() }}
                  </button>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly closeButtonLabel = signal(closeButtonLabel)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <div q-popover [label]="popoverLabel()">
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <button q-popover-close-trigger type="button">
              {{ closeButtonLabel() }}
            </button>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly closeButtonLabel = signal(closeButtonLabel)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`close trigger click closes popover — ${component.name}`, async () => {
        await render(component)

        await trigger().click()
        await expect.element(popoverLabelElement()).toBeVisible()

        await page.getByText(closeButtonLabel).click()
        await expect.element(popoverLabelElement()).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [PopoverModule, PortalDirective],
        template: `
          <div q-popover-root>
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <ng-template qPortal>
              <div q-popover-positioner>
                <div q-popover-content>
                  <div q-popover-label>{{ popoverLabel() }}</div>
                  <div q-popover-description>
                    {{ popoverDescription() }}
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        `,
      })
      class CompositeComponent {
        protected readonly popoverDescription = signal(popoverDescription)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return CompositeComponent
    },
    simple() {
      @Component({
        imports: [PopoverModule],
        template: `
          <div
            q-popover
            [description]="popoverDescription()"
            [label]="popoverLabel()"
          >
            <div q-popover-anchor>
              <button q-popover-trigger>{{ triggerText() }}</button>
            </div>
            <a href="#">{{ focusableLinkText() }}</a>
          </div>
        `,
      })
      class SimpleComponent {
        protected readonly focusableLinkText = signal(focusableLinkText)
        protected readonly popoverDescription = signal(popoverDescription)
        protected readonly popoverLabel = signal(popoverLabel)
        protected readonly triggerText = signal(triggerText)
      }
      return SimpleComponent
    },
    testCase(component) {
      test(`exposes dialog role with accessible name when open — ${component.name}`, async () => {
        await render(component)

        await expect.element(popoverLabelElement()).not.toBeVisible()

        await trigger().click()

        const dialog = page.getByRole("dialog", {name: popoverLabel})
        await expect.element(dialog).toBeVisible()
      })
    },
  },
]

describe("Popover", () => {
  runTests(tests)
})
