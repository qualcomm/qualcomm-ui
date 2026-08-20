import {describe, expect, test} from "vitest"

import {
  semanticSearchDevPlugin,
  semanticSearchServerDependencies,
} from "./semantic-search-dev-plugin.js"

describe("semanticSearchDevPlugin", () => {
  test("keeps server-only search dependencies external to Vite builds", async () => {
    const plugin = semanticSearchDevPlugin({
      outputDirectory: "generated/semantic-search",
      sectionsPath: "public/exports/sections.json",
    })
    const configHook = plugin.config

    if (typeof configHook !== "function") {
      throw new Error("Semantic search plugin must configure Vite.")
    }

    const config = await configHook.call(
      {} as never,
      {} as never,
      {command: "build", mode: "production"} as never,
    )

    expect(config).toEqual({
      ssr: {
        external: [
          "@qualcomm-ui/react-router-utils",
          ...semanticSearchServerDependencies,
        ],
      },
    })
  })
})
