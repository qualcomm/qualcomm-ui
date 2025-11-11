import {remixRoutesOptionAdapter} from "@react-router/remix-routes-option-adapter"

import {hybridRoutes} from "@qualcomm-ui/react-router-utils/node"

export const routes = remixRoutesOptionAdapter((defineRoutes) => {
  return hybridRoutes("routes", defineRoutes, {
    appDir: "src",
    ignoredRouteFiles: ["**/*demos/**/*"],
  })
})

export default routes
