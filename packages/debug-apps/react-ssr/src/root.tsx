import "./globals.css"

import {useState} from "react"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "react-router"

import {QuiRoot} from "@qualcomm-ui/react/qui-root"

export default function App() {
  const [queryClient] = useState(new QueryClient())

  return (
    <html
      lang="en"
      data-theme="dark"
      data-brand="qualcomm"
      style={{colorScheme: "dark"}}
    >
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <title>QUI React SSR Debug</title>

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
          <QuiRoot>
            <Outlet />
          </QuiRoot>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
