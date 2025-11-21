// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface ColorData {
  tailwind: string
  variable: string
}

const text: ColorData[] = [
  {tailwind: "text-brand-accent-01", variable: "--color-text-brand-accent-01"},
  {tailwind: "text-brand-accent-02", variable: "--color-text-brand-accent-02"},
  {tailwind: "text-brand-primary", variable: "--color-text-brand-primary"},
  {
    tailwind: "text-neutral-inverse",
    variable: "--color-text-neutral-inverse",
  },
  {
    tailwind: "text-neutral-primary",
    variable: "--color-text-neutral-primary",
  },
  {
    tailwind: "text-neutral-secondary",
    variable: "--color-text-neutral-secondary",
  },
  {tailwind: "text-support-danger", variable: "--color-text-support-danger"},
]

const icon: ColorData[] = [
  {
    tailwind: "text-icon-brand-accent-01",
    variable: "--color-icon-brand-accent-01",
  },
  {
    tailwind: "text-icon-brand-accent-02",
    variable: "--color-icon-brand-accent-02",
  },
  {
    tailwind: "text-icon-brand-primary",
    variable: "--color-icon-brand-primary",
  },
  {
    tailwind: "text-icon-neutral-inverse",
    variable: "--color-icon-neutral-inverse",
  },
  {
    tailwind: "text-icon-neutral-primary",
    variable: "--color-icon-neutral-primary",
  },
  {
    tailwind: "text-icon-neutral-secondary",
    variable: "--color-icon-neutral-secondary",
  },
  {
    tailwind: "text-icon-support-danger",
    variable: "--color-icon-support-danger",
  },
  {tailwind: "text-icon-support-info", variable: "--color-icon-support-info"},
  {
    tailwind: "text-icon-support-neutral",
    variable: "--color-icon-support-neutral",
  },
  {
    tailwind: "text-icon-support-success",
    variable: "--color-icon-support-success",
  },
  {
    tailwind: "text-icon-support-warning",
    variable: "--color-icon-support-warning",
  },
]

const background: ColorData[] = [
  {
    tailwind: "bg-brand-accent-01",
    variable: "--color-background-brand-accent-01",
  },
  {
    tailwind: "bg-brand-accent-02",
    variable: "--color-background-brand-accent-02",
  },
  {
    tailwind: "bg-brand-primary-strong",
    variable: "--color-background-brand-primary-strong",
  },
  {
    tailwind: "bg-brand-primary-subtle",
    variable: "--color-background-brand-primary-subtle",
  },
  {
    tailwind: "bg-brand-primary",
    variable: "--color-background-brand-primary",
  },
  {tailwind: "bg-neutral-00", variable: "--color-background-neutral-00"},
  {tailwind: "bg-neutral-01", variable: "--color-background-neutral-01"},
  {tailwind: "bg-neutral-02", variable: "--color-background-neutral-02"},
  {tailwind: "bg-neutral-03", variable: "--color-background-neutral-03"},
  {tailwind: "bg-neutral-04", variable: "--color-background-neutral-04"},
  {tailwind: "bg-neutral-05", variable: "--color-background-neutral-05"},
  {tailwind: "bg-neutral-06", variable: "--color-background-neutral-06"},
  {tailwind: "bg-neutral-07", variable: "--color-background-neutral-07"},
  {tailwind: "bg-neutral-08", variable: "--color-background-neutral-08"},
  {tailwind: "bg-neutral-09", variable: "--color-background-neutral-09"},
  {tailwind: "bg-neutral-10", variable: "--color-background-neutral-10"},
  {
    tailwind: "bg-support-danger-medium",
    variable: "--color-background-support-danger-medium",
  },
  {
    tailwind: "bg-support-danger-subtle",
    variable: "--color-background-support-danger-subtle",
  },
  {
    tailwind: "bg-support-danger",
    variable: "--color-background-support-danger",
  },
  {
    tailwind: "bg-support-info-medium",
    variable: "--color-background-support-info-medium",
  },
  {
    tailwind: "bg-support-info-subtle",
    variable: "--color-background-support-info-subtle",
  },
  {tailwind: "bg-support-info", variable: "--color-background-support-info"},
  {
    tailwind: "bg-support-neutral-medium",
    variable: "--color-background-support-neutral-medium",
  },
  {
    tailwind: "bg-support-neutral-subtle",
    variable: "--color-background-support-neutral-subtle",
  },
  {
    tailwind: "bg-support-neutral",
    variable: "--color-background-support-neutral",
  },
  {
    tailwind: "bg-support-success-medium",
    variable: "--color-background-support-success-medium",
  },
  {
    tailwind: "bg-support-success-subtle",
    variable: "--color-background-support-success-subtle",
  },
  {
    tailwind: "bg-support-success",
    variable: "--color-background-support-success",
  },
  {
    tailwind: "bg-support-warning-medium",
    variable: "--color-background-support-warning-medium",
  },
  {
    tailwind: "bg-support-warning-subtle",
    variable: "--color-background-support-warning-subtle",
  },
  {
    tailwind: "bg-support-warning",
    variable: "--color-background-support-warning",
  },
]

const surface: ColorData[] = [
  {tailwind: "bg-overlay", variable: "--color-surface-overlay"},
  {tailwind: "bg-primary", variable: "--color-surface-primary"},
  {tailwind: "bg-raised", variable: "--color-surface-raised"},
  {tailwind: "bg-secondary", variable: "--color-surface-secondary"},
]

const border: ColorData[] = [
  {
    tailwind: "border-brand-accent-01",
    variable: "--color-border-brand-accent-01",
  },
  {
    tailwind: "border-brand-accent-02",
    variable: "--color-border-brand-accent-02",
  },
  {
    tailwind: "border-brand-primary-subtle",
    variable: "--color-border-brand-primary-subtle",
  },
  {
    tailwind: "border-brand-primary",
    variable: "--color-border-brand-primary",
  },
  {tailwind: "border-neutral-00", variable: "--color-border-neutral-00"},
  {tailwind: "border-neutral-01", variable: "--color-border-neutral-01"},
  {tailwind: "border-neutral-02", variable: "--color-border-neutral-02"},
  {tailwind: "border-neutral-03", variable: "--color-border-neutral-03"},
  {tailwind: "border-neutral-10", variable: "--color-border-neutral-10"},
  {
    tailwind: "border-support-danger",
    variable: "--color-border-support-danger",
  },
  {tailwind: "border-support-info", variable: "--color-border-support-info"},
  {
    tailwind: "border-support-neutral",
    variable: "--color-border-support-neutral",
  },
  {
    tailwind: "border-support-success",
    variable: "--color-border-support-success",
  },
  {
    tailwind: "border-support-warning",
    variable: "--color-border-support-warning",
  },
  {
    tailwind: "border-focus-border",
    variable: "--color-utility-focus-border",
  },
]

const categories: string[] = [
  "blue",
  "cyan",
  "teal",
  "green",
  "kiwi",
  "yellow",
  "orange",
  "red",
  "magenta",
  "purple",
]

const category: ColorData[] = categories
  .map((category) => [
    {
      tailwind: `*-category-${category}-medium`,
      variable: `--color-category-${category}-medium`,
    },
    {
      tailwind: `*-category-${category}-strong`,
      variable: `--color-category-${category}-strong`,
    },
    {
      tailwind: `*-category-${category}-subtle`,
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
