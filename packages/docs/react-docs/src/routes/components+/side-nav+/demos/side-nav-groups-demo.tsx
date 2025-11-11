import {SideNav} from "@qualcomm-ui/react/side-nav"

import {collection} from "./grouped-items"
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

        {collection
          .groupChildren([], (node) => node.group ?? "ungrouped", [
            "ungrouped",
            "Main menu",
          ])
          .map((group) => (
            <SideNav.Group key={group.key}>
              <SideNav.Divider />

              {group.key === "ungrouped" ? null : (
                <SideNav.GroupLabel>{group.key}</SideNav.GroupLabel>
              )}
              {group.items.map(({indexPath, node}) => (
                <SideNav.Nodes
                  key={collection.getNodeValue(node)}
                  indexPath={indexPath}
                  node={node}
                  renderBranch={({node}) => (
                    <SideNav.BranchNode>
                      <SideNav.NodeIndicator />
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
            </SideNav.Group>
          ))}
      </SideNav.Root>
    </div>
  )
}
