// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export const layers: string[] = [
  "app",
  "pages",
  "widgets",
  "features",
  "entities",
  "data",
  "shared",
]

export const segments: string[] = [
  "ui",
  "services",
  "api",
  "state",
  "model",
  "config",
  "assets",
]

/**
 * @param layer {string} the fsd layer identifier. Lower layers cannot import from higher layers.
 *
 * @returns {string[]} all the layers below a given layer.
 */
export function getLowerLayers(layer: string): string[] {
  return layers.slice(layers.indexOf(layer) + 1)
}

/**
 * @param layer {string} the fsd layer identifier.
 *
 * @returns {string[]} all the layers above a given layer.
 */
export function getUpperLayers(layer: string): string[] {
  return layers.slice(0, layers.indexOf(layer))
}

/**
 * @param segment {string} the fsd segment identifier. Lower segments cannot import from higher segments.
 *
 * @returns {string[]} all the segments below a given segment.
 */
export function getLowerSegments(segment: string): string[] {
  return segments.slice(segments.indexOf(segment) + 1)
}
