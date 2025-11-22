import "./globals.css"

import {useEffect, useMemo, useState} from "react"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Provider} from "jotai"
import {
  Links,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router"

import {SiteData} from "@qualcomm-ui/mdx-common"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {
  PackageManager,
  SiteContextProvider,
} from "@qualcomm-ui/react-mdx/context"
import {
  DocPropsLayout,
  PropsLayoutProvider,
  PropsLayoutState,
} from "@qualcomm-ui/react-mdx/typedoc"
import {
  isTheme,
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  updateSiteState,
  useTheme,
} from "@qualcomm-ui/react-router-utils/client"

import {AppDocsLayout} from "./components"
import {siteStateCookie, themeCookie} from "./sessions.server"

const siteDataFallback: SiteData = {navItems: [], pageMap: {}, searchIndex: []}

// Return the theme from the session storage using the loader
export const loader: LoaderFunction = async ({request}) => {
  const cookie = request.headers.get("cookie")

  const cookieTheme = await themeCookie.parse(cookie)
  const siteState = await siteStateCookie.parse(cookie)

  return {
    packageManager: siteState?.packageManager || "npm",
    ssrUserAgent: request.headers.get("user-agent"),
    theme: isTheme(cookieTheme) ? cookieTheme : Theme.DARK,
  }
}

function App() {
  const [queryClient] = useState(new QueryClient())
  const data = useLoaderData<{
    packageManager?: PackageManager
    ssrUserAgent: string
    theme: Theme
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
        <title>{appTitle}</title>

        <PreventFlashOnWrongTheme ssrTheme={Boolean(data?.theme)} />

        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,110,400;8..144,110,560;8..144,114,400;8..144,114,500;8..144,114,520;8..144,114,660;8..144,114,680&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400..600;1,400..600&display=fallback"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
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
  const data = useLoaderData<{theme: Theme | null}>()

  const [propsLayout, setPropsLayout] = useState<DocPropsLayout>("table")
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

  return (
    <SiteContextProvider value={docsSiteData}>
      <PropsLayoutProvider value={propsLayoutContext}>
        <ThemeProvider
          theme={data.theme}
          themeAction="/action/set-theme"
        >
          <Provider>
            <App />
          </Provider>
        </ThemeProvider>
      </PropsLayoutProvider>
    </SiteContextProvider>
  )
}
