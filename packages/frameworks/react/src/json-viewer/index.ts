import {
  JsonViewerRootProvider,
  type JsonViewerRootProviderProps,
} from "./json-viewer-root-provider.js"
import {JsonViewerRoot, type JsonViewerRootProps} from "./json-viewer-root.js"
import {JsonViewerTree, type JsonViewerTreeProps} from "./json-viewer-tree.js"
import {type JsonViewerProps, JsonViewerSimple} from "./json-viewer.js"

export type {
  JsonViewerRootProps,
  JsonViewerRootProviderProps,
  JsonViewerProps,
  JsonViewerTreeProps,
}

export type {JsonViewerOptions} from "./json-viewer-context.js"
export type {JsonViewerNodeBaseProps} from "./json-viewer-node.js"
export type {
  UseJsonViewerProps,
  UseJsonViewerReturn,
} from "./use-json-viewer.js"

export {useJsonViewer} from "./use-json-viewer.js"

type JsonViewerComponent = typeof JsonViewerSimple & {
  /**
   * Groups all parts of the JSON viewer. Renders a `<div>` element by default.
   */
  Root: typeof JsonViewerRoot

  /**
   * Alternative root that accepts pre-computed state from `useJsonViewer`.
   */
  RootProvider: typeof JsonViewerRootProvider

  /**
   * Renders the JSON tree nodes. Place inside `JsonViewer.Root`.
   */
  Tree: typeof JsonViewerTree
}

export const JsonViewer: JsonViewerComponent =
  JsonViewerSimple as JsonViewerComponent

JsonViewer.Root = JsonViewerRoot
JsonViewer.RootProvider = JsonViewerRootProvider
JsonViewer.Tree = JsonViewerTree
