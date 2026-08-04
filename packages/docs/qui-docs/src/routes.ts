import type {RouteConfigEntry} from "@react-router/dev/routes"
import {remixRoutesOptionAdapter} from "@react-router/remix-routes-option-adapter"

import {hybridRoutes} from "@qualcomm-ui/react-router-utils/node"

import quiDocsConfig from "./qui-docs.config"

export const routes: Promise<RouteConfigEntry[]> = remixRoutesOptionAdapter(
  (defineRoutes) => {
    return hybridRoutes("routes", defineRoutes, {
      appDir: quiDocsConfig.appDirectory ?? "src",
      ignoredRouteFiles: ["**/*components/**/*", "**/*demos/**/*"],
      routingStrategy: quiDocsConfig.routingStrategy,
    })
  },
)

export default routes
