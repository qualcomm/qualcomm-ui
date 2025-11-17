import {ApplicationConfig, mergeApplicationConfig} from "@angular/core"
import {provideServerRendering, withRoutes} from "@angular/ssr"

import {provideQdsTheme} from "@qualcomm-ui/angular/theme"

import {appConfig} from "./app.config"
import {serverRoutes} from "./app.routes.server"

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideQdsTheme(),
  ],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
