// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import figma from "@figma/code-connect"
import {FileText, FolderIcon} from "lucide-react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import type {QdsTreeSize} from "@qualcomm-ui/qds-core/tree"
import {Tree} from "@qualcomm-ui/react/tree"

// Tree Branch / Leaf are mapped via raw templates in
// ./tree-branch.figma.js and ./tree-leaf.figma.js

interface Node {
  id: string
  name: string
  nodes?: Node[]
}

const collection = createTreeCollection<Node>({
  nodeText: "name",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    name: "",
    nodes: [
      {
        id: "folder",
        name: "Folder",
        nodes: [{id: "file", name: "File"}],
      },
    ],
  },
})

const sharedRootProps = {
  size: figma.enum<QdsTreeSize>("size", {
    sm: "sm",
  }),
}

// Tree - icon variant
figma.connect(Tree.Root, "<FIGMA_COMPONENTS_BASE>?node-id=9077-12455", {
  example: (props) => (
    <Tree.Root
      collection={collection}
      defaultExpandedValue={["folder"]}
      {...props}
    >
      {collection.rootNode.nodes?.map((node, index) => (
        <Tree.Nodes
          key={node.id}
          indexPath={[index]}
          node={node}
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
      ))}
    </Tree.Root>
  ),
  props: sharedRootProps,
  variant: {variant: "icon"},
})

// Tree - text variant
figma.connect(Tree.Root, "<FIGMA_COMPONENTS_BASE>?node-id=9077-12455", {
  example: (props) => (
    <Tree.Root collection={collection} {...props}>
      {collection.rootNode.nodes?.map((node, index) => (
        <Tree.Nodes
          key={node.id}
          indexPath={[index]}
          node={node}
          renderBranch={({node}) => (
            <Tree.BranchNode>
              <Tree.BranchTrigger />
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.BranchNode>
          )}
          renderLeaf={({node}) => (
            <Tree.LeafNode>
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.LeafNode>
          )}
        />
      ))}
    </Tree.Root>
  ),
  props: sharedRootProps,
  variant: {variant: "text"},
})

// Tree - checkbox variant
figma.connect(Tree.Root, "<FIGMA_COMPONENTS_BASE>?node-id=9077-12455", {
  example: (props) => (
    <Tree.Root collection={collection} {...props}>
      {collection.rootNode.nodes?.map((node, index) => (
        <Tree.Nodes
          key={node.id}
          indexPath={[index]}
          node={node}
          renderBranch={({node}) => (
            <Tree.BranchNode>
              <Tree.BranchTrigger />
              <Tree.NodeCheckbox />
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.BranchNode>
          )}
          renderLeaf={({node}) => (
            <Tree.LeafNode>
              <Tree.NodeCheckbox />
              <Tree.NodeText>{node.name}</Tree.NodeText>
            </Tree.LeafNode>
          )}
        />
      ))}
    </Tree.Root>
  ),
  props: sharedRootProps,
  variant: {variant: "checkbox"},
})

// Tree Item Checkbox
figma.connect(
  Tree.NodeCheckbox,
  "<FIGMA_COMPONENTS_BASE>?node-id=10294-352983",
  {
    example: () => <Tree.NodeCheckbox />,
  },
)
