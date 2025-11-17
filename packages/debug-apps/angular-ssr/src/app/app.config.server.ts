import {ApplicationConfig, mergeApplicationConfig} from "@angular/core"
import {provideServerRendering, withRoutes} from "@angular/ssr"

import {
  provideBrandCookie,
  provideThemeCookie,
} from "@qualcomm-ui/angular/theme"

import {appConfig} from "./app.config"
import {serverRoutes} from "./app.routes.server"

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideThemeCookie(),
    provideBrandCookie(),
  ],
}

export const config = mergeApplicationConfig(appConfig, serverConfig)
