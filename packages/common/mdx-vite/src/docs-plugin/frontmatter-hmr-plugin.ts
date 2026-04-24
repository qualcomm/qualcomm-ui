// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PluginOption} from "vite"

/**
 * Options for the {@link frontmatterHmrPlugin}.
 */
export interface FrontmatterHmrPluginOptions {
  /**
   * The name of the frontmatter export to target. This needs to match the
   * '@mdx-js/react' frontmatter export name, which defaults to `frontmatter`.
   *
   * @default frontmatter
   */
  exportName?: string
}

/**
 * A Vite plugin that fixes Hot Module Replacement (HMR) for MDX frontmatter exports.
 *
 * By default, React Fast Refresh only processes modules that export React
 * components. Since frontmatter is a plain object, changes to it don't trigger HMR
 * updates and instead prompt a full refresh.
 *
 * This plugin works around the issue by attaching a `$$typeof` property set to
 * `Symbol.for('react.memo')` on the exported `frontmatter` object, tricking React
 * Fast Refresh's {@link https://github.com/facebook/react/blob/f5af92d2c47d1e1f455faf912b1d3221d1038c37/packages/react-refresh/src/ReactFreshRuntime.js#L717-L723 isLikelyComponentType}
 * check into treating the module as a component module eligible for HMR.
 *
 * @since 3.2.0
 *
 * @returns A Vite plugin option that transforms modules containing frontmatter exports.
 */
export function frontmatterHmrPlugin(
  opts: FrontmatterHmrPluginOptions = {},
): PluginOption {
  const {exportName = "frontmatter"} = opts
  return {
    name: "frontmatter-hmr-fix",
    transform(code: string) {
      if (code.includes(`export const ${exportName}`)) {
        // cheat `isLikelyComponentType`
        // https://github.com/facebook/react/blob/f5af92d2c47d1e1f455faf912b1d3221d1038c37/packages/react-refresh/src/ReactFreshRuntime.js#L717-L723
        code += `
            if (typeof ${exportName} === 'object') {
              Object.defineProperty(${exportName}, "$$typeof", {
                enumerable: false,
                value: Symbol.for('react.memo')
              });
            }
          `
        return code
      }
    },
  }
}
