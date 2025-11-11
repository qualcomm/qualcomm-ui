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

import type {SiteData} from "@qualcomm-ui/mdx-common"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {
  isQdsTheme,
  type QdsBrand,
  QdsThemeContextProvider,
  type QdsThemeContextValue,
} from "@qualcomm-ui/react/qds-theme"
import {QuiRoot} from "@qualcomm-ui/react/qui-root"
import {
  type PackageManager,
  type RouteDemoState,
  SiteContextProvider,
} from "@qualcomm-ui/react-mdx/context"
import {
  type DocPropsLayout,
  PropsLayoutProvider,
  type PropsLayoutState,
} from "@qualcomm-ui/react-mdx/typedoc"
import {
  isTheme,
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  updateDemoState,
  updateSiteState,
  useTheme,
} from "@qualcomm-ui/react-router-utils/client"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {AppDocsLayout} from "./components"
import {
  demoStateCookie,
  qdsThemeCookie,
  siteStateCookie,
  themeCookie,
} from "./sessions.server"

const siteDataFallback: SiteData = {navItems: [], pageMap: {}, searchIndex: []}

// Return the theme from the session storage using the loader
export const loader: LoaderFunction = async ({request}) => {
  const cookie = request.headers.get("cookie")

  const cookieTheme = await themeCookie.parse(cookie)
  const docState = await siteStateCookie.parse(cookie)
  const qdsTheme = await qdsThemeCookie.parse(cookie)
  const demoState = await demoStateCookie.parse(cookie)

  return {
    demoState: demoState ?? {},
    hideDemoBrandSwitcher: docState?.hideDemoBrandSwitcher || false,
    packageManager: docState?.packageManager || "npm",
    qdsBrand: isQdsTheme(qdsTheme) ? qdsTheme : ("qualcomm" satisfies QdsBrand),
    sidebarScrollTop: docState?.sidebarScrollTop,
    ssrUserAgent: request.headers.get("user-agent"),
    theme: isTheme(cookieTheme) ? cookieTheme : Theme.DARK,
  }
}

function App() {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    }),
  )
  const data = useLoaderData<{
    demoState: RouteDemoState
    hideDemoBrandSwitcher: boolean
    packageManager: PackageManager
    sidebarScrollTop: number | undefined
    ssrUserAgent: string
  }>()

  const [theme] = useTheme()

  const location = useLocation()
  const title = siteData.pageMap[location.pathname]?.title || ""
  const appTitle = title ? `QUI | ${title}` : "QUI React"
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html
      className={clsx(`${theme || "dark"}`, {"qui-preload": !mounted})}
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
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,400..600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
        <link href="https://use.typekit.net/nhs4wvu.css" rel="stylesheet" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <QuiRoot>
            <AppDocsLayout
              demoState={data.demoState}
              hideDemoBrandSwitcher={data.hideDemoBrandSwitcher}
              onDemoStateChange={(nextValue) => {
                void updateDemoState("/action/set-demo-state", nextValue)
              }}
              onPackageManagerChange={(nextValue) =>
                updateSiteState("/action/set-site-state", {
                  packageManager: nextValue,
                })
              }
              packageManager={data.packageManager}
              sidebarScrollTop={data.sidebarScrollTop}
              ssrUserAgent={data.ssrUserAgent}
            >
              <Outlet />
            </AppDocsLayout>
          </QuiRoot>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
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
      setBrand,
    }),
    [brand],
  )

  useEffect(() => {
    console.debug(siteData)
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
