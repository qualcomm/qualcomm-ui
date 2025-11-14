import {SideNav} from "@qualcomm-ui/react/side-nav"

import {collection} from "./items"
import {QLogo} from "./q-logo"

export default function Demo() {
  return (
    <div className="flex justify-center">
      <SideNav.Root collection={collection}>
        <SideNav.Header>
          <SideNav.HeaderLogo>
            <QLogo />
          </SideNav.HeaderLogo>
          <SideNav.HeaderTitle>Qualcomm</SideNav.HeaderTitle>
        </SideNav.Header>

        {collection.rootNode.nodes?.map((parentNode, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(parentNode)}
            indexPath={[index]}
            node={parentNode}
            renderBranch={({node}) => (
              <SideNav.BranchNode>
                {node.icon ? <SideNav.NodeIcon icon={node.icon} /> : null}
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({node}) => (
              <SideNav.LeafNode>
                <SideNav.NodeIndicator />
                {node.icon ? <SideNav.NodeIcon icon={node.icon} /> : null}
                <SideNav.NodeText>{node.text}</SideNav.NodeText>
              </SideNav.LeafNode>
            )}
          />
        ))}
      </SideNav.Root>
    </div>
  )
}
