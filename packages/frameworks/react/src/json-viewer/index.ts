import {JsonViewerSimple, type JsonViewerSimpleProps} from "./json-viewer"
import {JsonViewerRoot, type JsonViewerRootProps} from "./json-viewer-root"
import {
  JsonViewerRootProvider,
  type JsonViewerRootProviderProps,
} from "./json-viewer-root-provider"
import {JsonViewerTree, type JsonViewerTreeProps} from "./json-viewer-tree"

export type {
  JsonViewerRootProps,
  JsonViewerRootProviderProps,
  JsonViewerSimpleProps,
  JsonViewerTreeProps,
}

export type {JsonViewerOptions} from "./json-viewer-context"
export type {JsonViewerNodeBaseProps} from "./json-viewer-node"
export type {UseJsonViewerProps, UseJsonViewerReturn} from "./use-json-viewer"

export {useJsonViewer} from "./use-json-viewer"

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
