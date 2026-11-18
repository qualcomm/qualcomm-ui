import {useEffect, useMemo, useState} from "react"

import {Provider} from "jotai"
import {
  Links,
  type LinksFunction,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router"

import {getPages} from "@qualcomm-ui/docs-plugin/markdown-content"
import type {SiteData} from "@qualcomm-ui/mdx-common"
import {siteData} from "@qualcomm-ui/mdx-vite-plugin"
import {DocsManifestProvider} from "@qualcomm-ui/react-mdx/context"
import {
  type DocPropsLayout,
  PropsLayoutProvider,
} from "@qualcomm-ui/react-mdx/typedoc"
import {
  isTheme,
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "@qualcomm-ui/react-router-utils/client"
import {
  type QdsBrand,
  QdsThemeContextProvider,
} from "@qualcomm-ui/react/qds-theme"
import "@qualcomm-ui/react-vscode/styles.css"

import {MdxLayout} from "./components/mdx-layout"
import {themeCookie} from "./sessions.server"

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
  {href: "https://use.typekit.net/nhs4wvu.css", rel: "stylesheet"},
]

export async function loader({request}: LoaderFunctionArgs) {
  const cookieTheme = await themeCookie.parse(request.headers.get("cookie"))
  return {
    ssrUserAgent: request.headers.get("user-agent"),
    theme: isTheme(cookieTheme) ? cookieTheme : Theme.DARK,
  }
}

function App() {
  const {ssrUserAgent} = useLoaderData<typeof loader>()
  const [theme] = useTheme()
  const {pathname} = useLocation()
  const page = siteData.pageMap[pathname]

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
        <title>
          {page?.title
            ? `${page.title} | QUI React VS Code`
            : "QUI React VS Code"}
        </title>
        {page?.description ? (
          <meta content={page.description} name="description" />
        ) : null}
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
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
      </head>
      <body>
        <MdxLayout ssrUserAgent={ssrUserAgent}>
          <Outlet />
        </MdxLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  const [docsSiteData, setDocsSiteData] = useState<SiteData>(siteData)
  const [propsLayout, setPropsLayout] = useState<DocPropsLayout>("table")
  const [brand, setBrand] = useState<QdsBrand | null>("qualcomm")

  useEffect(() => {
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

  const manifest = useMemo(() => ({...docsSiteData, getPages}), [docsSiteData])
  const propsLayoutContext = useMemo(
    () => ({propsLayout, setPropsLayout}),
    [propsLayout],
  )
  const qdsThemeContext = useMemo(() => ({brand, setBrand}), [brand])

  return (
    <DocsManifestProvider value={manifest}>
      <PropsLayoutProvider value={propsLayoutContext}>
        <ThemeProvider theme={data.theme} themeAction="/action/set-theme">
          <QdsThemeContextProvider value={qdsThemeContext}>
            <Provider>
              <App />
            </Provider>
          </QdsThemeContextProvider>
        </ThemeProvider>
      </PropsLayoutProvider>
    </DocsManifestProvider>
  )
}
