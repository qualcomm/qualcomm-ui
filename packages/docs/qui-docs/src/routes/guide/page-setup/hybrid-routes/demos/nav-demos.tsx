import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {SideNav} from "@qualcomm-ui/react/side-nav"

interface NavItem {
  id: string
  nodes?: NavItem[]
  text: string
}

export function SimpleTwoItemNav() {
  const collection = createTreeCollection<NavItem>({
    nodeChildren: "nodes",
    nodeText: (node) => node.text,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      nodes: [
        {id: "_index", text: "Introduction"},
        {id: "setup", text: "Setup"},
      ],
      text: "",
    },
  })

  return (
    <div className="mt-4 w-fit pb-1.5">
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(node)}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}

export function NestedCollapsedNav() {
  const collection = createTreeCollection<NavItem>({
    nodeChildren: "nodes",
    nodeText: (node) => node.text,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      nodes: [
        {id: "_index", text: "Introduction"},
        {
          id: "help",
          nodes: [{id: "troubleshooting", text: "Troubleshooting"}],
          text: "Help",
        },
        {id: "setup", text: "Setup"},
      ],
      text: "",
    },
  })

  return (
    <div className="mt-4 w-fit pb-1.5">
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(node)}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}

export function ReorderedItemsNav() {
  const collection = createTreeCollection<NavItem>({
    nodeChildren: "nodes",
    nodeText: (node) => node.text,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      nodes: [
        {id: "_index", text: "Introduction"},
        {id: "setup", text: "Setup"},
        {
          id: "help",
          nodes: [{id: "troubleshooting", text: "Troubleshooting"}],
          text: "Help",
        },
      ],
      text: "",
    },
  })

  return (
    <div className="mt-4 w-fit pb-1.5">
      <SideNav.Root collection={collection}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(node)}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}

export function ExpandedNestedNav() {
  const collection = createTreeCollection<NavItem>({
    nodeChildren: "nodes",
    nodeText: (node) => node.text,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      nodes: [
        {id: "_index", text: "Introduction"},
        {id: "setup", text: "Setup"},
        {
          id: "help",
          nodes: [{id: "troubleshooting", text: "Troubleshooting"}],
          text: "Help",
        },
      ],
      text: "",
    },
  })

  return (
    <div className="mt-4 w-fit pb-1.5">
      <SideNav.Root collection={collection} defaultExpandedValue={["help"]}>
        {collection.rootNode.nodes?.map((node, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(node)}
            indexPath={[index]}
            node={node}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}
