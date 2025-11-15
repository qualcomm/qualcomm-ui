import {Component, input, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {SegmentedControlModule} from "@qualcomm-ui/angular/segmented-control"

import {type MultiComponentTest, runTests} from "~test-utils"

const globalItems = ["one", "two", "three"]

@Component({
  imports: [SegmentedControlModule],
  template: `
    <fieldset
      q-segmented-control
      [multiple]="multiple()"
      (valueChanged)="valueChanged.emit($event)"
    >
      @for (item of items; track item) {
        <label
          q-segmented-control-item
          [attr.data-test-id]="item"
          [text]="item"
          [value]="item"
        ></label>
      }
    </fieldset>
  `,
})
export class SimpleComponent {
  readonly items = globalItems
  readonly multiple = input<boolean>()
  readonly valueChanged = output<string[] | null | undefined>()
}

@Component({
  imports: [SegmentedControlModule],
  template: `
    <fieldset
      q-segmented-control
      [multiple]="multiple()"
      (valueChanged)="valueChanged.emit($event)"
    >
      @for (item of items; track item) {
        <label
          q-segmented-control-item-root
          [attr.data-test-id]="item"
          [value]="item"
        >
          <span q-segmented-control-item-text>{{ item }}</span>
          <input q-segmented-control-hidden-input />
        </label>
      }
    </fieldset>
  `,
})
export class CompositeComponent extends SimpleComponent {}

const item1 = page.getByTestId(globalItems[0])
const item2 = page.getByTestId(globalItems[1])
const item3 = page.getByTestId(globalItems[2])

const testCases: MultiComponentTest[] = [
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`Should default to single selection — ${component.name}`, async () => {
        await render(component)

        expect(item1).toHaveAttribute("data-state", "unchecked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item1.click()
        expect(item1).toHaveAttribute("data-state", "checked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item3.click()
        expect(item1).toHaveAttribute("data-state", "unchecked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`'multiple' should allow multiple selections — ${component.name}`, async () => {
        await render(component, {inputs: {multiple: true}})

        expect(item1).toHaveAttribute("data-state", "unchecked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item1.click()
        expect(item1).toHaveAttribute("data-state", "checked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "unchecked")

        await item3.click()
        expect(item1).toHaveAttribute("data-state", "checked")
        expect(item2).toHaveAttribute("data-state", "unchecked")
        expect(item3).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`Keyboard navigation — ${component.name}`, async () => {
        await render(component)

        expect(item1).not.toHaveAttribute("data-focus")
        await userEvent.tab()
        expect(item1).toHaveAttribute("data-focus")

        await userEvent.tab()
        await userEvent.tab()
        expect(item3).toHaveAttribute("data-focus")
        expect(item1).not.toHaveAttribute("data-focus")

        await userEvent.tab({shift: true})
        expect(item2).toHaveAttribute("data-focus")
        expect(item3).not.toHaveAttribute("data-focus")
      })
    },
  },
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`Keyboard selection — ${component.name}`, async () => {
        await render(component, {inputs: {multiple: true}})

        await userEvent.tab()
        await userEvent.keyboard("{Enter}")
        expect(item1).toHaveAttribute("data-state", "checked")

        await userEvent.tab()
        await userEvent.tab()
        await userEvent.keyboard("{Space}")
        expect(item3).toHaveAttribute("data-state", "checked")
        expect(item1).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`Can't unselect in single selection mode — ${component.name}`, async () => {
        await render(component, {inputs: {multiple: false}})

        await item2.click()
        expect(item2).toHaveAttribute("data-state", "checked")

        await item2.click()
        expect(item2).toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`'valueChanged' should be called when value changes (single mode) — ${component.name}`, async () => {
        const valueChangedSpy = vi.fn()
        await render(component, {
          on: {
            valueChanged: (event) => {
              valueChangedSpy(event)
            },
          },
        })
        await item2.click()
        expect(valueChangedSpy).toHaveBeenCalledWith([globalItems[1]])
        await item1.click()
        expect(valueChangedSpy).toHaveBeenCalledWith([globalItems[0]])
      })
    },
  },
  {
    composite: () => CompositeComponent,
    simple: () => SimpleComponent,
    testCase(component) {
      test(`'valueChanged' should be called when value changes (multiple mode) — ${component.name}`, async () => {
        const valueChangedSpy = vi.fn()
        await render(component, {
          inputs: {multiple: true},
          on: {
            valueChanged: (event) => {
              valueChangedSpy(event)
            },
          },
        })
        await item2.click()
        expect(valueChangedSpy).toHaveBeenCalledWith([globalItems[1]])
        await item1.click()
        expect(valueChangedSpy).toHaveBeenCalledWith([
          globalItems[1],
          globalItems[0],
        ])
      })
    },
  },
]

describe("segmented-control", () => {
  runTests(testCases)
})
