import "./globals.css"

import {useEffect, useMemo, useState} from "react"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Provider} from "jotai"
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
} from "react-router"

import {type PackageManager, SiteContextProvider} from "@qualcomm-ui/mdx-docs/context"
import {
  type DocPropsLayout,
  PropsLayoutProvider,
  type PropsLayoutState,
} from "@qualcomm-ui/mdx-docs/typedoc"
import type {SiteData} from "@qualcomm-ui/mdx-docs-common"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {
  isQdsTheme,
  type QdsBrand,
  QdsThemeContextProvider,
  type QdsThemeContextValue,
  useQdsThemeContext,
} from "@qualcomm-ui/react/qds-theme"
import {QuiRoot} from "@qualcomm-ui/react/qui-root"
import {
  isTheme,
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  updateSiteState,
  useTheme,
} from "@qualcomm-ui/react-router-utils/client"

import {
  AppDocsLayout,
  GlobalConfigContextProvider,
  type GlobalConfigContextValue,
} from "./components"
import {qdsBrandCookie, siteStateCookie, themeCookie} from "./sessions.server"

const siteDataFallback: SiteData = {navItems: [], pageMap: {}, searchIndex: []}

interface LoaderData {
  hideDemoBrandSwitcher: boolean
  packageManager: PackageManager
  qdsBrand: QdsBrand
  ssrUserAgent: string
}

// Return the theme from the session storage using the loader
export const loader: LoaderFunction = async ({request}) => {
  const cookie = request.headers.get("cookie")

  const cookieTheme = await themeCookie.parse(cookie)
  const docState = await siteStateCookie.parse(cookie)
  const qdsTheme = await qdsBrandCookie.parse(cookie)

  return {
    hideDemoBrandSwitcher: docState?.hideDemoBrandSwitcher || false,
    packageManager: docState?.packageManager || "npm",
    qdsBrand: isQdsTheme(qdsTheme) ? qdsTheme : ("qualcomm" satisfies QdsBrand),
    ssrUserAgent: request.headers.get("user-agent"),
    theme: isTheme(cookieTheme) ? cookieTheme : Theme.DARK,
  }
}

function App() {
  const [queryClient] = useState(new QueryClient())
  const data = useLoaderData<LoaderData>()

  const [theme] = useTheme()
  const {brand} = useQdsThemeContext()

  const location = useLocation()
  const title = siteData.pageMap[location.pathname]?.title || ""
  const appTitle = title ? `QUI | ${title}` : "QUI React"
  const [hideDemoBrandSwitcher, setHideDemoBrandSwitcher] = useState<boolean>(
    data.hideDemoBrandSwitcher,
  )

  const globalConfigContext = useMemo<GlobalConfigContextValue>(() => {
    return {
      hideDemoBrandSwitcher,
      setHideDemoBrandSwitcher: (value) => {
        void updateSiteState("/action/set-site-state", {
          hideDemoBrandSwitcher: value,
        })
        return setHideDemoBrandSwitcher(value)
      },
    }
  }, [hideDemoBrandSwitcher])

  return (
    <html
      className={`${theme || "dark"} qui-preload`}
      data-brand="qualcomm"
      data-theme={theme}
      lang="en"
      style={{colorScheme: theme || "dark"}}
    >
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <link
          href="/favicon/favicon-96x96.png"
          rel="icon"
          sizes="96x96"
          type="image/png"
        />
        <link href="/favicon/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon/favicon.ico" rel="shortcut icon" />
        <link
          href="/favicon/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link href="/favicon/site.webmanifest" rel="manifest" />
        <title>{appTitle}</title>

        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />

        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GlobalConfigContextProvider value={globalConfigContext}>
          <QueryClientProvider client={queryClient}>
            <QuiRoot>
              <AppDocsLayout
                onPackageManagerChange={(nextValue) =>
                  updateSiteState("/action/set-site-state", {
                    packageManager: nextValue,
                  })
                }
                packageManager={data.packageManager}
                ssrUserAgent={data.ssrUserAgent}
              >
                <Outlet />
              </AppDocsLayout>
            </QuiRoot>
          </QueryClientProvider>
        </GlobalConfigContextProvider>
        <ScrollRestoration />
        <Scripts />
        {/* Angular component demos with portals render into this */}
        <div
          data-brand={brand}
          data-theme={theme}
          id="demo-portal-container"
        ></div>
      </body>
    </html>
  )
}

// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session
// storage.
export default function AppWithProviders() {
  const data = useLoaderData<{qdsBrand: QdsBrand; theme: Theme | null}>()

  const [propsLayout, setPropsLayout] = useState<DocPropsLayout>("table")

  const [brand, setBrand] = useState<QdsBrand | null>(data.qdsBrand)

  const propsLayoutContext: PropsLayoutState = useMemo(
    () => ({
      propsLayout,
      setPropsLayout,
    }),
    [propsLayout],
  )

  const qdsThemeContext: QdsThemeContextValue = useMemo(
    () => ({
      brand,
      setBrand: (valueOrUpdater) => {
        const nextBrand =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(brand)
            : valueOrUpdater

        void fetch("/action/set-qds-brand", {
          body: nextBrand || "qualcomm",
          method: "POST",
        })

        setBrand(nextBrand)
      },
    }),
    [brand],
  )

  useEffect(() => {
    console.debug(siteData)

    if (
      !document.querySelector("angular-demo") &&
      !document.querySelector("script#ng-code-demo")
    ) {
      const script = Object.assign(document.createElement("script"), {
        id: "ng-code-demo",
        src: "/main.js",
        type: "module",
      })
      document.body.appendChild(script)
    }
  }, [])

  return (
    <SiteContextProvider value={siteData ?? siteDataFallback}>
      <PropsLayoutProvider value={propsLayoutContext}>
        <ThemeProvider
          specifiedTheme={data.theme}
          themeAction="/action/set-theme"
        >
          <QdsThemeContextProvider value={qdsThemeContext}>
            <Provider>
              <App />
            </Provider>
          </QdsThemeContextProvider>
        </ThemeProvider>
      </PropsLayoutProvider>
    </SiteContextProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  let jsx
  if (isRouteErrorResponse(error)) {
    jsx = (
      <>
        <h1 className="q-text-1-primary q-font-body-lg-strong">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    )
  } else if (error instanceof Error) {
    jsx = (
      <>
        <h1 className="q-text-1-primary q-font-body-lg-strong">Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </>
    )
  } else {
    jsx = (
      <h1 className="q-text-1-primary q-font-body-lg-strong">Unknown Error</h1>
    )
  }

  return (
    <div data-brand="qualcomm" data-theme="dark">
      <div className="bg-2 h-full w-full">{jsx}</div>
    </div>
  )
}
