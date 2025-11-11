// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  ShikiTransformer,
  ThemeRegistration,
  ThemeRegistrationRaw,
  ThemeRegistrationResolved,
} from "shiki"

export interface QuiDemoPluginOptions {
  /**
   * Demo files to scan for. Supports globs.
   *
   * @default "src/routes/**\/demos/*.tsx"
   */
  demoPattern?: string | string[]

  /**
   * Lazy load imports and HMR when running in dev mode.
   *
   * @default true
   */
  lazyLoadDevModules?: boolean

  /**
   * @default 'src/routes'
   */
  routesDir?: string

  /**
   * Defaults to a custom dark theme for dark mode, and github-light-high-contrast
   * for light mode.
   */
  theme?: {
    dark:
      | ThemeRegistrationRaw
      | ThemeRegistration
      | ThemeRegistrationResolved
      | string
    light:
      | ThemeRegistrationRaw
      | ThemeRegistration
      | ThemeRegistrationResolved
      | string
  }

  /**
   * Custom shiki transformers
   */
  transformers?: ShikiTransformer[]

  /**
   * Transforms a line of code before it's highlighted. Useful for omitting or
   * removing content. Return null to omit the line.
   */
  transformLine?: (line: string) => string | null
}
