import {RouteConfigEntry} from "@react-router/dev/routes"
import {remixRoutesOptionAdapter} from "@react-router/remix-routes-option-adapter"

import {simpleRoutes} from "@qualcomm-ui/react-router-utils/node"

export const routes: Promise<RouteConfigEntry[]> = remixRoutesOptionAdapter(
  (defineRoutes) => {
    return simpleRoutes("routes", defineRoutes, {
      appDir: "src",
      ignoredFiles: ["**/*components/**/*", "**/*demos/**/*"],
    })
  },
)

export default routes
