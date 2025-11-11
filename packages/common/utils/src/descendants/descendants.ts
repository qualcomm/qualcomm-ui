/**
 * Sort an array of DOM nodes according to the HTML tree order.
 * {@link http://www.w3.org/TR/html5/infrastructure.html#tree-order Reference}
 */
function sortNodes(nodes: Node[]): Node[] {
  return nodes.sort((a, b) => {
    const compare = a.compareDocumentPosition(b)

    if (
      compare & Node.DOCUMENT_POSITION_FOLLOWING ||
      compare & Node.DOCUMENT_POSITION_CONTAINED_BY
    ) {
      // a < b
      return -1
    }

    if (
      compare & Node.DOCUMENT_POSITION_PRECEDING ||
      compare & Node.DOCUMENT_POSITION_CONTAINS
    ) {
      // a > b
      return 1
    }

    if (
      compare & Node.DOCUMENT_POSITION_DISCONNECTED ||
      compare & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
    ) {
      throw Error("Cannot sort the given nodes.")
    } else {
      return 0
    }
  })
}

const isElement = (el: any): el is HTMLElement =>
  typeof el === "object" &&
  "nodeType" in el &&
  el.nodeType === Node.ELEMENT_NODE

function getNextIndex(current: number, max: number, loop: boolean): number {
  let next = current + 1
  if (loop && next >= max) {
    next = 0
  }
  return next
}

function getPrevIndex(current: number, max: number, loop: boolean): number {
  let next = current - 1
  if (loop && next < 0) {
    next = max
  }
  return next
}

export type DescendantOptions<T = object> = T & {
  /**
   * If `true`, the item will be registered in all nodes map
   * but omitted from enabled nodes map
   */
  disabled?: boolean

  /**
   * The id of the item
   */
  id?: string

  /**
   * Callback fired when the descendant unregisters.
   */
  onUnregister?: (index: number) => void

  /**
   * If `true`, the context must exist
   */
  requireContext?: boolean
}

export type Descendant<T, K> = DescendantOptions<K> & {
  /**
   * index of item in all nodes map and enabled nodes map
   */
  index: number
  /**
   * DOM element of the item
   */
  node: T
}

/**
 * @internal
 * Class to manage DOM descendants and their relative indices by order of appearance.
 */
export class DescendantsManager<
  T extends HTMLElement,
  K extends Record<string, any> = object,
> {
  private descendants = new Map<T, Descendant<T, K>>()

  register(
    nodeOrOptions: T | null | DescendantOptions<K>,
  ): undefined | (() => void) | ((node: T | null) => void) | void {
    if (nodeOrOptions == null) {
      return
    }

    if (isElement(nodeOrOptions)) {
      return this.registerNode(nodeOrOptions)
    }

    return (node: T | null) => {
      this.registerNode(node, nodeOrOptions)
    }
  }

  unregister(node: T): void {
    this.descendants.delete(node)
    const sorted = sortNodes(Array.from(this.descendants.keys()))
    this.assignIndex(sorted)
  }

  destroy(): void {
    this.descendants.clear()
  }

  private assignIndex(descendants: Node[]) {
    this.descendants.forEach((descendant) => {
      const index = descendants.indexOf(descendant.node)
      descendant.index = index
      if (descendant.node) {
        descendant.node.dataset["index"] = descendant.index.toString()
      }
    })
  }

  count(): number {
    return this.descendants.size
  }

  enabledCount(): number {
    return this.enabledValues().length
  }

  values(): Descendant<T, K>[] {
    const values = Array.from(this.descendants.values())
    return values.sort((a, b) => a.index - b.index)
  }

  enabledValues(): Descendant<T, K>[] {
    return this.values().filter(
      (descendant) =>
        !descendant.disabled && descendant?.node?.ariaDisabled !== "true",
    )
  }

  item(index: number): Descendant<T, K> | undefined {
    if (this.count() === 0) {
      return undefined
    }
    return this.values()[index]
  }

  disableItem(indexOrNode: number | T): boolean | undefined {
    if (this.count() === 0) {
      return undefined
    }
    if (typeof indexOrNode === "number") {
      if (!this.values()[indexOrNode]) {
        return undefined
      }
      this.values()[indexOrNode].disabled = true
    } else {
      if (!this.descendants.has(indexOrNode)) {
        return undefined
      }
      this.descendants.get(indexOrNode)!.disabled = true
    }

    return true
  }

  enableItem(index: number): boolean | undefined {
    if (this.count() === 0 || !this.values()[index]) {
      return undefined
    }
    this.values()[index].disabled = false
    return true
  }

  enabledItem(index: number): Descendant<T, K> | undefined {
    if (this.enabledCount() === 0) {
      return undefined
    }
    return this.enabledValues()[index]
  }

  first(): Descendant<T, K> | undefined {
    return this.item(0)
  }

  firstEnabled(): Descendant<T, K> | undefined {
    return this.enabledItem(0)
  }

  last(): Descendant<T, K> | undefined {
    return this.item(this.descendants.size - 1)
  }

  lastEnabled(): Descendant<T, K> | undefined {
    const lastIndex = this.enabledValues().length - 1
    return this.enabledItem(lastIndex)
  }

  indexOf(node: T | null): number {
    if (!node) {
      return -1
    }
    return this.descendants.get(node)?.index ?? -1
  }

  enabledIndexOf(node: T | null): number {
    if (node == null) {
      return -1
    }
    return this.enabledValues().findIndex((i) => i.node.isSameNode(node))
  }

  next(index: number, loop = true): Descendant<T, K> | undefined {
    const next = getNextIndex(index, this.count(), loop)
    return this.item(next)
  }

  nextEnabled(index: number, loop = true): Descendant<T, K> | undefined {
    const item = this.item(index)
    if (!item) {
      return
    }
    const enabledIndex = this.enabledIndexOf(item.node)
    const nextEnabledIndex = getNextIndex(
      enabledIndex,
      this.enabledCount(),
      loop,
    )
    return this.enabledItem(nextEnabledIndex)
  }

  prev(index: number, loop = true): Descendant<T, K> | undefined {
    const prev = getPrevIndex(index, this.count() - 1, loop)
    return this.item(prev)
  }

  prevEnabled(index: number, loop = true): Descendant<T, K> | undefined {
    const item = this.item(index)
    if (!item) {
      return
    }
    const enabledIndex = this.enabledIndexOf(item.node)
    const prevEnabledIndex = getPrevIndex(
      enabledIndex,
      this.enabledCount() - 1,
      loop,
    )
    return this.enabledItem(prevEnabledIndex)
  }

  private registerNode(node: T | null, options?: DescendantOptions<K>) {
    if (!node || this.descendants.has(node)) {
      return
    }

    const keys = Array.from(this.descendants.keys()).concat(node)
    const sorted = sortNodes(keys)

    if (options?.disabled) {
      options.disabled = !!options.disabled
    }

    const descendant = {index: -1, node, ...options}

    this.descendants.set(node, descendant as Descendant<T, K>)

    this.assignIndex(sorted)
  }

  hasNode(node: T | undefined): boolean {
    return !!node && this.descendants.has(node)
  }
}
