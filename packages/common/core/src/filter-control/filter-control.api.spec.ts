import {afterEach, describe, expect, test, vi} from "vitest"

import type {FilterState} from "@qualcomm-ui/core/filter-set"
import {
  customFilter,
  dateFilter,
  defineFilters,
  type FilterDefinition,
  type IdentifiedFilterDefinition,
  isCollectionFilter,
  listFilter,
  rangeFilter,
  textFilter,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {ListCollection, TreeCollection} from "@qualcomm-ui/utils/collection"
import {parseDate} from "@qualcomm-ui/utils/date-utils"
import {createPropNormalizer} from "@qualcomm-ui/utils/machine"

import {
  createCheckboxGroupFilterApi,
  createCheckboxTreeFilterApi,
  createComboboxFilterApi,
  createDateFilterApi,
  createRadioGroupFilterApi,
  createSelectFilterApi,
  createSliderFilterApi,
  createTextInputFilterApi,
  getFilterControlLabelProps,
  getFilterOptionCount,
  narrowFilterCollection,
} from "./filter-control.api.js"

const normalize = createPropNormalizer((props) => props)

const statuses = new ListCollection({
  itemDisabled: (item: string) => item === "Skipped",
  items: ["Failed", "Passed", "Skipped"],
})

const filters = defineFilters({
  chipset: treeFilter({
    collection: new TreeCollection<{children?: any[]; value: string}>({
      rootNode: {children: [{value: "sc8380xp"}], value: "root"},
    }),
    label: "Chipset",
  }),
  duration: rangeFilter({label: "Duration"}),
  query: textFilter({label: "Query"}),
  status: listFilter({collection: statuses, label: "Status"}),
  submitted: dateFilter({
    label: "Submitted",
    presets: [{label: "Last 7 days", value: "last7Days"}],
  }),
  tags: customFilter<string[]>({label: "Tags"}),
  unresolved: listFilter({label: "Unresolved"}),
})

function createState<TDef extends FilterDefinition>(
  definition: IdentifiedFilterDefinition<TDef>,
  overrides: Partial<FilterState<TDef>> = {},
): FilterState<TDef> {
  return {
    clear: vi.fn(),
    collection: isCollectionFilter(definition)
      ? definition.collection
      : undefined,
    count: 0,
    definition,
    id: definition.id,
    isActive: false,
    label: definition.label ?? definition.id,
    labelId: undefined,
    optionCounts: undefined,
    setValue: vi.fn(),
    value: undefined,
    ...overrides,
  } as FilterState<TDef>
}

/**
 * Returns the value written by the state's last `setValue` call, resolving
 * updater functions against `prev`.
 */
function lastWrite(state: FilterState<any>, prev?: unknown): unknown {
  const next = vi.mocked(state.setValue).mock.lastCall?.[0]
  return typeof next === "function" ? next(prev) : next
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("getFilterControlLabelProps", () => {
  test("references the label element when there is one", () => {
    expect(
      getFilterControlLabelProps({label: "Status", labelId: "label-1"}),
    ).toEqual({"aria-labelledby": "label-1"})
    expect(
      getFilterControlLabelProps({label: "Status", labelId: undefined}),
    ).toEqual({"aria-label": "Status"})
  })
})

describe("getFilterOptionCount", () => {
  test("missing options count 0, and inherited properties don't match", () => {
    expect(getFilterOptionCount(undefined, "Failed")).toBeUndefined()
    expect(getFilterOptionCount({Failed: 3}, "Failed")).toBe(3)
    expect(getFilterOptionCount({Failed: 3}, "Passed")).toBe(0)
    expect(getFilterOptionCount({}, "constructor")).toBe(0)
  })
})

describe("narrowFilterCollection", () => {
  test("keeps the items whose text contains the input", () => {
    const contains = (text: string, query: string) =>
      text.toLowerCase().includes(query.toLowerCase())

    expect(narrowFilterCollection(statuses, "", contains)).toBe(statuses)
    expect(narrowFilterCollection(statuses, "fa", contains).items).toEqual([
      "Failed",
    ])
  })
})

describe("createCheckboxGroupFilterApi", () => {
  test("has no options without a list collection", () => {
    const api = createCheckboxGroupFilterApi(
      createState(filters.unresolved),
      normalize,
    )
    expect(api.options).toBeUndefined()
  })

  test("names the group", () => {
    const api = createCheckboxGroupFilterApi(
      createState(filters.status),
      normalize,
    )
    expect(api.getRootBindings()).toEqual({
      "aria-label": "Status",
      role: "group",
    })
  })

  test("disables unselected options that are disabled or have no results", () => {
    const api = createCheckboxGroupFilterApi(
      createState(filters.status, {
        optionCounts: {Failed: 0},
        value: ["Failed"],
      }),
      normalize,
    )

    expect(api.options).toEqual([
      expect.objectContaining({
        checked: true,
        count: 0,
        disabled: false,
        value: "Failed",
      }),
      expect.objectContaining({
        checked: false,
        count: 0,
        disabled: true,
        value: "Passed",
      }),
      expect.objectContaining({
        checked: false,
        disabled: true,
        value: "Skipped",
      }),
    ])
  })

  test("checking adds the option and unchecking removes it", () => {
    const state = createState(filters.status)
    const api = createCheckboxGroupFilterApi(state, normalize)

    api.options![1].setChecked(true)
    expect(lastWrite(state, ["Failed"])).toEqual(["Failed", "Passed"])
    expect(lastWrite(state, undefined)).toEqual(["Passed"])

    api.options![0].setChecked(false)
    expect(lastWrite(state, ["Failed", "Passed"])).toEqual(["Passed"])
  })

  test("warns when the filter is another kind, and accepts custom filters", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})

    createCheckboxGroupFilterApi(createState(filters.tags as any), normalize)
    expect(warn).not.toHaveBeenCalled()

    createCheckboxGroupFilterApi(createState(filters.query as any), normalize)
    expect(warn).toHaveBeenCalledWith(
      `CheckboxGroupFilter writes "list" filters, but filter "query" is a "text" filter.`,
    )
  })
})

