import type {RouteConfigEntry} from "@react-router/dev/routes"
import {remixRoutesOptionAdapter} from "@react-router/remix-routes-option-adapter"
import {resolve} from "node:path"

import {withOpenApiRoutes} from "@qualcomm-ui/mdx-vite"
import {hybridRoutes} from "@qualcomm-ui/react-router-utils/node"

import quiDocsConfig from "./qui-docs.config"

const appDirectory = quiDocsConfig.appDirectory ?? "src"

export const routes: Promise<RouteConfigEntry[]> = remixRoutesOptionAdapter(
  (defineRoutes) => {
    return hybridRoutes("routes", defineRoutes, {
      appDir: appDirectory,
      ignoredRouteFiles: ["**/*components/**/*", "**/*demos/**/*"],
      routingStrategy: quiDocsConfig.routingStrategy,
    })
  },
).then((routes) =>
  withOpenApiRoutes(routes, {
    appDirectory: resolve(appDirectory),
    operationPage: resolve(appDirectory, "openapi-route.tsx"),
  }),
)

export default routes
