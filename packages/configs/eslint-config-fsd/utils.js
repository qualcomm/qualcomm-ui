export const layers = [
  "app",
  "pages",
  "widgets",
  "features",
  "entities",
  "data",
  "shared",
]

export const segments = [
  "ui",
  "services",
  "api",
  "state",
  "model",
  "config",
  "assets",
]

/**
 * @param layer {string} the fsd layer identifier.
 *
 * @returns {string[]} all the layers below a given layer.
 */
export function getLowerLayers(layer) {
  return layers.slice(layers.indexOf(layer) + 1)
}

/**
 * @param layer {string} the fsd layer identifier.
 *
 * @returns {string[]} all the layers above a given layer.
 */
export function getUpperLayers(layer) {
  return layers.slice(0, layers.indexOf(layer))
}

/**
 * @param segment {string} the fsd segment identifier.
 *
 * @returns {string[]} all the segments below a given segment.
 */
export function getLowerSegments(segment) {
  return segments.slice(segments.indexOf(segment) + 1)
}
