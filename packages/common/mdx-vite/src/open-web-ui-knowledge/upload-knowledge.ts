// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {createHash} from "node:crypto"
import {
  access,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises"
import {resolve} from "node:path"
import {setTimeout} from "node:timers/promises"
import ora from "ora"

import {
  getConfigFromEnv,
  KnowledgeApi,
  loadEnv,
  type SharedConfig,
} from "./common"

interface Config extends SharedConfig {
  force: boolean
  knowledgeFilePath: string
}

/**
 * Calculates the MD5 checksum of a file.
 */
function calculateFileHash(fileData: string) {
  const normalized = fileData
    .normalize("NFC") // Normalize Unicode to canonical form
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n+$/, "") // Remove trailing newline
  return createHash("sha256").update(normalized).digest("hex")
}

class Uploader {
  private config: Config
  readonly api: KnowledgeApi

  constructor(config: Config) {
    this.config = config
    this.api = new KnowledgeApi(config)
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.config.webUiKey}`,
    }
  }

  private async uploadDirectory() {
    const fileNames = await readdir(this.config.knowledgeFilePath)
    const files = await Promise.all(
      fileNames.map(async (name) => ({
        contents: await readFile(
          resolve(this.config.knowledgeFilePath, name),
          "utf-8",
        ),
        name,
      })),
    )
    const skippedFiles: string[] = []
    let successCount = 0
    let failureCount = 0
    // fill cache
    await this.api.listKnowledgeFiles()

    for (const file of files) {
      let result = await this.uploadFile(file.name, file.contents)
      while (!result.success && result.count && result.count < 5) {
        console.debug("Failed to upload, retrying with count: ", result.count)
        await setTimeout(100)
        result = await this.uploadFile(file.name, file.contents, result.count)
      }
      if (result.skipped) {
        skippedFiles.push(file.name)
      }
      if (result.success) {
        successCount++
      } else {
        failureCount++
      }
    }

    if (skippedFiles.length > 0) {
      console.debug(
        `Skipped uploading ${skippedFiles.length} files because their contents did not change`,
      )
    }
    const uploadCount = successCount - skippedFiles.length
    if (uploadCount) {
      console.debug(`Successfully uploaded ${uploadCount} files`)
    }
    if (failureCount > 0) {
      console.debug(`Failed to upload ${failureCount} files`)
    }
  }

  private async uploadFile(
    name: string,
    contents: string,
    count = 0,
  ): Promise<{
    count?: number
    skipped?: boolean
    success: boolean
  }> {
    const knowledge = await this.api.listKnowledgeFiles()
    const knowledgeFile = (knowledge.files ?? []).find(
      (f) => f.meta.name === name,
    )

    if (knowledgeFile) {
      console.debug("Found existing file: ", knowledgeFile?.meta.name, "")

      const data = await this.api.downloadFile(knowledgeFile.id)

      if (!this.config.force && data) {
        if (calculateFileHash(data) === calculateFileHash(contents)) {
          return {skipped: true, success: true}
        }

        await mkdir(resolve(process.cwd(), `./temp/diff`), {
          recursive: true,
        }).catch()
        await writeFile(
          resolve(process.cwd(), `./temp/diff/${name}-current.md`),
          contents,
          "utf-8",
        )
        await writeFile(
          resolve(process.cwd(), `./temp/diff/${name}-owui.md`),
          data,
          "utf-8",
        )

        const dataLines = data.split("\n")
        const contentLines = contents.split("\n")

        if (dataLines.length === contentLines.length) {
          const allLinesMatch = dataLines.every(
            (line, i) => line === contentLines[i],
          )
          if (allLinesMatch) {
            return {skipped: true, success: true}
          }
        }
      }
    }

    const fileBuffer = await readFile(
      resolve(this.config.knowledgeFilePath, name),
    )

    if (knowledgeFile) {
      await this.api.removeKnowledgeFile(knowledgeFile.id)
      console.log(`Removed existing file: ${name}`)
    }

    const spinner = ora(`Uploading ${name}`).start()

    const uploadResponse = await this.api.uploadFile(fileBuffer, name)

    if (!uploadResponse.id || !uploadResponse.filename) {
      spinner.fail(`Error uploading ${name}, exiting`)
      console.debug(uploadResponse)
      return {success: false}
    }

    // give the upload time to register on the backend
    await setTimeout(500)

    spinner.text = `Associating ${name} with knowledge base`

    const addResponse = await this.api.associateFile(uploadResponse.id)

    if (addResponse.name) {
      spinner.succeed(`${name} associated with knowledge base`)
      return {success: true}
    } else {
      spinner.fail(`Failed to associate ${name} with knowledge base`)
      console.debug(addResponse)
      return {count: count + 1, success: false}
    }
  }

  async uploadKnowledge() {
    const resolvedPath = resolve(this.config.knowledgeFilePath)
    if (
      !(await access(resolvedPath)
        .then(() => true)
        .catch(() => false))
    ) {
      throw new Error(`File or folder not found at ${resolvedPath}`)
    }
    const stats = await stat(resolvedPath)
    if (stats.isDirectory()) {
      return this.uploadDirectory()
    } else {
      // TODO: add
    }
  }
}

export function addUploadKnowledgeCommand() {
  program
    .name("upload-knowledge")
    .description("Upload files to OpenWebUI knowledge base")
    .command("upload-knowledge")
    .option("-p, --path <path>", "Path to file or folder relative to script")
    .option(
      "--force",
      "force upload files, even if their contents have not changed",
    )
    .action(async (options) => {
      loadEnv()

      const sharedConfig = getConfigFromEnv()

      const knowledgeFilePath =
        options.path || process.env.KNOWLEDGE_OUTPUT_PATH

      if (!knowledgeFilePath) {
        throw new Error(
          "KNOWLEDGE_FILE_PATH must be set or provided as the --path option",
        )
      }

      const uploader = new Uploader({
        ...sharedConfig,
        force: options.force || false,
        knowledgeFilePath,
      })

      return uploader.uploadKnowledge()
    })
}
