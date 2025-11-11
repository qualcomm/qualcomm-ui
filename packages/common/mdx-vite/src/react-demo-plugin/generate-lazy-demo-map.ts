// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {glob} from "glob"
import {uniqBy} from "lodash-es"
import {writeFile} from "node:fs/promises"
import {resolve} from "node:path"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {extractPageId, isDemoFile} from "./demo-plugin-utils"

interface DemoPage {
  pageId: string
  routePath: string
}

export interface DemoScanConfig {
  /**
   * @default "src/routes/**\/demos/*.tsx"
   */
  demoPattern?: string

  /**
   * The directory where the routes are located. Must be relative to the project
   * root. The demoPattern should start with this directory:
   *
   * @example
   * ```js
   * {
   *   demoPattern = "src/routes/**\/demos/*.tsx",
   *   routesDir = "src/routes",
   * }
   * ```
   */
  routesDir?: string
}

async function scanForDemoPages({
  demoPattern = "src/routes/**/demos/*.tsx",
  routesDir = "src/routes",
}: DemoScanConfig): Promise<DemoPage[]> {
  const demoFiles = (await glob(demoPattern)).filter((file) => isDemoFile(file))

  return uniqBy(
    demoFiles.map((file) => ({
      pageId: extractPageId(file, routesDir),
      routePath: file
        .replace(routesDir, "")
        .replace(/\/demos\/.*\.tsx$/, "")
        .replace(/\+/g, ""),
    })),
    (page) => page.pageId,
  )
}

function generateLazyDemoLoader(demoPages: DemoPage[]): string {
  const imports = demoPages
    .map(({pageId, routePath}) => {
      return `  "${routePath}": () =>\n    import("virtual:qui-demo-scope/page:${pageId}")`
    })
    .sort()
    .join(",\n")

  return dedent`
    /* eslint-disable */

    // This file is generated automatically. Don't edit it directly.

    import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"

    export const lazyDemos: Record<
      string,
      () => Promise<{getDemo(name: string): ReactDemoWithScope | undefined}>
    > = {
    ${imports},
    }

`
}

async function generateLazyDemoMap(options: {
  output: string
  routesDir: string
}) {
  const routesDir = options.routesDir
  const outputPath = resolve(options.output)

  console.log(`Scanning for demo pages in: ${routesDir}`)

  const demoPages = await scanForDemoPages({routesDir})

  console.log(`Found ${demoPages.length} pages with demos`)

  const content = generateLazyDemoLoader(demoPages)

  await writeFile(outputPath, content, "utf-8")

  console.log(`\nGenerated lazy demo loader at: ${outputPath}`)
}

export function addGenerateLazyDemoMapCommand() {
  program
    .command("generate-lazy-demo-map")
    .description("Scan for pages with demos and generate lazy demo loader")
    .requiredOption(
      "-r, --routes-dir <path>",
      "Path to the routes directory (e.g., src/routes)",
    )
    .requiredOption(
      "-o, --output <path>",
      "Output path for the lazy demo loader file",
    )
    .action(async (options) => {
      try {
        await generateLazyDemoMap(options)
      } catch (error) {
        console.error(
          "Error:",
          error instanceof Error ? error.message : String(error),
        )
        process.exit(1)
      }
    })
}
