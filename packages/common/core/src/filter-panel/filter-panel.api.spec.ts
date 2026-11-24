import {describe, expect, test, vi} from "vitest"

import type {FilterSetApi} from "@qualcomm-ui/core/filter-set"
import {createPropNormalizer} from "@qualcomm-ui/utils/machine"

import {createFilterPanelApi} from "./filter-panel.api.js"

const normalize = createPropNormalizer((props) => props)

function createFilterSet(overrides: Partial<FilterSetApi<any>> = {}) {
  return {
    apply: vi.fn(),
    applyMode: "manual",
    clearDraftValue: vi.fn(),
    draftValueCount: 0,
    isDirty: false,
    ...overrides,
  } as unknown as FilterSetApi<any>
}

const filter = {count: 2, id: "status", isActive: true, labelId: "label-1"}

describe("createFilterPanelApi", () => {
  test("the panel count is hidden while no filters are set", () => {
    expect(
      createFilterPanelApi(createFilterSet(), normalize).getCountBindings(),
    ).toMatchObject({"aria-label": "0 selected", hidden: true})
    expect(
      createFilterPanelApi(
        createFilterSet({draftValueCount: 3}),
        normalize,
      ).getCountBindings(),
    ).toMatchObject({"aria-label": "3 selected", hidden: false})
  })

  test("filter parts reflect the filter's state", () => {
    const api = createFilterPanelApi(createFilterSet(), normalize)

    expect(api.getFilterBindings(filter)).toMatchObject({
      "data-active": "",
      "data-filter-id": "status",
    })
    expect(api.getFilterLabelBindings(filter)).toMatchObject({
      "data-active": "",
      id: "label-1",
    })
    expect(api.getFilterCountBindings(filter)).toMatchObject({
      "aria-label": "2 selected",
      hidden: false,
    })
    expect(
      api.getFilterCountBindings({...filter, count: 0, isActive: false}),
    ).toMatchObject({hidden: true})
  })

  test("the indicator follows the filter's expanded state", () => {
    const api = createFilterPanelApi(createFilterSet(), normalize)

    expect(api.getFilterIndicatorBindings({open: true})).toMatchObject({
      "aria-hidden": true,
      "data-state": "open",
    })
    expect(api.getFilterIndicatorBindings({open: false})).toMatchObject({
      "data-state": "closed",
    })
  })

  test("apply and clear are disabled until there is something to do", () => {
    const idle = createFilterPanelApi(createFilterSet(), normalize)
    expect(idle.getApplyTriggerBindings().disabled).toBe(true)
    expect(idle.getClearTriggerBindings().disabled).toBe(true)

    const filterSet = createFilterSet({draftValueCount: 1, isDirty: true})
    const api = createFilterPanelApi(filterSet, normalize)
    const event = {defaultPrevented: false} as any

    api.getApplyTriggerBindings().onClick(event)
    api.getClearTriggerBindings().onClick(event)
    expect(filterSet.apply).toHaveBeenCalled()
    expect(filterSet.clearDraftValue).toHaveBeenCalled()
  })
})
