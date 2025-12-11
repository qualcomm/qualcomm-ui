import {createContext, type SetStateAction, useContext} from "react"

import {create, type StoreApi, useStore} from "zustand"

import {
  darkColorspace,
  type JsonViewerOnChange,
  type JsonViewerProps,
  type Path,
} from ".."
import type {RenderLink} from "../../../context"
import type {Colorspace} from "../theme/base16"
import type {JsonViewerKeyRenderer} from "../type"

const DefaultKeyRenderer: JsonViewerKeyRenderer = () => null
DefaultKeyRenderer.when = () => false

export type JsonViewerState<T = unknown> = {
  collapseStringsAfterLength: number
  colorspace: Colorspace
  defaultInspectControl?: (path: Path, value: unknown) => boolean
  defaultInspectDepth: number
  displayDataTypes: boolean
  displayKeyIndicator: boolean
  displayNumberKeys: boolean
  displaySize: boolean | ((path: Path, value: unknown) => boolean)
  getInspectCache: (path: Path, nestedIndex?: number) => boolean
  groupArraysAfterLength: number
  highlightUpdates: boolean
  hoverPath: {nestedIndex?: number; path: Path} | null
  indentWidth: number
  inspectCache: Record<string, boolean>
  keyRenderer: JsonViewerKeyRenderer
  maxDisplayLength: number
  objectSortKeys: boolean | ((a: string, b: string) => number)
  onChange: JsonViewerOnChange
  prevValue: T | undefined
  quotesOnKeys: boolean
  renderLink: RenderLink
  rootName: false | string

  setHover: (path: Path | null, nestedIndex?: number) => void
  setInspectCache: (
    path: Path,
    action: SetStateAction<boolean>,
    nestedIndex?: number,
  ) => void
  value: T
}

export const createJsonViewerStore = <T = unknown>(
  props: JsonViewerProps<T>,
) => {
  return create<JsonViewerState>()((set, get) => ({
    collapseStringsAfterLength:
      props.collapseStringsAfterLength === false
        ? Number.MAX_VALUE
        : (props.collapseStringsAfterLength ?? 50),
    colorspace: darkColorspace,
    defaultInspectControl: props.defaultInspectControl ?? undefined,
    defaultInspectDepth: props.defaultInspectDepth ?? 5,
    displayDataTypes: props.displayDataTypes ?? true,
    displayKeyIndicator: props.displayKeyIndicator ?? true,
    displayNumberKeys: props.displayNumberKeys ?? true,
    displaySize: props.displaySize ?? true,
    getInspectCache: (path, nestedIndex) => {
      const target =
        nestedIndex !== undefined
          ? `${path.join(".")}[${nestedIndex}]nt`
          : path.join(".")
      return get().inspectCache[target]
    },
    groupArraysAfterLength: props.groupArraysAfterLength ?? 100,
    highlightUpdates: props.highlightUpdates ?? false,
    hoverPath: null,
    indentWidth: props.indentWidth ?? 3,
    inspectCache: {},
    keyRenderer: props.keyRenderer ?? DefaultKeyRenderer,
    maxDisplayLength: props.maxDisplayLength ?? 30,
    objectSortKeys: props.objectSortKeys ?? false,
    onChange: props.onChange ?? (() => {}),
    prevValue: undefined,
    quotesOnKeys: props.quotesOnKeys ?? true,
    renderLink: props.renderLink,
    rootName: props.rootName ?? "root",
    setHover: (path, nestedIndex) => {
      set({
        hoverPath: path ? {nestedIndex, path} : null,
      })
    },
    setInspectCache: (path, action, nestedIndex) => {
      const target =
        nestedIndex !== undefined
          ? `${path.join(".")}[${nestedIndex}]nt`
          : path.join(".")
      set((state) => ({
        inspectCache: {
          ...state.inspectCache,
          [target]:
            typeof action === "function"
              ? action(state.inspectCache[target])
              : action,
        },
      }))
    },
    value: props.value,
  }))
}

export const JsonViewerStoreContext = createContext<StoreApi<JsonViewerState>>(
  null!,
)

export const JsonViewerProvider = JsonViewerStoreContext.Provider

export const useJsonViewerStore = <U extends unknown>(
  selector: (state: JsonViewerState) => U,
) => {
  const store = useContext(JsonViewerStoreContext)

  if (!store) {
    throw new Error(
      "JsonModelViewer components must be wrapped in <JsonViewerProvider>",
    )
  }

  return useStore(store, selector)
}
