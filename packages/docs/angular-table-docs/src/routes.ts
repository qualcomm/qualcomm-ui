import type {RouteConfigEntry} from "@react-router/dev/routes"
import {remixRoutesOptionAdapter} from "@react-router/remix-routes-option-adapter"

import {hybridRoutes} from "@qualcomm-ui/react-router-utils/node"

export const routes: Promise<RouteConfigEntry[]> = remixRoutesOptionAdapter(
  (defineRoutes) => {
    return hybridRoutes("routes", defineRoutes, {
      appDir: "src",
      ignoredRouteFiles: ["**/*components/**/*", "**/*demos/**/*"],
    })
  },
)

export default routes
