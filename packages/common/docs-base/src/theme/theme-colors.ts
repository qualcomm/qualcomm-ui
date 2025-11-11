// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface ColorData {
  tailwind: string
  variable: string
}

const semantic: ColorData[] = [
  {
    tailwind: "*-semantic-primary",
    variable: "--q-semantic-primary",
  },
  {
    tailwind: "*-semantic-secondary",
    variable: "--q-semantic-secondary",
  },
  {
    tailwind: "*-semantic-negative",
    variable: "--q-semantic-negative",
  },
  {
    tailwind: "*-semantic-warning",
    variable: "--q-semantic-warning",
  },
  {
    tailwind: "*-semantic-positive",
    variable: "--q-semantic-positive",
  },
  {
    tailwind: "*-semantic-neutral",
    variable: "--q-semantic-neutral",
  },
]

const text: ColorData[] = [
  {tailwind: "text-primary", variable: "--q-text-1-primary"},
  {tailwind: "text-secondary", variable: "--q-text-1-secondary"},
  {tailwind: "text-disabled", variable: "--q-text-1-disabled"},
  {tailwind: "text-contrast-primary", variable: "--q-text-2-primary"},
  {tailwind: "text-contrast-secondary", variable: "--q-text-2-secondary"},
  {tailwind: "text-contrast-disabled", variable: "--q-text-2-disabled"},
  {tailwind: "text-link", variable: "--q-text-link"},
  {tailwind: "text-error", variable: "--q-text-error"},
]

const foreground: ColorData[] = [
  {tailwind: "foreground-primary", variable: "--q-foreground-1-primary"},
  {tailwind: "foreground-secondary", variable: "--q-foreground-1-secondary"},
  {tailwind: "foreground-disabled", variable: "--q-foreground-1-disabled"},
  {
    tailwind: "foreground-contrast-primary",
    variable: "--q-foreground-2-primary",
  },
  {
    tailwind: "foreground-contrast-secondary",
    variable: "--q-foreground-2-secondary",
  },
  {
    tailwind: "foreground-contrast-disabled",
    variable: "--q-foreground-2-disabled",
  },
]

const background: ColorData[] = [
  {tailwind: "bg-1", variable: "--q-background-1"},
  {tailwind: "bg-2", variable: "--q-background-2"},
  {tailwind: "bg-3", variable: "--q-background-3"},
  {tailwind: "bg-4", variable: "--q-background-4"},
  {tailwind: "bg-contrast-1", variable: "--q-background-1-contrast"},
  {tailwind: "bg-contrast-2", variable: "--q-background-2-contrast"},
  {tailwind: "bg-contrast-3", variable: "--q-background-3-contrast"},
  {tailwind: "bg-contrast-4", variable: "--q-background-4-contrast"},
]

const border: ColorData[] = [
  {tailwind: "border-default", variable: "--q-border-1-default"},
  {tailwind: "border-subtle", variable: "--q-border-1-subtle"},
  {tailwind: "border-strong", variable: "--q-border-1-strong"},
  {tailwind: "border-contrast-default", variable: "--q-border-2-default"},
  {tailwind: "border-contrast-subtle", variable: "--q-border-2-subtle"},
  {tailwind: "border-contrast-strong", variable: "--q-border-2-strong"},
  {tailwind: "border-focus", variable: "--q-border-focus"},
]

const neutralScale: number[] = [
  50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800,
  850, 900, 950, 1000,
]

const paletteScale: number[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
]

function makePaletteColors(name: string, scale: number[]): ColorData[] {
  return scale.map((entry) => ({
    tailwind: `*-${name}-${entry}`,
    variable: `--q-${name}-${entry}`,
  }))
}

export const themeColors = {
  background,
  border,
  foreground,
  semantic,
  text,
}

export const paletteColors = {
  blue: makePaletteColors("blue", paletteScale),
  brand: makePaletteColors("brand", paletteScale),
  fuchsia: makePaletteColors("fuchsia", paletteScale),
  green: makePaletteColors("green", paletteScale),
  kiwi: makePaletteColors("kiwi", paletteScale),
  magenta: makePaletteColors("magenta", paletteScale),
  neutral: makePaletteColors("neutral", neutralScale),
  orange: makePaletteColors("orange", paletteScale),
  purple: makePaletteColors("purple", paletteScale),
  red: makePaletteColors("red", paletteScale),
  teal: makePaletteColors("teal", paletteScale),
  yellow: makePaletteColors("yellow", paletteScale),
}
