import "./globals.css"

import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "react-router"

import {QuiRoot} from "@qualcomm-ui/react/qui-root"

export default function App() {
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
        <QuiRoot>
          <Outlet />
        </QuiRoot>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