describe("createRadioGroupFilterApi", () => {
  test("lists a leading clearing option when anyLabel is set", () => {
    const api = createRadioGroupFilterApi(createState(filters.status), {
      anyLabel: "Any",
    })

    expect(api.value).toBe("")
    expect(api.options?.[0]).toEqual({
      checked: true,
      count: undefined,
      disabled: false,
      label: "Any",
      value: "",
    })
    expect(api.options).toHaveLength(4)
  })

  test("selects nothing without a value or clearing option", () => {
    const api = createRadioGroupFilterApi(createState(filters.status))
    expect(api.value).toBeNull()
    expect(api.options).toHaveLength(3)
  })

  test("writes a one-item value, and the clearing option clears", () => {
    const state = createState(filters.status, {value: ["Failed"]})
    const api = createRadioGroupFilterApi(state, {anyLabel: "Any"})

    expect(api.value).toBe("Failed")

    api.setValue("Passed")
    expect(lastWrite(state)).toEqual(["Passed"])

    api.setValue("")
    expect(lastWrite(state)).toBeUndefined()
  })
})

describe("createSelectFilterApi", () => {
  test("falls back to an empty collection and value", () => {
    const api = createSelectFilterApi(createState(filters.unresolved))
    expect(api.collection.items).toEqual([])
    expect(api.value).toEqual([])
  })

  test("writes the selected values", () => {
    const state = createState(filters.status)
    createComboboxFilterApi(state).setValue(["Failed"])
    expect(lastWrite(state)).toEqual(["Failed"])
  })
})

describe("createCheckboxTreeFilterApi", () => {
  test("exposes the tree, checked leaves, and leaf counts", () => {
    const state = createState(filters.chipset, {
      optionCounts: {sc8380xp: 2},
      value: ["sc8380xp"],
    })
    const api = createCheckboxTreeFilterApi(state)

    expect(api.tree).toBe(filters.chipset.collection)
    expect(api.checkedValue).toEqual(["sc8380xp"])
    expect(api.getOptionCount("sc8380xp")).toBe(2)
    expect(api.getOptionCount("sc8480xp")).toBe(0)
  })

  test("has no tree when the collection is a list", () => {
    const api = createCheckboxTreeFilterApi(
      createState(filters.chipset, {collection: statuses as any}),
    )
    expect(api.tree).toBeUndefined()
  })
})

