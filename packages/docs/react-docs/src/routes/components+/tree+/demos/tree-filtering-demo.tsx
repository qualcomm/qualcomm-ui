import {type ReactElement, useState} from "react"

import {FileText, FolderIcon, Search} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {TextInput} from "@qualcomm-ui/react/text-input"
import {Tree} from "@qualcomm-ui/react/tree"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {matchSorter} from "@qualcomm-ui/utils/match-sorter"

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

export default function Demo(): ReactElement {
  const [collection, setCollection] =
    useState<TreeCollection<Node>>(initialCollection)
  const [expanded, setExpanded] = useState<string[]>([])
  const [query, setQuery] = useState<string>("")

  const search = (value: string) => {
    setQuery(value)

    if (!value) {
      setCollection(initialCollection)
      return
    }

    const nodes = matchSorter(initialCollection.getDescendantNodes(), value, {
      keys: ["name"],
    })
    const nextCollection = initialCollection.filter((node) =>
      nodes.some((n) => n.id === node.id),
    )
    setCollection(nextCollection)
    setExpanded(nextCollection.getBranchValues())
  }

  return (
    <Tree.Root
      className="w-full max-w-sm"
      collection={initialCollection}
      expandedValue={expanded}
      onExpandedValueChange={({expandedValue}) => setExpanded(expandedValue)}
    >
      <TextInput
        className="mb-1"
        onValueChange={search}
        placeholder="Search for files: 'react'"
        size="sm"
        startIcon={Search}
        value={query}
      />
      {collection.rootNode.nodes?.map((parentNode, index) => {
        return (
          <Tree.Nodes
            key={parentNode.id}
            indexPath={[index]}
            node={parentNode}
            renderBranch={({node}) => (
              <Tree.BranchNode>
                <Tree.NodeIndicator />
                <Tree.BranchTrigger />
                <Tree.NodeIcon icon={FolderIcon} />
                <Tree.NodeText>{node.name}</Tree.NodeText>
              </Tree.BranchNode>
            )}
            renderLeaf={({node}) => (
              <Tree.LeafNode>
                <Tree.NodeIndicator />
                <Tree.NodeIcon icon={FileText} />
                <Tree.NodeText>{node.name}</Tree.NodeText>
              </Tree.LeafNode>
            )}
          />
        )
      })}
    </Tree.Root>
  )
}

const initialCollection = createTreeCollection<Node>({
  nodeChildren: "nodes",
  nodeText: (node) => node.name,
  nodeValue: (node) => node.id,
  rootNode: {
    id: "ROOT",
    name: "",
    nodes: [
      {
        id: "node_modules",
        name: "node_modules",
        nodes: [
          {
            id: "@qui",
            name: "@qui",
            nodes: [
              {id: "node_modules/@qualcomm-ui/core", name: "@qualcomm-ui/core"},
              {
                id: "node_modules/@qualcomm-ui/react",
                name: "@qualcomm-ui/react",
              },
              {
                id: "node_modules/@qualcomm-ui/react-core",
                name: "@qualcomm-ui/react-core",
              },
            ],
          },
          {
            id: "node_modules/@types",
            name: "@types",
            nodes: [
              {id: "node_modules/@types/react", name: "react"},
              {id: "node_modules/@types/react-dom", name: "react-dom"},
            ],
          },
        ],
      },
      {
        id: "src",
        name: "src",
        nodes: [
          {id: "src/app.tsx", name: "app.tsx"},
          {id: "src/index.ts", name: "index.ts"},
        ],
      },
      {id: "prettier.config.js", name: "prettier.config.js"},
      {id: "package.json", name: "package.json"},
      {id: "tsconfig.json", name: "tsconfig.json"},
    ],
  },
})
