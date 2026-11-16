// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {hostOpacityTokens, hostShadowTokens} from "./host-tokens.js"

export interface VscodeToken {
  /** Token name without the CSS custom-property prefix. */
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
  {name: "body-1", size: 13, weight: 500},
  {name: "body-2", size: 12, weight: 500},
  {name: "label-1", size: 14, weight: 500},
  {name: "label-2", size: 12, weight: 700},
  {name: "label-3", size: 11, weight: 500},
  {name: "label-4", size: 9, weight: 700},
  {name: "heading-1", size: 26, weight: 600},
  {name: "heading-2", size: 14, weight: 500},
  {name: "heading-3", size: 13, weight: 800},
  {name: "heading-4", size: 11, weight: 700},
  {name: "heading-5", size: 11, weight: 500},
  {name: "heading-6", size: 11, weight: 800},
  {name: "markdown-1", size: 26, weight: 600},
  {name: "markdown-2", size: 20, weight: 600},
  {name: "markdown-3", size: 15, weight: 600},
  {name: "markdown-4", size: 13, weight: 800},
  {name: "markdown-5", size: 11, weight: 800},
  {name: "markdown-6", size: 8, weight: 800},
  {name: "paragraph", size: 13, weight: 500},
] as const

/** Presentation values shared by plain CSS, framework wrappers, and Tailwind. */
export const tokens: readonly VscodeToken[] = [
  {
    name: "font-family",
    type: "font-family",
    value: "var(--vscode-font-family, system-ui, sans-serif)",
  },
  {
    name: "font-family-code",
    type: "font-family",
    value: "var(--vscode-editor-font-family, ui-monospace, monospace)",
  },
  {
    name: "font-size",
    type: "font-size",
    value: "var(--vscode-font-size, 13px)",
  },
  {
    name: "font-weight",
    type: "font-weight",
    value: "var(--vscode-font-weight, normal)",
  },
  {
    name: "font-size-code",
    type: "font-size",
    value: "var(--vscode-editor-font-size, var(--vscode-font-size, 13px))",
  },
  {
    name: "font-weight-code",
    type: "font-weight",
    value: "var(--vscode-editor-font-weight, normal)",
  },
  ...typographyRoles.flatMap(({name, size, weight}): VscodeToken[] => [
    {
      name: `font-size-${name}`,
      type: "font-size",
      value: `calc(var(--vscode-font-size, 13px) * ${size / 13})`,
    },
    {
      name: `font-${name}`,
      type: "typography",
      value: `${weight} var(--qui-vscode-font-size-${name}) / normal var(--qui-vscode-font-family)`,
    },
  ]),
  ...(
    [
      {name: "xs", size: 11},
      {name: "sm", size: 12},
      {name: "md", size: 13},
    ] as const
  ).map(({name, size}): VscodeToken => ({
    name: `font-size-${name}`,
    type: "font-size",
    value: `calc(var(--vscode-font-size, 13px) * ${size / 13})`,
  })),
  {
    name: "font-code",
    type: "typography",
    value:
      "var(--qui-vscode-font-weight-code) var(--qui-vscode-font-size-code) / normal var(--qui-vscode-font-family-code)",
  },
  {
    name: "shadow-geometry",
    type: "shadow-geometry",
    value: "0 2px 8px",
  },
  ...hostShadowTokens.map(({name, variable}): VscodeToken => ({
    name: `shadow-${name}`,
    type: "shadow",
    value: `var(--qui-vscode-shadow-geometry) var(${variable}, transparent)`,
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
  /** No generic success/warning prose tokens exist; these mappings need contrast review. */
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
