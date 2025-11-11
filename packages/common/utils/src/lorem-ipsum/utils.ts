// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
