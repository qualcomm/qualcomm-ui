import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from "@angular/core"
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser"
import {provideRouter} from "@angular/router"
import {
  provideQueryClient,
  QueryClient,
} from "@tanstack/angular-query-experimental"

import {provideQdsTheme} from "@qualcomm-ui/angular/theme"

import {routes} from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideQueryClient(new QueryClient()),
    provideQdsTheme(),
  ],
}
