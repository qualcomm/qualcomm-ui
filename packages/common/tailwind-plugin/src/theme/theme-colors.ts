// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface ColorData {
  tailwindClass: string
  variable: string
}

const text: ColorData[] = [
  {tailwindClass: "text-brand-primary", variable: "--color-text-brand-primary"},
  {
    tailwindClass: "text-neutral-inverse",
    variable: "--color-text-neutral-inverse",
  },
  {
    tailwindClass: "text-neutral-primary",
    variable: "--color-text-neutral-primary",
  },
  {
    tailwindClass: "text-neutral-secondary",
    variable: "--color-text-neutral-secondary",
  },
  {
    tailwindClass: "text-support-danger",
    variable: "--color-text-support-danger",
  },
  {
    tailwindClass: "text-support-info",
    variable: "--color-text-support-info",
  },
  {
    tailwindClass: "text-support-success",
    variable: "--color-text-support-success",
  },
]

const icon: ColorData[] = [
  {
    tailwindClass: "text-icon-brand-primary",
    variable: "--color-icon-brand-primary",
  },
  {
    tailwindClass: "text-icon-neutral-inverse",
    variable: "--color-icon-neutral-inverse",
  },
  {
    tailwindClass: "text-icon-neutral-primary",
    variable: "--color-icon-neutral-primary",
  },
  {
    tailwindClass: "text-icon-neutral-secondary",
    variable: "--color-icon-neutral-secondary",
  },
  {
    tailwindClass: "text-icon-support-danger",
    variable: "--color-icon-support-danger",
  },
  {
    tailwindClass: "text-icon-support-info",
    variable: "--color-icon-support-info",
  },
  {
    tailwindClass: "text-icon-support-neutral",
    variable: "--color-icon-support-neutral",
  },
  {
    tailwindClass: "text-icon-support-success",
    variable: "--color-icon-support-success",
  },
  {
    tailwindClass: "text-icon-support-warning",
    variable: "--color-icon-support-warning",
  },
]

const background: ColorData[] = [
  {
    tailwindClass: "bg-brand-primary-strong",
    variable: "--color-background-brand-primary-strong",
  },
  {
    tailwindClass: "bg-brand-primary-subtle",
    variable: "--color-background-brand-primary-subtle",
  },
  {
    tailwindClass: "bg-brand-primary",
    variable: "--color-background-brand-primary",
  },
  {tailwindClass: "bg-neutral-00", variable: "--color-background-neutral-00"},
  {tailwindClass: "bg-neutral-01", variable: "--color-background-neutral-01"},
  {tailwindClass: "bg-neutral-02", variable: "--color-background-neutral-02"},
  {tailwindClass: "bg-neutral-03", variable: "--color-background-neutral-03"},
  {tailwindClass: "bg-neutral-10", variable: "--color-background-neutral-10"},
  {
    tailwindClass: "bg-support-danger-medium",
    variable: "--color-background-support-danger-medium",
  },
  {
    tailwindClass: "bg-support-danger-subtle",
    variable: "--color-background-support-danger-subtle",
  },
  {
    tailwindClass: "bg-support-danger",
    variable: "--color-background-support-danger",
  },
  {
    tailwindClass: "bg-support-info-medium",
    variable: "--color-background-support-info-medium",
  },
  {
    tailwindClass: "bg-support-info-subtle",
    variable: "--color-background-support-info-subtle",
  },
  {
    tailwindClass: "bg-support-info",
    variable: "--color-background-support-info",
  },
  {
    tailwindClass: "bg-support-neutral-medium",
    variable: "--color-background-support-neutral-medium",
  },
  {
    tailwindClass: "bg-support-neutral-subtle",
    variable: "--color-background-support-neutral-subtle",
  },
  {
    tailwindClass: "bg-support-neutral",
    variable: "--color-background-support-neutral",
  },
  {
    tailwindClass: "bg-support-success-medium",
    variable: "--color-background-support-success-medium",
  },
  {
    tailwindClass: "bg-support-success-subtle",
    variable: "--color-background-support-success-subtle",
  },
  {
    tailwindClass: "bg-support-success",
    variable: "--color-background-support-success",
  },
  {
    tailwindClass: "bg-support-warning-medium",
    variable: "--color-background-support-warning-medium",
  },
  {
    tailwindClass: "bg-support-warning-subtle",
    variable: "--color-background-support-warning-subtle",
  },
  {
    tailwindClass: "bg-support-warning",
    variable: "--color-background-support-warning",
  },
]

const surface: ColorData[] = [
  {tailwindClass: "bg-primary", variable: "--color-surface-primary"},
  {tailwindClass: "bg-secondary", variable: "--color-surface-secondary"},
  {tailwindClass: "bg-raised", variable: "--color-surface-raised"},
  {tailwindClass: "bg-overlay", variable: "--color-surface-overlay"},
]

const border: ColorData[] = [
  {
    tailwindClass: "border-brand-primary-subtle",
    variable: "--color-border-brand-primary-subtle",
  },
  {
    tailwindClass: "border-brand-primary",
    variable: "--color-border-brand-primary",
  },
  {tailwindClass: "border-neutral-00", variable: "--color-border-neutral-00"},
  {tailwindClass: "border-neutral-01", variable: "--color-border-neutral-01"},
  {tailwindClass: "border-neutral-02", variable: "--color-border-neutral-02"},
  {tailwindClass: "border-neutral-03", variable: "--color-border-neutral-03"},
  {tailwindClass: "border-neutral-10", variable: "--color-border-neutral-10"},
  {
    tailwindClass: "border-support-danger-medium",
    variable: "--color-border-support-danger-medium",
  },
  {
    tailwindClass: "border-support-danger",
    variable: "--color-border-support-danger",
  },
  {
    tailwindClass: "border-support-info-medium",
    variable: "--color-border-support-info-medium",
  },
  {
    tailwindClass: "border-support-info",
    variable: "--color-border-support-info",
  },
  {
    tailwindClass: "border-support-neutral-medium",
    variable: "--color-border-support-neutral-medium",
  },
  {
    tailwindClass: "border-support-neutral",
    variable: "--color-border-support-neutral",
  },
  {
    tailwindClass: "border-support-success-medium",
    variable: "--color-border-support-success-medium",
  },
  {
    tailwindClass: "border-support-success",
    variable: "--color-border-support-success",
  },
  {
    tailwindClass: "border-support-warning-medium",
    variable: "--color-border-support-warning-medium",
  },
  {
    tailwindClass: "border-support-warning",
    variable: "--color-border-support-warning",
  },
  {
    tailwindClass: "border-focus-border",
    variable: "--color-utility-focus-border",
  },
]

const categories: string[] = [
  "amber",
  "blue",
  "cyan",
  "green",
  "lime",
  "magenta",
  "orange",
  "purple",
  "red",
  "teal",
  "violet",
  "yellow",
]

const category: ColorData[] = categories
  .map((category) => [
    {
      tailwindClass: `*-category-${category}-medium`,
      variable: `--color-category-${category}-medium`,
    },
    {
      tailwindClass: `*-category-${category}-strong`,
      variable: `--color-category-${category}-strong`,
    },
    {
      tailwindClass: `*-category-${category}-subtle`,
      variable: `--color-category-${category}-subtle`,
    },
  ])
  .flat()

export const themeColors = {
  background,
  border,
  category,
  icon,
  surface,
  text,
}
