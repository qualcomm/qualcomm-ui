// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {contains} from "@qualcomm-ui/dom/query"

export type LayerType =
  | "dialog"
  | "popover"
  | "menu"
  | "listbox"
  | (string & {})

export interface LayerDismissEventDetail {
  originalIndex: number
  originalLayer: HTMLElement
  targetIndex: number
  targetLayer: HTMLElement | undefined
}

export type LayerDismissEvent = CustomEvent<LayerDismissEventDetail>

export interface Layer {
  dismiss: VoidFunction
  node: HTMLElement
  pointerBlocking?: boolean | undefined
  requestDismiss?: ((event: LayerDismissEvent) => void) | undefined
  type: LayerType
}

const LAYER_REQUEST_DISMISS_EVENT = "layer:request-dismiss"

export const layerStack = {
  add(layer: Layer): void {
    this.layers.push(layer)
    this.syncLayers()
  },
  addBranch(node: HTMLElement): void {
    this.branches.push(node)
  },
  branches: [] as HTMLElement[],
  clear(): void {
    this.remove(this.layers[0].node)
  },
  count(): number {
    return this.layers.length
  },
  countNestedLayersOfType(node: HTMLElement, type: LayerType): number {
    return this.getNestedLayersByType(node, type).length
  },
  dismiss(node: HTMLElement, parent?: HTMLElement): void {
    // Create and dispatch the preventable event
    const index = this.indexOf(node)
    if (index === -1) {
      return
    }

    const layer = this.layers[index]

    addListenerOnce(node, LAYER_REQUEST_DISMISS_EVENT, (event) => {
      layer.requestDismiss?.(event)
      if (!event.defaultPrevented) {
        layer?.dismiss()
      }
    })

    fireCustomEvent(node, LAYER_REQUEST_DISMISS_EVENT, {
      originalIndex: index,
      originalLayer: node,
      targetIndex: parent ? this.indexOf(parent) : -1,
      targetLayer: parent,
    })

    this.syncLayers()
  },
  getLayersByType(type: LayerType): Layer[] {
    return this.layers.filter((layer) => layer.type === type)
  },
  getNestedLayers(node: HTMLElement): Layer[] {
    return Array.from(this.layers).slice(this.indexOf(node) + 1)
  },
  getNestedLayersByType(node: HTMLElement, type: LayerType): Layer[] {
    const index = this.indexOf(node)
    if (index === -1) {
      return []
    }
    return this.layers.slice(index + 1).filter((layer) => layer.type === type)
  },
  getParentLayerOfType(node: HTMLElement, type: LayerType): Layer | undefined {
    const index = this.indexOf(node)
    if (index <= 0) {
      return undefined
    }
    return this.layers
      .slice(0, index)
      .reverse()
      .find((layer) => layer.type === type)
  },
  hasPointerBlockingLayer(): boolean {
    return this.pointerBlockingLayers().length > 0
  },
  indexOf(node: HTMLElement | undefined): number {
    return this.layers.findIndex((layer) => layer.node === node)
  },
  isBelowPointerBlockingLayer(node: HTMLElement): boolean {
    const index = this.indexOf(node)
    const highestBlockingIndex = this.topMostPointerBlockingLayer()
      ? this.indexOf(this.topMostPointerBlockingLayer()?.node)
      : -1
    return index < highestBlockingIndex
  },
  isInBranch(target: HTMLElement | EventTarget | null): boolean {
    return Array.from(this.branches).some((branch) => contains(branch, target))
  },
  isInNestedLayer(
    node: HTMLElement,
    target: HTMLElement | EventTarget | null,
  ): boolean {
    return this.getNestedLayers(node).some((layer) =>
      contains(layer.node, target),
    )
  },
  isTopMost(node: HTMLElement | null): boolean {
    const layer = this.layers[this.count() - 1]
    return layer?.node === node
  },
  layers: [] as Layer[],
  pointerBlockingLayers(): Layer[] {
    return this.layers.filter((layer) => layer.pointerBlocking)
  },
  remove(node: HTMLElement): void {
    const index = this.indexOf(node)
    if (index < 0) {
      return
    }

    // dismiss nested layers
    if (index < this.count() - 1) {
      const _layers = this.getNestedLayers(node)
      _layers.forEach((layer) => layerStack.dismiss(layer.node, node))
    }

    // remove this layer
    this.layers.splice(index, 1)
    this.syncLayers()
  },
  removeBranch(node: HTMLElement): void {
    const index = this.branches.indexOf(node)
    if (index >= 0) {
      this.branches.splice(index, 1)
    }
  },
  syncLayers(): void {
    this.layers.forEach((layer, index) => {
      layer.node.style.setProperty("--layer-index", `${index}`)

      // Remove previous data attributes
      layer.node.removeAttribute("data-nested")
      layer.node.removeAttribute("data-has-nested")

      // Check if this layer is nested within another of the same type
      const parentOfSameType = this.getParentLayerOfType(layer.node, layer.type)
      if (parentOfSameType) {
        layer.node.setAttribute("data-nested", layer.type)
      }

      // Check if this layer has nested layers of the same type
      const nestedCount = this.countNestedLayersOfType(layer.node, layer.type)
      if (nestedCount > 0) {
        layer.node.setAttribute("data-has-nested", layer.type)
      }

      // Set the nested layer count
      layer.node.style.setProperty("--nested-layer-count", `${nestedCount}`)
    })
  },
  topMostPointerBlockingLayer(): Layer | undefined {
    return [...this.pointerBlockingLayers()].slice(-1)[0]
  },
}

function fireCustomEvent(
  el: HTMLElement,
  type: string,
  detail?: LayerDismissEventDetail,
) {
  const win = el.ownerDocument.defaultView || window
  const event = new win.CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail,
  })
  return el.dispatchEvent(event)
}

function addListenerOnce(
  el: HTMLElement,
  type: string,
  callback: (event: LayerDismissEvent) => void,
) {
  el.addEventListener(type, callback as EventListener, {once: true})
}
