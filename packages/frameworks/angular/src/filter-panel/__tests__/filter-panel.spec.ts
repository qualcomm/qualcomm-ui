import {
  Component,
  computed,
  Directive,
  input,
  output,
  signal,
} from "@angular/core"
import {render} from "@testing-library/angular"
import {afterEach, describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {FilterPanelModule} from "@qualcomm-ui/angular/filter-panel"
import {FiltersModule, useFilterSet} from "@qualcomm-ui/angular/filters"
import type {
  FilterSetApplyMode,
  FilterSetCollectionResolver,
} from "@qualcomm-ui/core/filter-set"
import {
  dateFilter,
  defineFilters,
  type FilterOptionObject,
  type FilterValues,
  listFilter,
  rangeFilter,
  textFilter,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import type {QdsFilterPanelSize} from "@qualcomm-ui/qds-core/filter-panel"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {type MultiComponentTest, runTests} from "~test-utils"

function list<T extends FilterOptionObject | string>(items: T[]) {
  return new ListCollection<T>({items})
}

const users = list([
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
])

interface ChipsetNode {
  id: string
  nodes?: ChipsetNode[]
  text: string
}

const chipsets = createTreeCollection<ChipsetNode>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "x",
        nodes: [
          {id: "sc8480xp", text: "SC8480XP"},
          {id: "sc8380xp", text: "SC8380XP"},
        ],
        text: "Snapdragon X",
      },
    ],
    text: "",
  },
})

const filters = defineFilters({
  buildPath: textFilter({label: "Build path"}),
  chipset: treeFilter({collection: chipsets, label: "Chipset"}),
  duration: rangeFilter({label: "Duration", max: 10, min: 0}),
  mode: listFilter({
    collection: list([
      {label: "Debug", value: "debug"},
      {label: "Release", value: "release"},
    ]),
    label: "Mode",
  }),
  owner: listFilter({collection: users, label: "Owner"}),
  reviewer: listFilter({collection: users}),
  standard: listFilter({
    collection: list([
      {label: "Wi-Fi 6", value: "wifi6"},
      {label: "Wi-Fi 7", value: "wifi7"},
    ]),
    label: "Standard",
  }),
  status: listFilter({
    collection: list(["Failed", "Passed", "Queued"]),
    label: "Status",
  }),
  submitted: dateFilter({
    label: "Submitted",
    presets: [{label: "Last 7 days", value: "last7Days"}],
  }),
  user: listFilter({label: "User"}),
})

type Values = FilterValues<typeof filters>

/**
 * Inputs and outputs shared by the panel hosts. Each binding passes through to
 * the panel root, so tests configure the panel with `render` options.
 */
@Directive()
abstract class PanelHost {
  readonly filters = filters

  /**
   * Stands in for a definition looked up with an id that isn't in `filters`.
   */
  readonly missing: any = undefined

  readonly applyMode = input<FilterSetApplyMode>()
  readonly defaultValue = input<Values>()
  readonly getFilterCollection =
    input<FilterSetCollectionResolver<typeof filters>>()
  readonly getFilterLabel = input<(id: string) => string | undefined>()
  readonly size = input<QdsFilterPanelSize>()

  readonly draftValueChanged = output<Values>()
  readonly valueChanged = output<Values>()
}

function panelTemplate(content: string): string {
  return `
    <div
      q-filter-panel-root
      [applyMode]="applyMode()"
      [defaultValue]="defaultValue()"
      [filters]="filters"
      [getFilterCollection]="getFilterCollection()"
      [getFilterLabel]="getFilterLabel()"
      [size]="size()"
      (draftValueChanged)="draftValueChanged.emit($event)"
      (valueChanged)="valueChanged.emit($event)"
    >
      <div q-filter-panel-header>
        <h2 q-filter-panel-heading>
          Filters
          <span q-filter-panel-count></span>
        </h2>
        <button q-filter-panel-clear-button></button>
      </div>
      ${content}
      <div q-filter-panel-footer>
        <button q-filter-panel-apply-button></button>
      </div>
    </div>
  `
}

function createPanel(content: string) {
  @Component({
    imports: [FilterPanelModule, FiltersModule],
    template: panelTemplate(content),
  })
  class PanelComponent extends PanelHost {}
  return PanelComponent
}

const statusFilter = `
  <div q-filter-panel-filter [filter]="filters.status">
    <q-checkbox-group-filter />
  </div>
`

const triggerParts = `
  <span q-filter-panel-filter-label></span>
  <span q-filter-panel-filter-count></span>
  <span q-filter-panel-filter-indicator></span>
`

function compositeStatusFilter(
  rootAttrs = "",
  triggerContent = triggerParts,
): string {
  return `
    <div q-filter-panel-filter-root [filter]="filters.status" ${rootAttrs}>
      <button q-filter-panel-filter-trigger>${triggerContent}</button>
      <div q-filter-panel-filter-content>
        <q-checkbox-group-filter />
      </div>
    </div>
  `
}

