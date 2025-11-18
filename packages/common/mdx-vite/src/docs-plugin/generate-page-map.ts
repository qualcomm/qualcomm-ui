import {program} from "@commander-js/extra-typings"
import {glob} from "glob"
import {writeFile} from "node:fs/promises"
import {resolve} from "node:path"
import {cwd} from "node:process"

import {ConfigLoader, fixPath, SearchIndexer} from "./internal"

export function addGeneratePageMapCommand() {
  program
    .command("generate-page-map")
    .description(
      "Invokes the docs-plugin once to build the site data and writes it to json",
    )
    .option(
      "-c, --config-file <configFile>",
      "Path to the qui-docs.config.ts config file",
    )
    .option(
      "-r, --routes-dir <routesDir>",
      "Path to the routes directory",
      "src/routes",
    )
    .option(
      "-o, --output <output>",
      "Output path for the site data json",
      "site-data.json",
    )
    .action(async (options) => {
      try {
        const configLoader = new ConfigLoader({configFile: options.configFile})
        const resolvedConfig = configLoader.loadConfig()
        const routesDir = fixPath(
          resolve(resolvedConfig.appDirectory, resolvedConfig.pageDirectory),
        )
        const indexer = new SearchIndexer({
          ...resolvedConfig,
          srcDir: fixPath(resolve(cwd(), resolvedConfig.appDirectory)),
          typeDocProps: {},
        })
        const files = glob.sync(
          [`${routesDir}/**/*.mdx`, `${routesDir}/**/*.tsx`],
          {
            absolute: true,
            cwd: cwd(),
          },
        )
        indexer.buildIndex(files, true)
        await writeFile(
          resolve(cwd(), options.output),
          JSON.stringify(indexer.pageMap, null, 2),
          "utf-8",
        )
      } catch (error) {
        console.error(
          "Generate Site Data Error:",
          error instanceof Error ? error.message : String(error),
        )
        process.exit(1)
      }
    })
}
