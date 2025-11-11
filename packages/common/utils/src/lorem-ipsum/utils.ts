export function randomFromRange(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min
}

export function randomPositiveFromRange(min: number, max: number): number {
  return Math.max(1, randomFromRange(min, max))
}

export function getStandardDeviation(
  value: number,
  percentage: number,
): number {
  return Math.ceil(value * percentage)
}
