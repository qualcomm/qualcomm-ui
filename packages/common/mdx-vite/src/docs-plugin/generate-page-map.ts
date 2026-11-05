// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {glob} from "glob"
import {readFile, writeFile} from "node:fs/promises"
import {resolve} from "node:path"
import {cwd} from "node:process"

import type {QuiPropTypes} from "@qualcomm-ui/typedoc-common"

import {ConfigLoader} from "./config/index.js"
import type {ResolvedQuiDocsConfig} from "./config/types.js"
import {fixPath} from "./path-utils.js"
import {SearchIndexer} from "./search-indexer.js"

async function resolveDocProps(
  config: ResolvedQuiDocsConfig,
): Promise<Record<string, QuiPropTypes>> {
  if (!config.typeDocProps) {
    return {}
  }

  try {
    const docPropsPath = fixPath(resolve(cwd(), config.typeDocProps))
    const docProps = JSON.parse(await readFile(docPropsPath, "utf-8"))
    return docProps?.props ?? {}
  } catch {
    console.debug(
      "Invalid doc props file. Unable to parse JSON. Please check the file",
    )
    return {}
  }
}

export function addGeneratePageMapCommand(): void {
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
        const typeDocProps = await resolveDocProps(resolvedConfig)
        const routesDir = fixPath(
          resolve(resolvedConfig.appDirectory, resolvedConfig.pageDirectory),
        )
        const indexer = new SearchIndexer({
          ...resolvedConfig,
          srcDir: fixPath(resolve(cwd(), resolvedConfig.appDirectory)),
          typeDocProps,
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
