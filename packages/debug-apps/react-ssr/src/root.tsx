import {useState} from "react"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {
  type LoaderFunctionArgs,
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router"

import {
  isTheme,
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "@qualcomm-ui/react-router-utils/client"

import {AppHeader} from "./components/app-header"
import "./globals.css"
import {themeCookie} from "./sessions.server"

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

interface RootLoaderData {
  theme: Theme
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<RootLoaderData> {
  const theme = await themeCookie.parse(request.headers.get("cookie"))

  return {theme: isTheme(theme) ? theme : Theme.DARK}
}

function App() {
  const [queryClient] = useState(new QueryClient())
  const [theme] = useTheme()

  return (
    <html
      data-brand="qualcomm"
      data-theme={theme || Theme.DARK}
      lang="en"
      style={{colorScheme: theme || Theme.DARK}}
    >
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <title>QUI React SSR Debug</title>
        <PreventFlashOnWrongTheme ssrTheme={Boolean(theme)} />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppHeader />
          <main className="app-content">
            <Outlet />
          </main>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<RootLoaderData>()

  return (
    <ThemeProvider theme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}
