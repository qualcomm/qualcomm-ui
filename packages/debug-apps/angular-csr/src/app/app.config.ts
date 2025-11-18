import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core"
import {provideRouter} from "@angular/router"

import {provideQdsTheme} from "@qualcomm-ui/angular/theme"

import {routes} from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideQdsTheme(),
  ],
}
