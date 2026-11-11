import {describe, expect, test} from "vitest"
import {renderHook} from "vitest-browser-react"

import {
  type JsonViewerRootProps,
  useJsonViewer,
} from "@qualcomm-ui/react/json-viewer"

const data = {items: [1, 2, 3], nested: {value: "hello world"}}
const initialProps: JsonViewerRootProps = {data}

describe("JSON viewer collection memoization", () => {
  test("preserves the collection during controlled expansion and collapse", async () => {
    const hook = await renderHook(
      (props = initialProps) => useJsonViewer(props),
      {
        initialProps,
      },
    )
    const collection = hook.result.current.collection
    const expandedValue = collection.getBranchValues()

    await hook.rerender({...initialProps, expandedValue})

    expect(hook.result.current.collection).toBe(collection)
    expect(hook.result.current.treeProps.expandedValue).toEqual(expandedValue)

    await hook.rerender({...initialProps, expandedValue: []})

    expect(hook.result.current.collection).toBe(collection)
    expect(hook.result.current.treeProps.expandedValue).toEqual([])
  })

  test.each([
    {name: "direction", props: {dir: "rtl" as const}},
    {name: "CSS class", props: {className: "w-full"}},
    {name: "quoted keys", props: {quotesOnKeys: true}},
    {name: "lazy mounting", props: {lazyMount: true}},
    {name: "unmount on exit", props: {unmountOnExit: true}},
  ])("preserves the collection when $name changes", async ({props}) => {
    const hook = await renderHook(
      (props = initialProps) => useJsonViewer(props),
      {
        initialProps,
      },
    )
    const collection = hook.result.current.collection

    await hook.rerender({...initialProps, ...props})

    expect(hook.result.current.collection).toBe(collection)
  })

  test("updates default expansion depth without rebuilding the collection", async () => {
    const hook = await renderHook(
      (props = initialProps) => useJsonViewer(props),
      {
        initialProps,
      },
    )
    const collection = hook.result.current.collection
    const originalExpandedValue = hook.result.current.defaultExpandedValue

    await hook.rerender({...initialProps, defaultExpandedDepth: 3})

    expect(hook.result.current.collection).toBe(collection)
    expect(hook.result.current.defaultExpandedValue).not.toEqual(
      originalExpandedValue,
    )
    expect(hook.result.current.defaultExpandedValue).toEqual(
      collection.getBranchValues(),
    )
  })

  test("returns explicit initial expansion values instead of deriving them from depth", async () => {
    const defaultExpandedValue: string[] = []
    const hook = await renderHook(() =>
      useJsonViewer({data, defaultExpandedDepth: 3, defaultExpandedValue}),
    )

    expect(hook.result.current.defaultExpandedValue).toEqual([])
  })

  test("rebuilds the collection when data changes", async () => {
    const hook = await renderHook(
      (props = initialProps) => useJsonViewer(props),
      {
        initialProps,
      },
    )
    const collection = hook.result.current.collection
    const nextData = {changed: {value: 2}}

    await hook.rerender({...initialProps, data: nextData})

    expect(hook.result.current.collection).not.toBe(collection)
    expect(hook.result.current.collection.rootNode.children?.[0]?.value).toBe(
      nextData,
    )
  })

  test.each([
    {collapseStringsAfterLength: 5},
    {groupArraysAfterLength: 1},
    {maxPreviewItems: 1},
    {showNonenumerable: false},
  ])(
    "rebuilds the collection when preview options change to %j",
    async (options) => {
      const hook = await renderHook(
        (props = initialProps) => useJsonViewer(props),
        {
          initialProps,
        },
      )
      const collection = hook.result.current.collection

      await hook.rerender({...initialProps, ...options})

      expect(hook.result.current.collection).not.toBe(collection)
      expect(hook.result.current.options).toMatchObject(options)
    },
  )
})
