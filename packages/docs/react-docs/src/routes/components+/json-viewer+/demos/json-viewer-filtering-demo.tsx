import {type ReactElement, useEffect, useMemo, useState} from "react"
import {flushSync} from "react-dom"

import {ChevronRight, Search} from "lucide-react"

import {JsonViewer, useJsonViewer} from "@qualcomm-ui/react/json-viewer"
import {TextInput} from "@qualcomm-ui/react/text-input"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {debounce} from "@qualcomm-ui/utils/functions"
import {type JsonNode, keyPathToKey} from "@qualcomm-ui/utils/json-tree"
import {matchSorter, Rankings} from "@qualcomm-ui/utils/match-sorter"

import data from "../../../../../../shared/data/1mb.json"

export function JsonViewerFilteringDemo(): ReactElement {
  const viewer = useJsonViewer({
    data,
    defaultExpandedDepth: 1,
    lazyMount: true,
    showNonenumerable: false,
    unmountOnExit: true,
  })
  const initialCollection = viewer.collection
  const emptyCollection = useMemo(
    () => initialCollection.copy({...initialCollection.rootNode, children: []}),
    [initialCollection],
  )
  const defaultExpandedValue = viewer.defaultExpandedValue
  const [collection, setCollection] =
    useState<TreeCollection<JsonNode>>(initialCollection)
  const [expanded, setExpanded] = useState<string[]>(
    viewer.defaultExpandedValue ?? [],
  )
  const [query, setQuery] = useState("")
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        const nodes = matchSorter(
          initialCollection.getDescendantNodes(),
          value,
          {
            keys: [
              (node) => keyPathToKey(node.keyPath, {excludeRoot: true}),
              (node) =>
                initialCollection.isBranchNode(node) ? "" : String(node.value),
            ],
            threshold: Rankings.CONTAINS,
          },
        )
        const matchingValues = new Set(
          nodes.map(initialCollection.getNodeValue),
        )
        const nextCollection = initialCollection.filter((node) =>
          matchingValues.has(initialCollection.getNodeValue(node)),
        )
        setCollection(nextCollection)
        setExpanded(nextCollection.getBranchValues())
      }, 300),
    [initialCollection],
  )

  useEffect(() => () => debouncedSearch.clear(), [debouncedSearch])

  const search = (value: string) => {
    setQuery(value)

    if (!value) {
      debouncedSearch.clear()
      // Remove expanded children before restoring the full collection.
      flushSync(() => {
        setCollection(emptyCollection)
        setExpanded(defaultExpandedValue ?? [])
      })
      setCollection(initialCollection)
      return
    }

    debouncedSearch(value)
  }

  return (
    <div className="w-full">
      <TextInput
        aria-label="Search JSON keys and values"
        className="mb-1"
        onValueChange={search}
        placeholder="Search keys and values: 'Stefan'"
        size="sm"
        startIcon={Search}
        value={query}
      />
      <JsonViewer.RootProvider
        className="max-h-96 overflow-auto"
        expandedValue={expanded}
        onExpandedValueChange={({expandedValue}) => setExpanded(expandedValue)}
        value={{...viewer, collection}}
      >
        <JsonViewer.Tree arrow={ChevronRight} indentGuide />
      </JsonViewer.RootProvider>
      {query && !collection.getNodeChildren(collection.rootNode).length && (
        <p className="font-body-sm text-neutral-secondary" role="status">
          No matching keys or values.
        </p>
      )}
    </div>
  )
}
