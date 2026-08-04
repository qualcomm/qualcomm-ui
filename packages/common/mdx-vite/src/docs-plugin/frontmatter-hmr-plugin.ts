// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PluginOption} from "vite"

const REACT_ROUTER_HMR_RUNTIME_ID = "virtual:react-router/hmr-runtime"
const REACT_ROUTER_FULL_RELOAD_PATH = "/__frontmatter-hmr-fix/full-reload"
const reactRouterMissingRouteModuleUpdateError =
  /^(\s*)throw Error\(\s*`\[react-router:hmr\] No module update found for route \$\{route\.id\}`,\s*\);/m

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
    configureServer(server) {
      server.middlewares.use(
        REACT_ROUTER_FULL_RELOAD_PATH,
        (req, res, next) => {
          if (req.method !== "POST") {
            next()
            return
          }

          server.ws.send({type: "full-reload"})
          res.statusCode = 204
          res.end()
        },
      )
    },
    name: "frontmatter-hmr-fix",
    transform(code: string, id: string) {
      if (id.includes(REACT_ROUTER_HMR_RUNTIME_ID)) {
        // React Router sends route metadata updates for edited route files even
        // when the browser has not imported that route module yet. In that
        // cold-route case there is no module accept callback to populate
        // __reactRouterRouteModuleUpdates, so the runtime needs to reload
        // instead of throwing.
        return code.replace(
          reactRouterMissingRouteModuleUpdateError,
          (_match, indent: string) =>
            [
              `${indent}console.debug(\`[react-router:hmr] No module update found for route \${route.id}\`);`,
              `${indent}void fetch("${REACT_ROUTER_FULL_RELOAD_PATH}", {method: "POST"}).catch(() => window.location.reload());`,
              `${indent}return;`,
            ].join("\n"),
        )
      }

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
