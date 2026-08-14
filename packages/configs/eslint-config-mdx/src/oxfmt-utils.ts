// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {readFile} from "node:fs/promises"
import {dirname, isAbsolute, join, parse, resolve} from "node:path"
import {pathToFileURL} from "node:url"
import {format as formatCode, type FormatConfig} from "oxfmt"
import {parseConfigFileTextToJson} from "typescript"

const CONFIG_FILENAMES = [".oxfmtrc.json", ".oxfmtrc.jsonc", "oxfmt.config.ts"]
const configCache = new Map<string, Promise<FormatConfig>>()

export async function loadOxfmtConfig(
  filePath: string | undefined,
): Promise<FormatConfig> {
  const basePath = getAbsolutePath(filePath)
  const startDir = parse(basePath).ext ? dirname(basePath) : basePath
  const cachedConfig = configCache.get(startDir)

  if (cachedConfig) {
    return cachedConfig
  }

  const configPromise = findOxfmtConfig(startDir).catch((error: unknown) => {
    configCache.delete(startDir)
    throw error
  })

  configCache.set(startDir, configPromise)

  return configPromise
}

export async function formatOxfmt(
  filePath: string,
  value: string,
  config: FormatConfig,
): Promise<null | string> {
  try {
    const result = await formatCode(filePath, value, config)

    if (result.errors.length > 0) {
      return null
    }

    return removeFinalEol(result.code)
  } catch {
    return null
  }
}

export function getAbsolutePath(filePath: string | undefined): string {
  if (!filePath) {
    return process.cwd()
  }

  return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

async function findOxfmtConfig(startDir: string): Promise<FormatConfig> {
  let currentDir = startDir

  while (true) {
    for (const configFilename of CONFIG_FILENAMES) {
      const configPath = join(currentDir, configFilename)
      const config = await readOxfmtConfig(configPath, configFilename)

      if (config) {
        return config
      }
    }

    const parentDir = dirname(currentDir)

    if (parentDir === currentDir) {
      return {}
    }

    currentDir = parentDir
  }
}

async function readOxfmtConfig(
  configPath: string,
  configFilename: string,
): Promise<FormatConfig | null> {
  if (configFilename === "oxfmt.config.ts") {
    return readTypeScriptConfig(configPath)
  }

  const source = await readOptionalFile(configPath)

  if (source === null) {
    return null
  }

  if (configFilename.endsWith(".jsonc")) {
    return validateConfig(configPath, readJsoncConfig(configPath, source))
  }

  return validateConfig(configPath, JSON.parse(source))
}

async function readTypeScriptConfig(
  configPath: string,
): Promise<FormatConfig | null> {
  const source = await readOptionalFile(configPath)

  if (source === null) {
    return null
  }

  const url = pathToFileURL(configPath)
  url.searchParams.set("cache", Date.now().toString())

  const module = (await import(url.href)) as {default?: unknown}

  return validateConfig(configPath, module.default)
}

function readJsoncConfig(configPath: string, source: string): unknown {
  const result = parseConfigFileTextToJson(configPath, source)

  if (result.error) {
    const message = result.error.messageText
    throw new Error(typeof message === "string" ? message : message.messageText)
  }

  return result.config
}

function validateConfig(configPath: string, config: unknown): FormatConfig {
  if (!isPlainConfig(config)) {
    throw new Error(`${configPath} must define an object`)
  }

  return config
}

async function readOptionalFile(path: string): Promise<null | string> {
  try {
    return await readFile(path, "utf8")
  } catch (error) {
    if (isMissingFileError(error)) {
      return null
    }

    throw error
  }
}

function removeFinalEol(value: string): string {
  return value.replace(/\r?\n$/u, "")
}

function isPlainConfig(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isMissingFileError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false
  }

  const {code} = error

  return code === "ENOENT" || code === "ENOTDIR"
}
