// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {hostOpacityTokens, hostShadowTokens} from "./host-tokens.js"

export interface VscodeToken {
  /** Full CSS custom-property name without the leading double hyphen. */
  name: string
  type:
    | "font-family"
    | "font-size"
    | "font-weight"
    | "color"
    | "typography"
    | "shadow"
    | "shadow-geometry"
    | "opacity"
  /** CSS value using host variables where applicable. */
  value: string
}

/** Legacy QUI proportions and weights, scaled from VS Code's 13px UI base. */
export const typographyRoles = [
  {name: "body-md-default", size: 13, weight: 500},
  {name: "body-sm-default", size: 12, weight: 500},
  {name: "label-lg-default", size: 14, weight: 500},
  {name: "label-md-default", size: 12, weight: 700},
  {name: "label-sm-default", size: 11, weight: 500},
  {name: "label-xs-default", size: 9, weight: 700},
  {name: "heading-xxl", size: 26, weight: 600},
  {name: "heading-xl", size: 14, weight: 500},
  {name: "heading-lg-default", size: 13, weight: 800},
  {name: "heading-md-default", size: 11, weight: 700},
  {name: "heading-sm-default", size: 11, weight: 500},
  {name: "heading-xs-default", size: 11, weight: 800},
  {name: "markdown-xxl", size: 26, weight: 600},
  {name: "markdown-xl", size: 20, weight: 600},
  {name: "markdown-lg-default", size: 15, weight: 600},
  {name: "markdown-md-default", size: 13, weight: 800},
  {name: "markdown-sm-default", size: 11, weight: 800},
  {name: "markdown-xs-default", size: 8, weight: 800},
  {name: "paragraph-md-default", size: 13, weight: 500},
] as const

export const tokens: readonly VscodeToken[] = [
  {
    name: "type-font-family-primary",
    type: "font-family",
    value: "var(--vscode-font-family, system-ui, sans-serif)",
  },
  {
    name: "type-font-size-base",
    type: "font-size",
    value: "var(--vscode-font-size, 13px)",
  },
  {
    name: "type-font-weight-default",
    type: "font-weight",
    value: "var(--vscode-font-weight, normal)",
  },
  ...typographyRoles.flatMap(({name, size, weight}): VscodeToken[] => [
    {
      name: `type-static-${name.replace(/-default$/, "")}-font-size`,
      type: "font-size",
      value: `calc(var(--vscode-font-size, 13px) * ${size / 13})`,
    },
    {
      name: `font-static-${name}`,
      type: "typography",
      value: `${weight} var(--type-static-${name.replace(/-default$/, "")}-font-size) / normal var(--type-font-family-primary)`,
    },
  ]),
  ...(
    [
      {name: "xs", size: 11},
      {name: "sm", size: 12},
      {name: "md", size: 13},
    ] as const
  ).map(({name, size}): VscodeToken => ({
    name: `type-font-size-${name}`,
    type: "font-size",
    value: `calc(var(--vscode-font-size, 13px) * ${size / 13})`,
  })),
  {
    name: "shadow-geometry",
    type: "shadow-geometry",
    value: "0 2px 8px",
  },
  ...hostShadowTokens.map(({name, variable}): VscodeToken => ({
    name: `shadow-${name}`,
    type: "shadow",
    value: `var(--shadow-geometry) var(${variable}, transparent)`,
  })),
  ...hostOpacityTokens.map(({name}): VscodeToken => ({
    name: `opacity-${name}`,
    type: "opacity",
    value: "1",
  })),
  {name: "color-text-normal", type: "color", value: "var(--vscode-foreground)"},
  {
    name: "color-text-muted",
    type: "color",
    value: "var(--vscode-descriptionForeground, var(--vscode-foreground))",
  },
  {
    name: "color-text-success",
    type: "color",
    value: "var(--vscode-testing-iconPassed, var(--vscode-foreground))",
  },
  {
    name: "color-text-warning",
    type: "color",
    value: "var(--vscode-editorWarning-foreground, var(--vscode-foreground))",
  },
  {
    name: "color-text-error",
    type: "color",
    value: "var(--vscode-errorForeground, var(--vscode-foreground))",
  },
]
