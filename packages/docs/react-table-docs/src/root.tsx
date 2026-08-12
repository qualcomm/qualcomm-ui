import {useEffect, useMemo, useState} from "react"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Provider} from "jotai"
import {
  isRouteErrorResponse,
  Links,
  type LinksFunction,
  type LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteError,
} from "react-router"

import {getPages} from "@qualcomm-ui/docs-plugin/markdown-content"
import type {SiteData} from "@qualcomm-ui/mdx-common"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {
  type DemoSettings,
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
import {
  isQdsBrand,
  type QdsBrand,
  QdsThemeContextProvider,
  type QdsThemeContextValue,
} from "@qualcomm-ui/react/qds-theme"

import {AppDocsLayout} from "./components"
import {
  demoStateCookie,
  qdsThemeCookie,
  siteStateCookie,
  themeCookie,
} from "./sessions.server"

import "./globals.css"

export const links: LinksFunction = () => [
  {href: "https://fonts.googleapis.com", rel: "preconnect"},
  {
    crossOrigin: "anonymous",
    href: "https://fonts.gstatic.com",
    rel: "preconnect",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,400..600&display=swap",
    rel: "stylesheet",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400..500&display=swap",
    rel: "stylesheet",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400..500;1,400..500&display=swap",
    rel: "stylesheet",
  },
  {
    href: "https://use.typekit.net/nhs4wvu.css",
    rel: "stylesheet",
  },
]

const siteDataFallback: SiteData = {navItems: [], pageMap: {}, searchIndex: []}

// Return the theme from the session storage using the loader
export const loader: LoaderFunction = async ({request}) => {
  const cookie = request.headers.get("cookie")

  const cookieTheme = await themeCookie.parse(cookie)
  const siteState = await siteStateCookie.parse(cookie)
  const qdsTheme = await qdsThemeCookie.parse(cookie)
  const demoState = await demoStateCookie.parse(cookie)

  return {
    demoSettings:
      siteState?.demoSettings ??
      ({transformTailwindClasses: false} satisfies DemoSettings),
    demoState: demoState ?? {},
    hideDemoBrandSwitcher: siteState?.hideDemoBrandSwitcher || false,
    packageManager: siteState?.packageManager || "npm",
    qdsBrand: isQdsBrand(qdsTheme) ? qdsTheme : ("qualcomm" satisfies QdsBrand),
    sidebarScrollTop: siteState?.sidebarScrollTop,
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
    demoSettings: DemoSettings
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

  return (
    <html
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
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppDocsLayout
            demoSettings={data.demoSettings}
            demoState={data.demoState}
            hideDemoBrandSwitcher={data.hideDemoBrandSwitcher}
            onDemoSettingsChange={(nextValue) => {
              void updateSiteState("/action/set-site-state", {
                demoSettings: nextValue,
              })
            }}
            onDemoStateChange={(nextValue) => {
              void updateDemoState("/action/set-demo-state", nextValue)
            }}
            onPackageManagerChange={(nextValue) =>
              void updateSiteState("/action/set-site-state", {
                packageManager: nextValue,
              })
            }
            packageManager={data.packageManager}
            sidebarScrollTop={data.sidebarScrollTop}
            ssrUserAgent={data.ssrUserAgent}
          >
            <Outlet />
          </AppDocsLayout>
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
  const [docsSiteData, setDocsSiteData] = useState<SiteData>(
    siteData ?? siteDataFallback,
  )

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
    if (import.meta.env.DEV) {
      console.debug(siteData)
    }
    if (import.meta.hot) {
      import.meta.hot.on("qui-docs-plugin:refresh-site-data", setDocsSiteData)
      return () => {
        import.meta.hot?.off(
          "qui-docs-plugin:refresh-site-data",
          setDocsSiteData,
        )
      }
    }
  }, [])

  const siteContext = useMemo(() => {
    return {
      ...docsSiteData,
      getPages,
    }
  }, [docsSiteData])

  return (
    <SiteContextProvider value={siteContext}>
      <PropsLayoutProvider value={propsLayoutContext}>
        <ThemeProvider theme={data.theme} themeAction="/action/set-theme">
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
        <h1 className="text-neutral-primary font-static-body-lg-bold">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </>
    )
  } else if (error instanceof Error) {
    jsx = (
      <>
        <h1 className="text-neutral-primary font-static-body-lg-bold">Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </>
    )
  } else {
    jsx = (
      <h1 className="text-neutral-primary font-static-body-lg-bold">
        Unknown Error
      </h1>
    )
  }

  return (
    <div data-brand="qualcomm" data-theme="dark">
      <div className="bg-2 h-full w-full">{jsx}</div>
    </div>
  )
}
