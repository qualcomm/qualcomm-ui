import type {ReactNode} from "react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {SimpleReactDemo} from "@qualcomm-ui/react-mdx/code-demo"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {SideNav} from "@qualcomm-ui/react/side-nav"
import {dedent} from "@qualcomm-ui/utils/dedent"

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
    <div className="mt-4 w-fit">
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

function SidebarOrderDemoComponent() {
  const collection = createTreeCollection<NavItem>({
    nodeChildren: "nodes",
    nodeText: (node) => node.text,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      nodes: [
        {id: "_index", text: "Introduction"},
        {id: "setup", text: "Setup"},
        {id: "help", text: "Help"},
      ],
      text: "",
    },
  })

  return (
    <div className="border-neutral-01 mt-4 w-fit rounded-sm border">
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

export function SidebarOrderDemo() {
  return (
    <SimpleReactDemo
      component={<SidebarOrderDemoComponent />}
      sourceCode={
        <CodeHighlight
          code={dedent`
            export default {
              navConfig: [
                {id: "_index", title: "Introduction"},
                {id: "setup"},
                {id: "help"},
              ]
            } satisfies QuiDocsConfig
          `}
          language="typescript"
        />
      }
    />
  )
}

function NavDemoShell({children}: {children: ReactNode}) {
  return (
    <div className="border-neutral-01 mt-4 w-fit rounded-sm border">
      {children}
    </div>
  )
}

function NavDemoNodes({
  collection,
}: {
  collection: ReturnType<typeof createTreeCollection<NavItem>>
}) {
  return (
    <>
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
    </>
  )
}

function NestedRoutesDemoComponent() {
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
      ],
      text: "",
    },
  })

  return (
    <NavDemoShell>
      <SideNav.Root collection={collection} defaultExpandedValue={["help"]}>
        <NavDemoNodes collection={collection} />
      </SideNav.Root>
    </NavDemoShell>
  )
}

export function NestedRoutesDemo() {
  return (
    <SimpleReactDemo
      component={<NestedRoutesDemoComponent />}
      sourceCode={
        <CodeHighlight
          code={dedent`
            export default {
              navConfig: [
                {id: "_index", title: "Introduction"},
                {
                  id: "help",
                  children: [{id: "troubleshooting"}],
                },
              ]
            } satisfies QuiDocsConfig
          `}
          language="typescript"
        />
      }
    />
  )
}

function NestedRouteOrderDemoComponent() {
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
          nodes: [
            {id: "overview", text: "Overview"},
            {id: "troubleshooting", text: "Troubleshooting"},
          ],
          text: "Help",
        },
      ],
      text: "",
    },
  })

  return (
    <NavDemoShell>
      <SideNav.Root collection={collection} defaultExpandedValue={["help"]}>
        <NavDemoNodes collection={collection} />
      </SideNav.Root>
    </NavDemoShell>
  )
}

export function NestedRouteOrderDemo() {
  return (
    <SimpleReactDemo
      component={<NestedRouteOrderDemoComponent />}
      sourceCode={
        <CodeHighlight
          code={dedent`
            export default {
              navConfig: [
                {id: "_index", title: "Introduction"},
                {
                  id: "help",
                  children: [
                    {id: "overview"},
                    {id: "troubleshooting"},
                  ],
                },
              ]
            } satisfies QuiDocsConfig
          `}
          language="typescript"
        />
      }
    />
  )
}

function FolderTitlesDemoComponent() {
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
          text: "Help Center",
        },
      ],
      text: "",
    },
  })

  return (
    <NavDemoShell>
      <SideNav.Root collection={collection} defaultExpandedValue={["help"]}>
        <NavDemoNodes collection={collection} />
      </SideNav.Root>
    </NavDemoShell>
  )
}

export function FolderTitlesDemo() {
  return (
    <SimpleReactDemo
      component={<FolderTitlesDemoComponent />}
      sourceCode={
        <CodeHighlight
          code={dedent`
            export default {
              navConfig: [
                {id: "_index", title: "Introduction"},
                {
                  id: "help",
                  title: "Help Center",
                  children: [{id: "troubleshooting"}],
                },
              ]
            } satisfies QuiDocsConfig
          `}
          language="typescript"
        />
      }
    />
  )
}

function GroupsDemoComponent() {
  const collection = createTreeCollection<NavItem>({
    nodeChildren: "nodes",
    nodeText: (node) => node.text,
    nodeValue: (node) => node.id,
    rootNode: {
      id: "ROOT",
      nodes: [
        {id: "_index", text: "Introduction"},
        {id: "installation", text: "Installation"},
        {id: "configuration", text: "Configuration"},
        {id: "api", text: "API"},
      ],
      text: "",
    },
  })

  return (
    <NavDemoShell>
      <SideNav.Root collection={collection}>
        <SideNav.Nodes
          key="_index"
          indexPath={[0]}
          node={collection.rootNode.nodes![0]}
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
        <SideNav.Group>
          <SideNav.Divider />
          <SideNav.GroupLabel>Setup</SideNav.GroupLabel>
          {[1, 2].map((i) => (
            <SideNav.Nodes
              key={collection.getNodeValue(collection.rootNode.nodes![i])}
              indexPath={[i]}
              node={collection.rootNode.nodes![i]}
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
        </SideNav.Group>
        <SideNav.Group>
          <SideNav.Divider />
          <SideNav.GroupLabel>Reference</SideNav.GroupLabel>
          <SideNav.Nodes
            key="api"
            indexPath={[3]}
            node={collection.rootNode.nodes![3]}
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
        </SideNav.Group>
      </SideNav.Root>
    </NavDemoShell>
  )
}

export function GroupsDemo() {
  return (
    <SimpleReactDemo
      component={<GroupsDemoComponent />}
      sourceCode={
        <CodeHighlight
          code={dedent`
            export default {
              navConfig: [
                {id: "_index", title: "Introduction"},
                {sectionTitle: "Setup", separator: true},
                {id: "installation"},
                {id: "configuration"},
                {sectionTitle: "Reference", separator: true},
                {id: "api"},
              ]
            } satisfies QuiDocsConfig
          `}
          language="typescript"
        />
      }
    />
  )
}

function ExpandedStateDemoComponent() {
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
    <NavDemoShell>
      <SideNav.Root collection={collection} defaultExpandedValue={["help"]}>
        <NavDemoNodes collection={collection} />
      </SideNav.Root>
    </NavDemoShell>
  )
}

export function ExpandedStateDemo() {
  return (
    <SimpleReactDemo
      component={<ExpandedStateDemoComponent />}
      sourceCode={
        <CodeHighlight
          code={dedent`
            export default {
              navConfig: [
                {id: "setup"},
                {
                  expanded: true,
                  id: "help",
                  children: [{id: "troubleshooting"}],
                },
              ]
            } satisfies QuiDocsConfig
          `}
          language="typescript"
        />
      }
    />
  )
}
