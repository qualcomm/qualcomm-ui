import {useState} from "react"

import {SideNav} from "@qualcomm-ui/react/side-nav"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {matchSorter} from "@qualcomm-ui/utils/match-sorter"

import {
  collection as initialCollection,
  type SideNavItem,
} from "./grouped-items"
import {QLogo} from "./q-logo"

export function SideNavFilteringDemo() {
  const [collection, setCollection] =
    useState<TreeCollection<SideNavItem>>(initialCollection)
  const [expandedValue, setExpandedValue] = useState<string[]>([])
  const [query, setQuery] = useState<string>("")

  const search = (value: string) => {
    setQuery(value)

    if (!value) {
      setCollection(initialCollection)
      return
    }

    const nodes = matchSorter<SideNavItem>(
      initialCollection.getDescendantNodes(),
      value,
      {
        keys: [
          "group",
          "text",
          (item) => {
            // also include children of grouped items
            return initialCollection
              .getParentNodes(item.id)
              .map((node) => node.group)
              .filter(Boolean) as string[]
          },
        ],
      },
    )

    const nextCollection = initialCollection.filter((node) =>
      nodes.some((n) => n.id === node.id),
    )
    setCollection(nextCollection)
    setExpandedValue(nextCollection.getBranchValues())
  }

  return (
    <div className="flex justify-center">
      <SideNav.Root
        collection={collection}
        expandedValue={expandedValue}
        onExpandedValueChange={(details) =>
          setExpandedValue(details.expandedValue)
        }
      >
        <SideNav.Header>
          <SideNav.HeaderLogo>
            <QLogo />
          </SideNav.HeaderLogo>
          <SideNav.HeaderTitle>Qualcomm</SideNav.HeaderTitle>
        </SideNav.Header>

        <SideNav.FilterInput onValueChange={search} value={query} />

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