function simpleStatusFilter(rootAttrs = "", content = ""): string {
  return `
    <div q-filter-panel-filter [filter]="filters.status" ${rootAttrs}>
      ${content}
      <q-checkbox-group-filter />
    </div>
  `
}

function filterIndicator(trigger: HTMLElement): HTMLElement | null {
  return trigger.querySelector<HTMLElement>("[q-filter-panel-filter-indicator]")
}

afterEach(() => {
  vi.restoreAllMocks()
})

const filterTests: MultiComponentTest[] = [
  {
    composite() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(compositeStatusFilter()),
      })
      class CompositeFilter extends PanelHost {}
      return CompositeFilter
    },
    simple() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(simpleStatusFilter()),
      })
      class SimpleFilter extends PanelHost {}
      return SimpleFilter
    },
    testCase(component) {
      test(`the trigger names the filter and collapses and expands its content — ${component.name}`, async () => {
        await render(component, {inputs: {defaultValue: {status: ["Failed"]}}})

        const trigger = page.getByRole("button", {name: "Status 1 selected"})
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
        await expect
          .element(page.getByRole("group", {name: "Status"}))
          .toBeVisible()

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
        await expect.element(page.getByText("Failed")).not.toBeVisible()

        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
        await expect.element(page.getByText("Failed")).toBeVisible()
      })

      test(`the indicator follows the open state — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: "Status"})
        await expect.element(trigger).toBeVisible()
        const indicator = filterIndicator(trigger.element() as HTMLElement)
        expect(indicator).not.toBeNull()
        await expect.element(indicator).toHaveAttribute("data-state", "open")
        await expect.element(indicator).toHaveAttribute("aria-hidden", "true")

        await trigger.click()
        await expect.element(indicator).toHaveAttribute("data-state", "closed")
      })

      test(`the filter count is hidden while the filter is empty — ${component.name}`, async () => {
        await render(component)

        const emptyTrigger = page.getByRole("button", {
          exact: true,
          name: "Status",
        })
        await expect.element(emptyTrigger).toBeVisible()
        await expect
          .element(emptyTrigger.getByLabelText("0 selected"))
          .toHaveAttribute("hidden")

        await page.getByText("Failed").click()
        await page.getByText("Queued").click()

        const trigger = page.getByRole("button", {name: "Status 2 selected"})
        await expect.element(trigger).toBeVisible()
        await expect
          .element(trigger.getByLabelText("2 selected"))
          .not.toHaveAttribute("hidden")
      })

      test(`the control is labelled by the filter label element — ${component.name}`, async () => {
        await render(component)

        const label = page.getByText("Status", {exact: true})
        const group = page.getByRole("group", {name: "Status"})
        await expect.element(group).toBeVisible()

        const labelId = label.element().id
        expect(labelId).toBeTruthy()
        await expect.element(group).toHaveAttribute("aria-labelledby", labelId)
        await expect.element(group).not.toHaveAttribute("aria-label")
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(compositeStatusFilter(`[defaultOpen]="false"`)),
      })
      class CompositeCollapsedFilter extends PanelHost {}
      return CompositeCollapsedFilter
    },
    simple() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(simpleStatusFilter(`[defaultOpen]="false"`)),
      })
      class SimpleCollapsedFilter extends PanelHost {}
      return SimpleCollapsedFilter
    },
    testCase(component) {
      test(`defaultOpen false renders the filter collapsed — ${component.name}`, async () => {
        await render(component)

        const trigger = page.getByRole("button", {name: "Status"})
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
        await expect.element(page.getByText("Failed")).not.toBeVisible()

        await trigger.click()

        await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
        await expect
          .element(page.getByRole("group", {name: "Status"}))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(`
          <div
            data-test-id="missing-filter"
            q-filter-panel-filter-root
            [filter]="missing"
          >
            <button q-filter-panel-filter-trigger></button>
            <div q-filter-panel-filter-content>
              <q-checkbox-group-filter />
            </div>
          </div>
          ${statusFilter}
        `),
      })
      class CompositeMissingFilter extends PanelHost {}
      return CompositeMissingFilter
    },
    simple() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(`
          <div
            data-test-id="missing-filter"
            q-filter-panel-filter
            [filter]="missing"
          >
            <q-checkbox-group-filter />
          </div>
          ${statusFilter}
        `),
      })
      class SimpleMissingFilter extends PanelHost {}
      return SimpleMissingFilter
    },
    testCase(component) {
      test(`a missing definition hides the filter and leaves the others intact — ${component.name}`, async () => {
        vi.spyOn(console, "warn").mockImplementation(() => {})
        await render(component)

        await expect
          .element(page.getByRole("group", {name: "Status"}))
          .toBeVisible()

        const missing = page.getByTestId("missing-filter")
        await expect.element(missing).toHaveAttribute("hidden")
        await expect.element(missing).not.toBeVisible()
        await expect
          .poll(() => page.getByRole("group").elements().length)
          .toBe(1)
      })
    },
  },
  {
    composite() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(
          compositeStatusFilter(
            "",
            `
              <span q-filter-panel-filter-label *filterContext="let filter">
                {{ filter.label }} ({{ filter.definition.kind }})
              </span>
              <span q-filter-panel-filter-count></span>
            `,
          ),
        ),
      })
      class CompositeCustomLabel extends PanelHost {}
      return CompositeCustomLabel
    },
    simple() {
      @Component({
        imports: [FilterPanelModule, FiltersModule],
        template: panelTemplate(
          simpleStatusFilter(
            "",
            `
              <span q-filter-panel-filter-label *filterContext="let filter">
                {{ filter.label }} ({{ filter.definition.kind }})
              </span>
            `,
          ),
        ),
      })
      class SimpleCustomLabel extends PanelHost {}
      return SimpleCustomLabel
    },
    testCase(component) {
      test(`a label rendered with filterContext names the trigger and the control — ${component.name}`, async () => {
        await render(component)

        await expect
          .element(page.getByRole("button", {name: "Status (list)"}))
          .toBeVisible()
        await expect
          .element(page.getByRole("group", {name: "Status (list)"}))
          .toBeVisible()

        await page.getByText("Passed").click()

        await expect
          .element(page.getByRole("button", {name: "Status (list) 1 selected"}))
          .toBeVisible()
      })
    },
  },
]

describe("filter panel filter", () => {
  runTests(filterTests)

  test("an empty composite trigger renders the label, count, and indicator", async () => {
    await render(
      createPanel(`
        <div q-filter-panel-filter-root [filter]="filters.status">
          <button q-filter-panel-filter-trigger></button>
          <div q-filter-panel-filter-content>
            <q-checkbox-group-filter />
          </div>
        </div>
      `),
      {inputs: {defaultValue: {status: ["Queued"]}}},
    )

    const trigger = page.getByRole("button", {name: "Status 1 selected"})
    await expect.element(trigger).toBeVisible()
    expect(filterIndicator(trigger.element() as HTMLElement)).not.toBeNull()
    await expect
      .element(page.getByRole("group", {name: "Status"}))
      .toBeVisible()
  })

  test("projected count and indicator replace the simple filter's defaults", async () => {
    await render(
      createPanel(`
        <div q-filter-panel-filter [filter]="filters.status">
          <span q-filter-panel-filter-count>*</span>
          <span q-filter-panel-filter-indicator data-test-id="indicator"></span>
          <q-checkbox-group-filter />
        </div>
      `),
      {inputs: {defaultValue: {status: ["Failed"]}}},
    )

    const trigger = page.getByRole("button", {name: "Status 1 selected"})
    await expect.element(trigger).toMatchTextContent("*")
    await expect
      .element(trigger.getByTestId("indicator"))
      .toHaveAttribute("data-state", "open")
    await expect
      .poll(
        () =>
          (trigger.element() as HTMLElement).querySelectorAll(
            "[q-filter-panel-filter-indicator]",
          ).length,
      )
      .toBe(1)
  })

  test("the label input changes the text that names the trigger and control", async () => {
    await render(
      createPanel(`
        <div label="Run status" q-filter-panel-filter [filter]="filters.status">
          <q-checkbox-group-filter />
        </div>
      `),
    )

    await expect
      .element(page.getByRole("button", {name: "Run status"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("group", {name: "Run status"}))
      .toBeVisible()
  })

  test("a controlled open of false renders the filter collapsed", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <div q-filter-panel-root [filters]="filters">
          <div
            q-filter-panel-filter-root
            [filter]="filters.status"
            [open]="false"
          >
            <button q-filter-panel-filter-trigger></button>
            <div q-filter-panel-filter-content>
              <q-checkbox-group-filter />
            </div>
          </div>
        </div>
      `,
    })
    class ControlledClosed {
      readonly filters = filters
    }
    await render(ControlledClosed)

    await expect
      .element(page.getByRole("button", {name: "Status"}), {timeout: 1000})
      .toHaveAttribute("aria-expanded", "false")
  })

  test("the open input and openChanged control the composite filter", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <button type="button" (click)="open.set(!open())">Toggle status</button>
        <div q-filter-panel-root [filters]="filters">
          <div
            q-filter-panel-filter-root
            [filter]="filters.status"
            [open]="open()"
            (openChanged)="open.set($event)"
          >
            <button q-filter-panel-filter-trigger></button>
            <div q-filter-panel-filter-content>
              <q-checkbox-group-filter />
            </div>
          </div>
        </div>
        <output>{{ open() ? "open" : "closed" }}</output>
      `,
    })
    class ControlledOpen {
      readonly filters = filters
      readonly open = signal(true)
    }
    await render(ControlledOpen)

    const trigger = page.getByRole("button", {name: "Status"})
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true")

    await page.getByRole("button", {name: "Toggle status"}).click()
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
    await expect.element(page.getByText("Failed")).not.toBeVisible()

    await trigger.click()
    await expect.element(page.getByRole("status")).toHaveTextContent("open")
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
    await expect.element(page.getByText("Failed")).toBeVisible()
  })
})

describe("filter panel", () => {
  test("manual mode stages changes until they are applied", async () => {
    const valueChanged = vi.fn()
    await render(createPanel(statusFilter), {
      inputs: {applyMode: "manual"},
      on: {valueChanged},
    })

    const apply = page.getByRole("button", {name: "Apply"})
    await expect.element(apply).toBeDisabled()

    await page.getByText("Failed").click()
    await page.getByText("Queued").click()

    await expect.element(page.getByLabelText("Failed")).toBeChecked()
    await expect.element(page.getByLabelText("Queued")).toBeChecked()
    await expect.element(apply).toBeEnabled()
    expect(valueChanged).not.toHaveBeenCalled()

    await apply.click()

    await expect
      .poll(() => valueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Failed", "Queued"]})
    await expect.element(apply).toBeDisabled()
  })

  test("auto mode is the default and commits every change", async () => {
    const valueChanged = vi.fn()
    await render(createPanel(statusFilter), {on: {valueChanged}})

    await page.getByText("Passed").click()
    await expect
      .poll(() => valueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Passed"]})

    await page.getByText("Failed").click()
    await expect
      .poll(() => valueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Passed", "Failed"]})

    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeDisabled()
  })

  test("the defaultValue seeds the controls", async () => {
    await render(createPanel(statusFilter), {
      inputs: {defaultValue: {status: ["Queued"]}},
    })

    await expect.element(page.getByLabelText("Queued")).toBeChecked()
    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
  })

  test("a controlled value drives the controls and follows valueChanged", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <button type="button" (click)="value.set({status: ['Passed']})">
          Show passed
        </button>
        <div
          q-filter-panel-root
          [filters]="filters"
          [value]="value()"
          (valueChanged)="value.set($event)"
        >
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
        </div>
        <output>{{ json(value()) }}</output>
      `,
    })
    class ControlledPanel {
      readonly filters = filters
      readonly json = JSON.stringify
      readonly value = signal<Values>({status: ["Failed"]})
    }
    await render(ControlledPanel)

    const output = page.getByRole("status")
    await expect.element(page.getByLabelText("Failed")).toBeChecked()

    await page.getByRole("button", {name: "Show passed"}).click()

    await expect.element(page.getByLabelText("Passed")).toBeChecked()
    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()

    await page.getByText("Queued").click()

    await expect
      .poll(() => JSON.parse(output.element().textContent || "{}"))
      .toEqual({status: ["Passed", "Queued"]})
  })

  test("a value set from outside replaces unapplied changes in manual mode", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <button type="button" (click)="value.set({})">Reset</button>
        <div
          applyMode="manual"
          q-filter-panel-root
          [filters]="filters"
          [value]="value()"
          (valueChanged)="value.set($event)"
        >
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
          <div q-filter-panel-footer>
            <button q-filter-panel-apply-button></button>
          </div>
        </div>
      `,
    })
    class ControlledManualPanel {
      readonly filters = filters
      readonly value = signal<Values>({status: ["Failed"]})
    }
    await render(ControlledManualPanel)

    await page.getByText("Queued").click()
    await expect.element(page.getByLabelText("Queued")).toBeChecked()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeEnabled()

    await page.getByRole("button", {name: "Reset"}).click()

    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
    await expect.element(page.getByLabelText("Queued")).not.toBeChecked()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeDisabled()
  })

  test("draftValueChanged reports every draft change in manual mode", async () => {
    const draftValueChanged = vi.fn()
    const valueChanged = vi.fn()
    await render(createPanel(statusFilter), {
      inputs: {applyMode: "manual"},
      on: {draftValueChanged, valueChanged},
    })

    expect(draftValueChanged).not.toHaveBeenCalled()

    await page.getByText("Failed").click()

    await expect
      .poll(() => draftValueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Failed"]})
    expect(valueChanged).not.toHaveBeenCalled()

    const apply = page.getByRole("button", {name: "Apply"})
    await apply.click()
    await expect.element(apply).toBeDisabled()

    await expect
      .poll(() => valueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Failed"]})
    expect(draftValueChanged).toHaveBeenCalledTimes(1)

    await page.getByRole("button", {name: "Clear all"}).click()

    await expect.poll(() => draftValueChanged.mock.lastCall?.[0]).toEqual({})
    expect(valueChanged).toHaveBeenCalledTimes(1)
  })

  test("draftValueChanged reports a value from outside replacing the draft", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <button type="button" (click)="value.set({})">Reset</button>
        <div
          applyMode="manual"
          q-filter-panel-root
          [filters]="filters"
          [value]="value()"
          (draftValueChanged)="draftValueChanged.emit($event)"
          (valueChanged)="value.set($event)"
        >
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
        </div>
      `,
    })
    class ControlledDraftPanel {
      readonly filters = filters
      readonly draftValueChanged = output<Values>()
      readonly value = signal<Values>({status: ["Failed"]})
    }
    const draftValueChanged = vi.fn()
    await render(ControlledDraftPanel, {on: {draftValueChanged}})

    await page.getByText("Queued").click()
    await expect
      .poll(() => draftValueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Failed", "Queued"]})

    await page.getByRole("button", {name: "Reset"}).click()

    await expect.poll(() => draftValueChanged.mock.lastCall?.[0]).toEqual({})
  })

  test("draftValueChanged follows committed changes in auto mode", async () => {
    const draftValueChanged = vi.fn()
    const valueChanged = vi.fn()
    await render(createPanel(statusFilter), {
      on: {draftValueChanged, valueChanged},
    })

    await page.getByText("Passed").click()

    await expect
      .poll(() => draftValueChanged.mock.lastCall?.[0])
      .toEqual({status: ["Passed"]})
    expect(valueChanged).toHaveBeenLastCalledWith({status: ["Passed"]})
  })

  test("the panel count shows the draft total and is hidden at zero", async () => {
    await render(createPanel(statusFilter), {inputs: {applyMode: "manual"}})

    const heading = page.getByRole("heading", {name: /^Filters/})
    await expect
      .element(heading.getByLabelText("0 selected"))
      .toHaveAttribute("hidden")
    await expect.element(heading).toHaveAccessibleName("Filters")

    await page.getByText("Failed").click()
    await page.getByText("Passed").click()

    const count = heading.getByLabelText("2 selected", {exact: true})
    await expect.element(count).toBeVisible()
    await expect.element(count).toHaveTextContent("2")
    await expect
      .element(page.getByRole("heading", {name: "Filters 2 selected"}))
      .toBeVisible()
  })

  test("counts selected values per filter and for the panel", async () => {
    await render(
      createPanel(`
        ${statusFilter}
        <div q-filter-panel-filter [filter]="filters.buildPath">
          <q-text-input-filter />
        </div>
      `),
      {
        inputs: {
          defaultValue: {buildPath: "out/", status: ["Failed", "Queued"]},
        },
      },
    )

    await expect
      .element(page.getByLabelText("3 selected", {exact: true}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Status 2 selected"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Build path 1 selected"}))
      .toBeVisible()
  })

  test("the clear button is disabled until a filter is set", async () => {
    await render(createPanel(statusFilter))

    const clear = page.getByRole("button", {name: "Clear all"})
    await expect.element(clear).toBeDisabled()

    await page.getByText("Failed").click()
    await expect.element(clear).toBeEnabled()

    await page.getByText("Failed").click()
    await expect.element(clear).toBeDisabled()
  })

  test("clear all commits immediately in auto mode", async () => {
    const valueChanged = vi.fn()
    await render(createPanel(statusFilter), {
      inputs: {defaultValue: {status: ["Failed", "Queued"]}},
      on: {valueChanged},
    })

    await page.getByRole("button", {name: "Clear all"}).click()

    await expect.poll(() => valueChanged.mock.lastCall?.[0]).toEqual({})
    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
    await expect.element(page.getByLabelText("Queued")).not.toBeChecked()
  })

  test("clear all removes every filter and must be applied in manual mode", async () => {
    const valueChanged = vi.fn()
    await render(createPanel(statusFilter), {
      inputs: {applyMode: "manual", defaultValue: {status: ["Failed"]}},
      on: {valueChanged},
    })

    const clear = page.getByRole("button", {name: "Clear all"})
    await clear.click()

    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
    await expect.element(clear).toBeDisabled()
    expect(valueChanged).not.toHaveBeenCalled()

    await page.getByRole("button", {name: "Apply"}).click()
    await expect.poll(() => valueChanged.mock.lastCall?.[0]).toEqual({})
  })

  test("the apply and clear buttons render custom content", async () => {
    await render(
      createPanel(`
        ${statusFilter}
        <button q-filter-panel-apply-button>Show results</button>
        <button q-filter-panel-clear-button>Reset filters</button>
      `),
      {inputs: {applyMode: "manual"}},
    )

    const apply = page.getByRole("button", {name: "Show results"})
    const clear = page.getByRole("button", {name: "Reset filters"})
    await expect.element(apply).toBeDisabled()
    await expect.element(clear).toBeDisabled()

    await page.getByText("Failed").click()

    await expect.element(apply).toBeEnabled()
    await expect.element(clear).toBeEnabled()
  })

  test("the filter set resolves collections that definitions omit", async () => {
    await render(
      createPanel(`
        <div q-filter-panel-filter [filter]="filters.user">
          <q-checkbox-group-filter />
        </div>
      `),
      {
        inputs: {
          getFilterCollection: (id: string) =>
            id === "user" ? users : undefined,
        },
      },
    )

    await expect.element(page.getByRole("group", {name: "User"})).toBeVisible()
    await expect.element(page.getByLabelText("Anna Robinson")).toBeVisible()
    await expect.element(page.getByLabelText("Ben Ortiz")).toBeVisible()
  })

  test("getFilterLabel labels filters whose definition has no label", async () => {
    await render(
      createPanel(`
        <div q-filter-panel-filter [filter]="filters.reviewer">
          <q-checkbox-group-filter />
        </div>
        ${statusFilter}
      `),
      {
        inputs: {
          getFilterLabel: (id: string) =>
            id === "reviewer" ? "Reviewer" : "Ignored",
        },
      },
    )

    await expect
      .element(page.getByRole("button", {name: "Reviewer"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("group", {name: "Reviewer"}))
      .toBeVisible()
    await expect
      .element(page.getByRole("group", {name: "Status"}))
      .toBeVisible()
  })

  test("a filter without a label falls back to its id", async () => {
    await render(
      createPanel(`
        <div q-filter-panel-filter [filter]="filters.reviewer">
          <q-checkbox-group-filter />
        </div>
      `),
    )

    await expect
      .element(page.getByRole("group", {name: "reviewer"}))
      .toBeVisible()
  })

  test("every control is labelled by its filter label element", async () => {
    await render(
      createPanel(`
        ${statusFilter}
        <div q-filter-panel-filter [filter]="filters.mode">
          <q-radio-group-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.chipset">
          <q-checkbox-tree-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.standard">
          <q-select-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.owner">
          <q-combobox-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.buildPath">
          <q-text-input-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.duration">
          <q-slider-filter />
        </div>
        <div q-filter-panel-filter [filter]="filters.submitted">
          <q-date-filter />
        </div>
      `),
    )

    const controls = [
      page.getByRole("group", {name: "Status"}),
      page.getByRole("radiogroup", {name: "Mode"}),
      page.getByRole("tree", {name: "Chipset"}),
      page.getByRole("combobox", {name: "Standard"}),
      page.getByRole("combobox", {name: "Owner"}),
      page.getByRole("textbox", {name: "Build path"}),
      // The slider's thumbs are hidden by a slider bug, see filters.spec.ts.
      page.getByRole("slider", {includeHidden: true, name: "Duration"}).nth(0),
      page.getByRole("slider", {includeHidden: true, name: "Duration"}).nth(1),
      page.getByRole("radiogroup", {name: "Submitted"}),
    ]
    const labels = [
      "Status",
      "Mode",
      "Chipset",
      "Standard",
      "Owner",
      "Build path",
      "Duration",
      "Duration",
      "Submitted",
    ]

    for (const [index, control] of controls.entries()) {
      await expect.element(control).toBeInTheDocument()
      const label = page.getByText(labels[index], {exact: true})
      const labelId = label.element().id
      expect(labelId).toBeTruthy()
      await expect.element(control).toHaveAttribute("aria-labelledby", labelId)
    }
  })

  test("the root exposes its filter set through the template reference", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <div
          #panel="filterPanelRoot"
          applyMode="manual"
          q-filter-panel-root
          [filters]="filters"
        >
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
          <button q-filter-panel-apply-button></button>
        </div>
        <output aria-label="Pending">
          {{ panel.filterSet().draftValueCount }}
        </output>
        <output aria-label="Applied">{{ panel.filterSet().valueCount }}</output>
        <button type="button" (click)="panel.filterSet().clearAll()">
          Remove all
        </button>
      `,
    })
    class ExportedFilterSet {
      readonly filters = filters
    }
    await render(ExportedFilterSet)

    await page.getByText("Failed").click()
    await page.getByText("Passed").click()

    await expect.element(page.getByLabelText("Pending")).toHaveTextContent("2")
    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("0")

    await page.getByRole("button", {name: "Apply"}).click()
    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("2")

    await page.getByRole("button", {name: "Remove all"}).click()
    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("0")
    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
  })

  test("the close button has a default name that aria-label replaces", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <div q-filter-panel-root [filters]="filters">
          <div q-filter-panel-header>
            <h2 q-filter-panel-heading>Filters</h2>
            <button
              q-filter-panel-close-button
              (click)="closed.emit()"
            ></button>
            <button
              aria-label="Hide panel"
              q-filter-panel-close-button
            ></button>
          </div>
        </div>
      `,
    })
    class ClosablePanel {
      readonly closed = output<void>()
      readonly filters = filters
    }
    const closed = vi.fn()
    await render(ClosablePanel, {on: {closed}})

    await expect
      .element(page.getByRole("button", {name: "Hide panel"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Close filters"}).click()
    expect(closed).toHaveBeenCalledTimes(1)
  })

  test("the heading renders an icon that can be removed", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <div q-filter-panel-root [filters]="filters">
          <h2 q-filter-panel-heading>Filters</h2>
          <h3 q-filter-panel-heading [icon]="null">Plain</h3>
        </div>
      `,
    })
    class HeadingIcons {
      readonly filters = filters
    }
    await render(HeadingIcons)

    const withIcon = page.getByRole("heading", {name: "Filters"})
    const withoutIcon = page.getByRole("heading", {name: "Plain"})
    await expect.element(withIcon).toBeVisible()
    await expect.element(withoutIcon).toBeVisible()

    const icon = withIcon.element().querySelector("svg")
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(withoutIcon.element().querySelector("svg")).toBeNull()
  })
})

describe("size", () => {
  const sizedControls = `
    ${statusFilter}
    <div q-filter-panel-filter [filter]="filters.mode">
      <q-radio-group-filter anyLabel="Any" />
    </div>
    <div q-filter-panel-filter [filter]="filters.standard">
      <q-select-filter />
    </div>
    <div q-filter-panel-filter [filter]="filters.buildPath">
      <q-text-input-filter />
    </div>
    <div q-filter-panel-filter [filter]="filters.chipset">
      <q-checkbox-tree-filter />
    </div>
  `

  test.each<[QdsFilterPanelSize | undefined, string]>([
    [undefined, "sm"],
    ["sm", "sm"],
    ["md", "sm"],
    ["lg", "md"],
  ])("a %s panel renders %s controls", async (size, controlSize) => {
    await render(createPanel(sizedControls), {inputs: {size}})

    await expect
      .element(page.getByRole("group", {name: "Status"}))
      .toHaveAttribute("data-size", controlSize)
    await expect
      .element(page.getByRole("radiogroup", {name: "Mode"}))
      .toHaveAttribute("data-size", controlSize)
    await expect
      .element(page.getByRole("combobox", {name: "Standard"}))
      .toHaveAttribute("data-size", controlSize)
    await expect
      .element(page.getByRole("textbox", {name: "Build path"}))
      .toHaveAttribute("data-size", controlSize)
    await expect
      .element(page.getByRole("tree", {name: "Chipset"}))
      .toHaveAttribute("data-size", controlSize)
  })

  test("the root provider sizes its controls", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <div q-filter-panel-root-provider size="lg" [value]="filterSet()">
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
        </div>
      `,
    })
    class SizedProvider {
      readonly filters = filters
      readonly filterSet = useFilterSet({filters})
    }
    await render(SizedProvider)

    await expect
      .element(page.getByRole("group", {name: "Status"}))
      .toHaveAttribute("data-size", "md")
  })
})

