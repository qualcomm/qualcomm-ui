import {useState} from "react"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "react-router"

import "./globals.css"

export default function App() {
  const [queryClient] = useState(new QueryClient())

  return (
    <html
      data-brand="qualcomm"
      data-theme="dark"
      lang="en"
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
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,400..600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400..500;1,400..500&display=swap"
          rel="stylesheet"
        />
        <link href="https://use.typekit.net/nhs4wvu.css" rel="stylesheet" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
