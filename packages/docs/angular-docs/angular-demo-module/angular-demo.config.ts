/* eslint-disable no-restricted-globals */
import {
  type ApplicationConfig,
  DestroyRef,
  inject,
  Injectable,
  provideZonelessChangeDetection,
} from "@angular/core"
import {
  ActivatedRoute,
  type NavigationExtras,
  Router,
  type UrlTree,
} from "@angular/router"
import {
  provideQueryClient,
  QueryClient,
} from "@tanstack/angular-query-experimental"
import {Observable} from "rxjs"

@Injectable()
export class NoOpRouter extends Router {
  override navigate(): Promise<boolean> {
    return Promise.resolve(false)
  }

  override navigateByUrl(): Promise<boolean> {
    return Promise.resolve(false)
  }
}

@Injectable()
export class MockRouter extends Router {
  override navigate(
    commands: unknown[],
    extras?: NavigationExtras,
  ): Promise<boolean> {
    console.log("Mock navigation intercepted:", commands, extras)
    return Promise.resolve(false)
  }

  override navigateByUrl(
    url: string | UrlTree,
    extras?: NavigationExtras,
  ): Promise<boolean> {
    console.log("Mock navigateByUrl intercepted:", url, extras)
    return Promise.resolve(false)
  }

  override createUrlTree(
    commands: unknown[],
    navigationExtras?: NavigationExtras,
  ): UrlTree {
    return super.createUrlTree(commands, navigationExtras)
  }
}

export const angularDemoConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideQueryClient(new QueryClient()),
    {
      provide: Router,
      useValue: {
        createUrlTree: () => {},
        events: {subscribe: () => {}},
        isActive: (...args: any[]) => {
          const customEvent = new CustomEvent("angular-router-event", {
            bubbles: true,
            detail: args,
          })
          document.documentElement.dispatchEvent(customEvent)
        },
        navigate: (commands: readonly any[], extras?: NavigationExtras) => {
          const customEvent = new CustomEvent("angular-router-event", {
            bubbles: true,
            detail: {commands, extras, method: "navigate"},
          })
          document.documentElement.dispatchEvent(customEvent)
        },
        navigateByUrl: () => {},
        serializeUrl: () => {},
        subscribe: () => {},
      },
    },
    {
      provide: ActivatedRoute,
      useFactory: () => {
        const destroyRef = inject(DestroyRef)

        function getQueryParams() {
          const params: Record<string, string> = {}
          new URLSearchParams(window.location.search).forEach((value, key) => {
            params[key] = value
          })
          return params
        }

        const queryParamsObservable = new Observable((observer) => {
          observer.next(getQueryParams())

          const handler = () => observer.next(getQueryParams())
          window.addEventListener("popstate", handler)

          destroyRef.onDestroy(() => {
            window.removeEventListener("popstate", handler)
          })
        })

        return {
          params: {
            subscribe: () => {
              return {}
            },
          },
          queryParams: queryParamsObservable,
        }
      },
    },
  ],
}
