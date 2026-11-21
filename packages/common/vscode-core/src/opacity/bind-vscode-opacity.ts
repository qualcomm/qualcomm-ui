// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {hostOpacityTokens} from "@qualcomm-ui/vscode-core/tokens"

/**
 * Convert host color alpha to numeric opacity variables on a browser container.
 * Watches container and ancestor theme attributes; returns a cleanup function.
 * Unused-code fading is disabled in high-contrast themes, following host guidance.
 */
export function bindVscodeOpacity(container: HTMLElement): () => void {
  const document = container.ownerDocument
  const view = document.defaultView
  if (!view) {
    throw new Error("VS Code opacity binding requires a browser document.")
  }
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext("2d", {willReadFrequently: true})
  if (!context) {
    throw new Error("VS Code opacity binding requires a 2D canvas context.")
  }
  const ancestors: HTMLElement[] = []
  for (
    let element: HTMLElement | null = container;
    element;
    element = element.parentElement
  ) {
    ancestors.push(element)
  }
  const previous = hostOpacityTokens.map(({name}) => {
    const property = `--opacity-${name}`
    return {
      priority: container.style.getPropertyPriority(property),
      property,
      value: container.style.getPropertyValue(property),
    }
  })
  const update = (): void => {
    const style = view.getComputedStyle(container)
    const highContrast = ancestors.some(
      (element) =>
        element.classList.contains("vscode-high-contrast") ||
        element.classList.contains("vscode-high-contrast-light") ||
        element.getAttribute("data-vscode-theme-kind") ===
          "vscode-high-contrast" ||
        element.getAttribute("data-vscode-theme-kind") ===
          "vscode-high-contrast-light" ||
        ["dark-high-contrast", "light-high-contrast"].includes(
          element.getAttribute("data-vscode-preview-theme") ?? "",
        ),
    )
    for (const {name, variable} of hostOpacityTokens) {
      const value = style.getPropertyValue(variable).trim()
      let alpha = 1
      if (value && !(highContrast && name === "editor-unnecessary-code")) {
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = "#010203"
        context.fillStyle = value
        context.fillRect(0, 0, 1, 1)
        alpha = context.getImageData(0, 0, 1, 1).data[3] / 255
      }
      const property = `--opacity-${name}`
      if (container.style.getPropertyValue(property) !== String(alpha)) {
        container.style.setProperty(property, String(alpha))
      }
    }
  }
  const observer = new view.MutationObserver(update)
  for (const ancestor of ancestors) {
    observer.observe(ancestor, {
      attributeFilter: [
        "class",
        "style",
        "data-vscode-theme-kind",
        "data-vscode-theme-id",
        "data-vscode-preview-theme",
      ],
      attributes: true,
    })
  }
  update()
  return () => {
    observer.disconnect()
    for (const {priority, property, value} of previous) {
      if (value) {
        container.style.setProperty(property, value, priority)
      } else {
        container.style.removeProperty(property)
      }
    }
  }
}
