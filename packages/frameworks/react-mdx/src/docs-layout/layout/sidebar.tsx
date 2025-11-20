// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {createTreeCollection} from "@qualcomm-ui/core/tree"
import type {NavItem} from "@qualcomm-ui/mdx-common"
import {SideNav} from "@qualcomm-ui/react/side-nav"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {TreeCollection} from "@qualcomm-ui/utils/collection"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {matchSorter} from "@qualcomm-ui/utils/match-sorter"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useMdxDocsLayoutContext} from "./use-mdx-docs-layout"

export interface SidebarProps extends Omit<ElementRenderProp<"div">, "dir"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * If supplied, this will be the contents of the side nav header.
   */
  children?: ReactNode

  /**
   * If `true`, the side navigation will feature a text input that filters the
   * results on type.
   *
   * @default true
   */
  filterable?: boolean

  /**
   * When rendered in the mobile drawer, this is used to trigger the useEffect that
   * scrolls the active item into view.
   */
  mobileDrawerState?: boolean

  /**
   * Apply sticky positioning to the header so it always stays in view.
   */
  stickyHeader?: boolean
}

export function Sidebar({
  children,
  filterable = true,
  mobileDrawerState,
  stickyHeader,
  ...props
}: SidebarProps): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null)
  const {navItems, pathname} = useMdxDocsLayoutContext()
  const {renderLink: RenderLink} = useMdxDocsContext()

  const initialCollection = useMemo(
    () =>
      createTreeCollection<NavItem>({
        nodeChildren: "items",
        nodeText: "title",
        nodeValue: "id",
        rootNode: {
          depth: 0,
          id: "ROOT",
          items: navItems,
          pathSegments: [],
          title: "",
        },
      }),
    [navItems],
  )

  const [query, setQuery] = useState<string>("")
  const [collection, setCollection] =
    useState<TreeCollection<NavItem>>(initialCollection)
  const [expandedValue, setExpandedValue] = useState<string[]>(
    getExpandedItems(navItems, pathname),
  )

  function onSelectedValueChange(value: string[]) {
    // eagerly set the selected value so that the active item is highlighted
    // immediately. Otherwise, the active item will be highlighted only after the
    // next route loads (slight delay)
    const node = collection.findNodeBy((node) => node.id === value[0])
    if (node?.pathname) {
      setSelectedValue(value)
    }
  }

  function getSelectedValue() {
    const node = collection.findNodeBy((node) => node.pathname === pathname)
    if (node) {
      return [node.id]
    }
    return []
  }

  const [selectedValue, setSelectedValue] = useState<string[]>(() =>
    getSelectedValue(),
  )

  const initialExpandedValue = useRef<string[]>(expandedValue)

  useSafeLayoutEffect(() => {
    setSelectedValue(getSelectedValue())
  }, [pathname])

  useEffect(() => {
    const node = collection.findNodeBy((node) => node.pathname === pathname)
    if (node) {
      const parents = collection.getParentNodes(node.id)
      if (parents.length) {
        setExpandedValue((prev) => [...prev, ...parents.map((node) => node.id)])
      }
    }
  }, [collection, pathname])

  const search = (value: string) => {
    setQuery(value)

    if (!value) {
      setCollection(initialCollection)
      setExpandedValue(initialExpandedValue.current)
      return
    }

    const nodes = matchSorter<NavItem>(
      initialCollection.getDescendantNodes(),
      value,
      {
        keys: [
          "group",
          "title",
          "searchMeta.*",
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

  const scrollIntoView = useCallback(() => {
    if (!ref.current) {
      return
    }
    const visibleItems = Array.from(ref.current.querySelectorAll("a"))
    // find the active item
    const item = visibleItems.find(
      (item) => item.getAttribute("href") === pathname,
    )
    if (!item) {
      return
    }
    // if the item is already visible, do nothing. Otherwise, scroll it into view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // scroll it into view.
          item.scrollIntoView({block: "nearest", inline: "nearest"})
          const itemRect = item.getBoundingClientRect()
          // account for the offset if scrolling from bottom to top.
          if (itemRect.top - 100 < 0) {
            const scrollPos = ref.current!.scrollTop
            ref.current!.scrollTo(0, Math.max(scrollPos - 60, 0))
          }
          observer.disconnect()
        } else {
          observer.disconnect()
        }
      },
      {threshold: 0.1},
    )

    observer.observe(item)
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (isDefined(mobileDrawerState)) {
        scrollIntoView()
      }
    })
  }, [mobileDrawerState, scrollIntoView])

  // scroll the active item into view when the sidebar is first rendered, like on
  // page load.
  useEffect(() => {
    scrollIntoView()
  }, [scrollIntoView])

  const mergedProps = mergeProps(
    {className: "qui-docs-sidebar__root", ref},
    props,
  )

  return (
    <div {...mergedProps}>
      <SideNav.Root
        collection={collection}
        expandedValue={expandedValue}
        onExpandedValueChange={(details) =>
          setExpandedValue(details.expandedValue)
        }
        onSelectedValueChange={(details) => {
          onSelectedValueChange(details.selectedValue)
        }}
        selectedValue={selectedValue}
        surface="secondary"
      >
        {children ? (
          <SideNav.Header data-sticky={booleanDataAttr(stickyHeader)}>
            {children}
          </SideNav.Header>
        ) : null}

        {filterable ? (
          <>
            <SideNav.FilterInput
              onValueChange={search}
              placeholder="Filter..."
              value={query}
            />
            <SideNav.Divider className="qui-docs-sidebar__group-separator" />
          </>
        ) : null}

        {collection.rootNode.items!.map((item, index) => (
          <SideNav.Nodes
            key={collection.getNodeValue(item)}
            indexPath={[index]}
            node={item}
            renderBranch={({node}) => (
              <SideNav.BranchNode
                // TODO: deprecate route navigation from branch nodes (anti-pattern)
                render={
                  node.pathname ? <RenderLink href={node.pathname} /> : <div />
                }
              >
                <SideNav.NodeText>{node.title}</SideNav.NodeText>
                <SideNav.BranchTrigger />
              </SideNav.BranchNode>
            )}
            renderLeaf={({indexPath, node}) => {
              const depthStyle = {
                "--depth": indexPath.length,
              } as CSSProperties
              const nested = booleanDataAttr(indexPath.length > 1)

              if (node.sectionTitle) {
                return (
                  <>
                    {node.separator ? (
                      <SideNav.Divider
                        className="qui-docs-sidebar__group-separator"
                        data-nested={nested}
                        style={depthStyle}
                      />
                    ) : null}
                    <SideNav.GroupLabel
                      className="qui-docs-sidebar__group-label"
                      data-nested={nested}
                      style={depthStyle}
                    >
                      {node.sectionTitle}
                    </SideNav.GroupLabel>
                  </>
                )
              }

              if (node.separator) {
                return (
                  <SideNav.Divider
                    className="qui-docs-sidebar__group-separator"
                    data-nested={nested}
                    style={depthStyle}
                  />
                )
              }

              return (
                <SideNav.LeafNode
                  render={
                    node.pathname ? (
                      <RenderLink href={node.pathname} />
                    ) : (
                      <div />
                    )
                  }
                >
                  <SideNav.NodeIndicator />
                  <SideNav.NodeText>{node.title}</SideNav.NodeText>
                </SideNav.LeafNode>
              )
            }}
            showIndentGuide
          />
        ))}
      </SideNav.Root>
    </div>
  )
}

/**
 * Initializes the nav item expanded state by iterating through each node, including
 * child nodes. If an item is active, its parents must be expanded. This situation
 * covers the scenario where the user lands on a deeply nested route.
 */
function getExpandedItems(items: NavItem[], pathname: string): string[] {
  return items.reduce((acc: string[], current) => {
    const id = current.id
    const expandedChildren = getExpandedItems(current.items ?? [], pathname)
    // If an item does not have sub-items, it cannot be expanded.
    if (
      pathname === id ||
      expandedChildren?.length ||
      (current.expanded && current.items?.length)
    ) {
      acc.push(id)
    }
    return [...acc, ...expandedChildren]
  }, [])
}