describe("createDateFilterApi", () => {
  function create(
    overrides: Partial<FilterState<typeof filters.submitted>> = {},
    customSelected = false,
  ) {
    const state = createState(filters.submitted, overrides)
    const onCustomSelectedChange = vi.fn()
    const api = createDateFilterApi(state, {
      customSelected,
      onCustomSelectedChange,
    })
    return {api, onCustomSelectedChange, state}
  }

  test("lists the clearing choice, presets, and custom range", () => {
    const {api} = create()

    expect(api.choices).toEqual([
      {label: "Any time", value: ""},
      {label: "Last 7 days", value: "last7Days"},
      {label: "Custom range", value: "~custom"},
    ])
    expect(api.choice).toBe("")
    expect(api.showPicker).toBe(false)
  })

  test("without presets, the picker is always shown", () => {
    const state = createState({...filters.submitted, presets: undefined}, {})
    const api = createDateFilterApi(state, {
      customSelected: false,
      onCustomSelectedChange: vi.fn(),
    })

    expect(api.choices).toEqual([])
    expect(api.showPicker).toBe(true)
  })

  test("picking a preset writes it, and the custom choice clears", () => {
    const {api, onCustomSelectedChange, state} = create()

    api.selectChoice("last7Days")
    expect(lastWrite(state)).toEqual({preset: "last7Days"})
    expect(onCustomSelectedChange).toHaveBeenLastCalledWith(false)

    api.selectChoice("~custom")
    expect(lastWrite(state)).toBeUndefined()
    expect(onCustomSelectedChange).toHaveBeenLastCalledWith(true)
  })

  test("an empty custom range keeps the custom choice and picker", () => {
    const {api} = create({}, true)
    expect(api.choice).toBe("~custom")
    expect(api.showPicker).toBe(true)
  })

  test("a range value selects the custom choice", () => {
    const {api} = create({
      value: {range: ["2026-01-02T00:00:00Z", null]},
    })

    expect(api.choice).toBe("~custom")
    expect(api.showPicker).toBe(true)
    expect(api.pickerValue.map(String)).toEqual(["2026-01-02"])
  })

  test("writes the picked range as ISO 8601 dates", () => {
    const {api, state} = create()

    api.setPickerValue([parseDate("2026-01-02"), undefined])
    expect(lastWrite(state)).toEqual({range: ["2026-01-02", null]})
  })
})

describe("createSliderFilterApi", () => {
  test("defaults the bounds and marks them", () => {
    const api = createSliderFilterApi(createState(filters.duration), {
      dragValue: null,
      range: {},
    })

    expect(api.min).toBe(0)
    expect(api.max).toBe(100)
    expect(api.marks).toEqual([0, 100])
    expect(api.value).toEqual([0, 100])
    expect(api.disabled).toBe(false)
  })

  test("equal bounds disable the slider", () => {
    const api = createSliderFilterApi(createState(filters.duration), {
      dragValue: null,
      range: {max: 5, min: 5},
    })
    expect(api.disabled).toBe(true)
  })

  test("shows the drag value over the filter's value", () => {
    const api = createSliderFilterApi(
      createState(filters.duration, {value: [10, null]}),
      {dragValue: [20, 30], range: {max: 50, min: 0}},
    )
    expect(api.value).toEqual([20, 30])
  })

  test("a thumb resting on its bound leaves that side unbounded", () => {
    const state = createState(filters.duration)
    const api = createSliderFilterApi(state, {
      dragValue: null,
      range: {max: 50, min: 0},
    })

    api.commit([0, 20])
    expect(lastWrite(state)).toEqual([null, 20])

    api.commit([10, 50])
    expect(lastWrite(state)).toEqual([10, null])
  })

  test("names each thumb", () => {
    const api = createSliderFilterApi(
      createState(filters.duration, {labelId: "label-1"}),
      {dragValue: null, range: {}},
    )
    expect(api.getThumbLabelProps()).toEqual({
      "aria-labelledby": ["label-1", "label-1"],
    })
  })
})

describe("createTextInputFilterApi", () => {
  test("debounces in auto mode and commits immediately in manual mode", () => {
    const state = createState(filters.query)

    expect(
      createTextInputFilterApi(state, {applyMode: "auto", pending: null})
        .commitDelay,
    ).toBe(300)
    expect(
      createTextInputFilterApi(state, {
        applyMode: "auto",
        debounce: 50,
        pending: null,
      }).commitDelay,
    ).toBe(50)
    expect(
      createTextInputFilterApi(state, {applyMode: "manual", pending: null})
        .commitDelay,
    ).toBe(0)
  })

  test("shows pending text over the filter's value", () => {
    const state = createState(filters.query, {value: "gpu"})

    expect(
      createTextInputFilterApi(state, {applyMode: "auto", pending: null}).value,
    ).toBe("gpu")
    expect(
      createTextInputFilterApi(state, {applyMode: "auto", pending: "gp"}).value,
    ).toBe("gp")
  })
})
