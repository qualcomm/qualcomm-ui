/* eslint-disable no-restricted-globals */
import {useEffect} from "react"

import {useLocation, useNavigate, useSearchParams} from "react-router"

import {cast} from "@qualcomm-ui/utils/functions"

function getUrl(element: HTMLAnchorElement) {
  const link = element.getAttribute("routerlink")!
  const fragment = element.getAttribute("fragment")
  return fragment ? `${link}#${fragment}` : link
}

const querySelectors: string[] = [
  "a[data-scope='menu']",
  "a.qui-breadcrumbs__item-trigger",
]

/**
 * Translates `routerLink` directives in Angular demos to React Router navigation.
 */
export function useRouterLinkInterceptor() {
  const pathname = useLocation().pathname
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()

  useEffect(() => {
    let linkElements: Element[] | null = null
    function listener(event: MouseEvent) {
      const href = getUrl(event.currentTarget as HTMLAnchorElement)
      if (href) {
        navigate(href)
      }
    }

    setTimeout(() => {
      // whitelist specific links that we know are routerLinks
      linkElements = Array.from(
        document.body.querySelectorAll(querySelectors.join(",")),
      )
        .filter((element) => element.getAttribute("routerlink"))
        .map((element) => {
          cast<HTMLAnchorElement>(element).addEventListener("click", listener)
          const url = getUrl(element as HTMLAnchorElement)
          cast<HTMLAnchorElement>(element).setAttribute("href", url)
          return element
        })
    }, 1000)

    return () => {
      linkElements?.forEach((element) => {
        cast<HTMLAnchorElement>(element).removeEventListener("click", listener)
      })
    }
  }, [pathname])

  /* Intercept query params for demos like the tabs URL Search Parameters */
  useEffect(() => {
    function listener(event: any) {
      const detail = event.detail
      if (detail.method === "navigate") {
        const extras = detail.extras ?? {}
        const queryParams = extras.queryParams ?? {}
        if (queryParams) {
          setSearchParams(
            (prev) => {
              for (const [key, value] of Object.entries(queryParams)) {
                prev.set(key, value as string)
              }
              return prev
            },
            {
              preventScrollReset: true,
              viewTransition: false,
            },
          )
        }
      }
    }

    document.documentElement.addEventListener("angular-router-event", listener)

    return () => {
      document.documentElement.removeEventListener(
        "angular-router-event",
        listener,
      )
    }
  }, [])
}
