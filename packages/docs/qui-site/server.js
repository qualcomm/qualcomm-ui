import {createRequestHandler} from "@react-router/express"
import express from "express"
import morgan from "morgan"
import {readFileSync} from "node:fs"
import https from "node:https"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// TODO: get production hostname from environment variables
const host =
  process.env.NODE_ENV === "production"
    ? process.env.HOST_NAME
    : "mock.qui.local.qualcomm.com"

const app = express()

const server = https.createServer(
  {
    cert: readFileSync(
      resolve(__dirname, "../../../certs/_wildcard.qui.local.qualcomm.com.pem"),
    ),
    key: readFileSync(
      resolve(
        __dirname,
        "../../../certs/_wildcard.qui.local.qualcomm.com-key.pem",
      ),
    ),
  },
  app,
)

const port = process.env.PORT || 3300

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: {
            allowedHosts: true,
            hmr: {server},
            middlewareMode: true,
          },
        }),
      )

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build")
    : await import("./build/server/index.js"),
})

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by")

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", {immutable: true, maxAge: "1y"}),
  )
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", {maxAge: "1h"}))

app.use(morgan("tiny"))

// handle SSR requests
app.all("*", remixHandler)

server.listen(port, () =>
  console.log(`Express server listening at https://${host}:${port}`),
)
