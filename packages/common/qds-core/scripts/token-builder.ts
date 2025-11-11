import * as Figma from "figma-api"
import {mkdir, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import type {Dictionary, TransformedToken} from "style-dictionary"
import {
  logBrokenReferenceLevels,
  propertyFormatNames,
} from "style-dictionary/enums"
import type {FormatFnArguments} from "style-dictionary/types"
import {formattedVariables} from "style-dictionary/utils"
import {StyleDictionary} from "style-dictionary-utils"

import {dedent} from "@qualcomm-ui/utils/dedent"

import {omittedPrefixRegexp} from "./constants"
import {tokenFilesFromLocalVariables} from "./figma-to-dtcg"
import {registerCustomTransformsForDtcg} from "./style-dictionary-transformers"
import type {DimensionRawValue} from "./token-types"
import {
  type Brand,
  brands,
  styleOutputDir,
  type Theme,
  themes,
  updateFoundationsFile,
} from "./utils"

const __dirname = dirname(fileURLToPath(import.meta.url))

interface ParserConfig {
  componentLibraryFileKey: string
  /**
   * Full path to the directory that will contain the generated CSS files.
   */
  cssOutputDir: string
  foundationsLibraryFileKey: string
  /**
   * Temporary output directory for debugging Figma API responses.
   */
  outputDir: string
  /**
   * The Figma REST API access token.
   */
  token: string
}

/**
 * Disclaimer: this parser is specific to our token architecture. It probably won't
 * work as a general parser for other formats.
 */
export class FigmaTokenBuilder {
  private api: Figma.Api

  constructor(private config: ParserConfig) {
    this.api = new Figma.Api({personalAccessToken: config.token})
  }

  static fromEnv(): FigmaTokenBuilder {
    const token = process.env.FIGMA_REST_TOKEN
    if (!token) {
      throw new Error("FIGMA_REST_TOKEN not set")
    }
    return new FigmaTokenBuilder({
      componentLibraryFileKey: "ETvFgN3bbNvr6sbpoZyNuA",
      cssOutputDir: resolve(__dirname, "../src/styles"),
      foundationsLibraryFileKey: "jTaqbtJFlwmu8Ab8etvYeg",
      outputDir: styleOutputDir,
      token,
    })
  }

  private async writeDebugData(
    dictionary: Dictionary,
    brand: Brand,
    theme: Theme,
  ) {
    await writeFile(
      resolve(__dirname, `./temp/${brand}-${theme}-flat-tokens.json`),
      JSON.stringify(dictionary.allTokens, null, 2),
      "utf-8",
    )
    await writeFile(
      resolve(__dirname, `./temp/${brand}-${theme}-token-map.json`),
      JSON.stringify(
        Array.from(dictionary.tokenMap.keys()).reduce(
          (acc: Record<string, TransformedToken>, key) => {
            acc[key] = dictionary.tokenMap.get(key)!
            return acc
          },
          {},
        ),
        null,
        2,
      ),
      "utf-8",
    )
  }

  private qdsCssFormatter = async (
    {dictionary, options}: FormatFnArguments,
    brand: Brand,
    theme: Theme,
  ): Promise<string> => {
    const {outputReferences, selector} = options

    await this.writeDebugData(dictionary, brand, theme)

    const header = dedent(`
      /**
       * This file was generated automatically. Do not edit it directly.
       */
       /* stylelint-disable */\n\n
    `)

    const formattedVariableOutput = formattedVariables({
      dictionary,
      format: propertyFormatNames.css,
      outputReferences,
      usesDtcg: true,
    })
      .split("\n")
      .map((line) => line.trim())
      .sort((a, b) => {
        // sort colors first
        if (a.startsWith("--color")) {
          return b.startsWith("--color") ? a.localeCompare(b) : -1
        }
        if (b.startsWith("--color")) {
          return 1
        }
        if (
          (a.startsWith("--sizing-") && b.startsWith("--sizing-")) ||
          (a.startsWith("--spacing-") && b.startsWith("--spacing-"))
        ) {
          const numA = parseInt(
            a.match(/((--sizing-)|(--spacing-))(\d+):/)?.[1] || "0",
          )
          const numB = parseInt(
            b.match(/((--sizing-)|(--spacing-))(\d+):/)?.[1] || "0",
          )
          return numA - numB
        }
        return a.localeCompare(b)
      })
      .join("\n  ")

    return `${header}${selector} {\n  ${formattedVariableOutput}\n}\n`
  }

  async parseAndSave(): Promise<void> {
    await mkdir(this.config.outputDir, {recursive: true})

    const foundationsResponse = await this.api.getLocalVariables({
      file_key: this.config.foundationsLibraryFileKey,
    })

    await updateFoundationsFile(foundationsResponse)

    const tokenJsonDir = resolve(__dirname, "./temp/tokens")

    await mkdir(tokenJsonDir, {recursive: true}).catch()

    const fileData = tokenFilesFromLocalVariables(foundationsResponse)
    await Promise.all(
      Object.keys(fileData).map(async (key) => {
        const tokenData = fileData[key]
        const outputPath = resolve(tokenJsonDir, `${key}.json`)
        await writeFile(outputPath, JSON.stringify(tokenData, null, 2), "utf-8")
      }),
    )

    await writeFile(
      resolve(__dirname, "./temp/design-tokens.json"),
      JSON.stringify(fileData, null, 2),
      "utf-8",
    )

    if (!fileData["core-mode-1"]) {
      throw new Error("Could not find core layer in Figma file")
    }

    // flatten measurements into a record for easy find/replace.
    const measurements = Object.entries(
      fileData["core-mode-1"].measurements,
    ).reduce((acc: Record<string, DimensionRawValue>, [key, value]) => {
      acc[`{measurements.${key}}`] = value.$value
      return acc
    }, {})

    registerCustomTransformsForDtcg({measurements})

    for (const brand of brands) {
      for (const theme of themes) {
        const dictionary = new StyleDictionary({
          hooks: {
            formats: {
              qdsCss: (opts) => this.qdsCssFormatter(opts, brand, theme),
            },
            preprocessors: {
              fixMeasurements: (dictionary) => {
                delete dictionary.measurements["-1"]
                delete dictionary.measurements["-2"]
                delete dictionary.measurements["-3"]
                delete dictionary.measurements["-4"]
                return dictionary
              },
              // removes the unused individual shadow variables, but keeps their
              // shorthand equivalents, i.e. `var(--shadow-*)`
              removeShadowParts: (dictionary) => {
                if (dictionary.elevation) {
                  delete dictionary.elevation
                }
                return dictionary
              },
              // removes the unused individual typography variables, but keeps their
              // shorthand equivalents, i.e. `var(--font-*)`
              removeTypographyParts: (dictionary) => {
                if (dictionary.type?.static) {
                  delete dictionary.type?.static
                }
                return dictionary
              },
              removeUnusedBrandTokens: (dictionary) => {
                switch (brand) {
                  case "qualcomm":
                    delete dictionary.dw
                    delete dictionary.sd
                    break
                  case "dragonwing":
                    delete dictionary.qc
                    delete dictionary.sd
                    break
                  case "snapdragon":
                    delete dictionary.qc
                    delete dictionary.dw
                    break
                }
                return dictionary
              },
            },
          },
          log: {
            errors: {
              brokenReferences: logBrokenReferenceLevels.console,
            },
            verbosity: "silent",
          },
          platforms: {
            cssMin: {
              buildPath: this.config.outputDir,
              files: [
                {
                  destination: `${brand}-${theme}.css`,
                  filter: (token) => {
                    return !omittedPrefixRegexp.test(token.name)
                  },
                  format: "qdsCss",
                  options: {
                    outputReferences: (token) =>
                      ["font-family", "font-weight"].some((part) =>
                        token.name.includes(part),
                      ),
                    selector: `[data-brand="${brand}"][data-theme="${theme}"]`,
                  },
                },
              ],
              // preprocessors don't seem to impact variable resolution either
              preprocessors: [
                "fixMeasurements",
                "removeUnusedBrandTokens",
                "removeShadowParts",
                "removeTypographyParts",
              ],
              transformGroup: "custom/css-extended",
            },
          },
          source: [
            `${tokenJsonDir}/core*`,
            `${tokenJsonDir}/primitives-${brand}*`,
            `${tokenJsonDir}/screen-size-375*`,
            `${tokenJsonDir}/theme-${theme}.json`,
            `${tokenJsonDir}/brand-${brand}*`,
            `${tokenJsonDir}/font-stretch.json`,
          ],
        })
        await dictionary.buildAllPlatforms()
      }
    }
  }
}

async function main() {
  const parser = FigmaTokenBuilder.fromEnv()
  await parser.parseAndSave()
}

void main()