describe("root provider", () => {
  test("shares committed values and their labels outside the panel", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <ul aria-label="Active filters">
          @for (item of filterSet().getValueItems("owner"); track item.value) {
            <li>{{ item.label }}</li>
          }
        </ul>
        <button type="button" (click)="open.set(!open())">Toggle panel</button>
        @if (open()) {
          <div q-filter-panel-root-provider [value]="filterSet()">
            <div q-filter-panel-filter [filter]="filters.owner">
              <q-checkbox-group-filter />
            </div>
            <button q-filter-panel-apply-button></button>
          </div>
        }
      `,
    })
    class SharedFilterSet {
      readonly filters = filters
      readonly valueChanged = output<Values>()
      readonly open = signal(true)
      readonly filterSet = useFilterSet({
        applyMode: "manual",
        filters,
        onValueChange: (value) => this.valueChanged.emit(value),
      })
    }
    const valueChanged = vi.fn()
    await render(SharedFilterSet, {on: {valueChanged}})

    const activeFilters = page.getByRole("list", {name: "Active filters"})

    await page.getByText("Anna Robinson").click()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeEnabled()
    expect(activeFilters.getByRole("listitem").elements()).toHaveLength(0)

    await page.getByRole("button", {name: "Apply"}).click()

    await expect
      .poll(() => valueChanged.mock.lastCall)
      .toEqual([{owner: ["u1"]}])
    await expect.element(activeFilters.getByText("Anna Robinson")).toBeVisible()

    await page.getByRole("button", {name: "Toggle panel"}).click()

    await expect
      .element(page.getByRole("group", {name: "Owner"}))
      .not.toBeInTheDocument()
    await expect.element(activeFilters.getByText("Anna Robinson")).toBeVisible()
  })

  test("a manual-mode draft survives unmounting the panel", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <button type="button" (click)="open.set(!open())">Toggle panel</button>
        @if (open()) {
          <div q-filter-panel-root-provider [value]="filterSet()">
            <div q-filter-panel-filter [filter]="filters.status">
              <q-checkbox-group-filter />
            </div>
            <button q-filter-panel-apply-button></button>
          </div>
        }
      `,
    })
    class RemountedPanel {
      readonly filters = filters
      readonly open = signal(true)
      readonly filterSet = useFilterSet({applyMode: "manual", filters})
    }
    await render(RemountedPanel)

    await page.getByText("Queued").click()
    await expect.element(page.getByLabelText("Queued")).toBeChecked()

    const toggle = page.getByRole("button", {name: "Toggle panel"})
    await toggle.click()
    await expect
      .element(page.getByRole("group", {name: "Status"}))
      .not.toBeInTheDocument()
    await toggle.click()

    await expect.element(page.getByLabelText("Queued")).toBeChecked()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeEnabled()
  })

  test("valueCount counts the committed value, draftValueCount the draft", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <output aria-label="Applied">{{ filterSet().valueCount }}</output>
        <output aria-label="Pending">{{ filterSet().draftValueCount }}</output>
        <div q-filter-panel-root-provider [value]="filterSet()">
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
          <button q-filter-panel-apply-button></button>
        </div>
      `,
    })
    class Counts {
      readonly filters = filters
      readonly filterSet = useFilterSet({applyMode: "manual", filters})
    }
    await render(Counts)

    await page.getByText("Failed").click()
    await page.getByText("Queued").click()

    await expect.element(page.getByLabelText("Pending")).toHaveTextContent("2")
    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("0")

    await page.getByRole("button", {name: "Apply"}).click()

    await expect.element(page.getByLabelText("Applied")).toHaveTextContent("2")
  })

  test("signal props replace the value and discard the draft", async () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <button type="button" (click)="value.set({status: ['Passed']})">
          Show passed
        </button>
        <div q-filter-panel-root-provider [value]="filterSet()">
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
          <button q-filter-panel-apply-button></button>
        </div>
      `,
    })
    class SignalProps {
      readonly filters = filters
      readonly value = signal<Values>({status: ["Failed"]})
      readonly filterSet = useFilterSet(
        computed(() => ({
          applyMode: "manual" as const,
          filters,
          onValueChange: (value: Values) => this.value.set(value),
          value: this.value(),
        })),
      )
    }
    await render(SignalProps)

    await expect.element(page.getByLabelText("Failed")).toBeChecked()
    await page.getByText("Queued").click()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeEnabled()

    await page.getByRole("button", {name: "Show passed"}).click()

    await expect.element(page.getByLabelText("Passed")).toBeChecked()
    await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
    await expect.element(page.getByLabelText("Queued")).not.toBeChecked()
    await expect
      .element(page.getByRole("button", {name: "Apply"}))
      .toBeDisabled()
  })

  describe("in manual mode, writes from outside the panel", () => {
    @Component({
      imports: [FilterPanelModule, FiltersModule],
      template: `
        <ul aria-label="Active filters">
          @for (
            item of filterSet().getValueItems();
            track item.filterId + ":" + item.value
          ) {
            <li>
              <button
                type="button"
                (click)="
                  filterSet().removeFilterValue(item.filterId, item.value)
                "
              >
                Remove {{ item.label }}
              </button>
            </li>
          }
        </ul>
        <button type="button" (click)="filterSet().clearAll()">
          Clear filters
        </button>
        <div q-filter-panel-root-provider [value]="filterSet()">
          <div q-filter-panel-filter [filter]="filters.status">
            <q-checkbox-group-filter />
          </div>
          <div q-filter-panel-filter [filter]="filters.owner">
            <q-checkbox-group-filter />
          </div>
          <button q-filter-panel-apply-button></button>
        </div>
      `,
    })
    class OutsideWrites {
      readonly filters = filters
      readonly valueChanged = output<Values>()
      readonly filterSet = useFilterSet({
        applyMode: "manual",
        defaultValue: {status: ["Failed"]},
        filters,
        onValueChange: (value) => this.valueChanged.emit(value),
      })
    }

    test("removing a chip commits and keeps the staged changes", async () => {
      const valueChanged = vi.fn()
      await render(OutsideWrites, {on: {valueChanged}})

      await page.getByText("Queued").click()
      await page.getByText("Anna Robinson").click()
      await page.getByRole("button", {name: "Remove Failed"}).click()

      await expect.poll(() => valueChanged.mock.lastCall?.[0]).toEqual({})
      await expect
        .element(page.getByRole("button", {name: "Remove Failed"}))
        .not.toBeInTheDocument()
      await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
      await expect.element(page.getByLabelText("Queued")).toBeChecked()
      await expect.element(page.getByLabelText("Anna Robinson")).toBeChecked()

      await page.getByRole("button", {name: "Apply"}).click()

      await expect
        .poll(() => valueChanged.mock.lastCall?.[0])
        .toEqual({owner: ["u1"], status: ["Queued"]})
    })

    test("clearing all commits and discards the staged changes", async () => {
      const valueChanged = vi.fn()
      await render(OutsideWrites, {on: {valueChanged}})

      await page.getByText("Queued").click()
      await page.getByRole("button", {name: "Clear filters"}).click()

      await expect.poll(() => valueChanged.mock.lastCall?.[0]).toEqual({})
      await expect.element(page.getByLabelText("Failed")).not.toBeChecked()
      await expect.element(page.getByLabelText("Queued")).not.toBeChecked()
      await expect
        .element(page.getByRole("button", {name: "Apply"}))
        .toBeDisabled()
    })
  })
})
