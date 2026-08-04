// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {createHash} from "node:crypto"
import {writeFileSync} from "node:fs"
import {access, readFile} from "node:fs/promises"
import {resolve} from "node:path"
import {setTimeout} from "node:timers/promises"
import ora from "ora"

import type {KnowledgePages} from "@qualcomm-ui/mdx-common"

import {
  type ApiConfig,
  type FileMetadataResponse,
  FilesApi,
  type FileUploadResponse,
  KnowledgeApi,
  type KnowledgeFilesResponse,
} from "./api.js"
import {
  loadOpenWebUiIntegrations,
  resolveOpenWebUiIntegration,
} from "./common.js"
import {getConfigFromEnv, loadEnv, type SharedConfig} from "./env.js"

interface Config extends SharedConfig {
  force?: boolean
  knowledgeFilePath: string
}

interface KnowledgeFile {
  id: string
  meta: {name?: string}
}

function toKnowledgeFile(file: FileMetadataResponse): KnowledgeFile {
  return {
    id: file.id,
    meta: {name: file.meta?.name as string | undefined},
  }
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

interface UploadError {
  addResponse?: KnowledgeFilesResponse
  detail?: string
  fileId?: string
  uploadResponse?: FileUploadResponse
}

interface UploadResult {
  error?: UploadError
  skipped?: boolean
  success: boolean
}

class Uploader {
  readonly config: Config
  readonly knowledgeApi: KnowledgeApi
  readonly filesApi: FilesApi
  private fileHashCache: Map<string, string> = new Map()
  private knowledgeFilesCache: KnowledgeFile[] | null = null

  constructor(config: Config) {
    this.config = config
    const apiConfig: ApiConfig = {
      apiKey: config.webUiKey,
      baseUrl: config.webUiUrl,
    }
    this.knowledgeApi = new KnowledgeApi(apiConfig)
    this.filesApi = new FilesApi(apiConfig)
  }

  private async buildHashCache(files: KnowledgeFile[]): Promise<void> {
    const results = await Promise.allSettled(
      files.map(async (f) => {
        try {
          const content = await this.filesApi.getDataContent(f.id)
          if (content?.content) {
            this.fileHashCache.set(f.id, calculateFileHash(content.content))
          }
        } catch {
          // File may not have content yet
        }
      }),
    )
    const failures = results.filter((r) => r.status === "rejected")
    if (failures.length > 0) {
      console.warn(`Failed to cache ${failures.length} file hashes`)
    }
  }

  private async waitForFileDeletion(
    fileId: string,
    fileName: string,
    maxAttempts = 15,
  ): Promise<boolean> {
    const spinner = ora(`File changed, deleting ${fileName}`).start()
    for (let i = 0; i < maxAttempts; i++) {
      this.knowledgeFilesCache = null
      const knowledge = await this.knowledgeApi.getById(this.config.knowledgeId)
      const stillExists = (knowledge.files ?? []).some((f) => f.id === fileId)
      if (!stillExists) {
        this.fileHashCache.delete(fileId)
        spinner.succeed(`File deleted: ${fileId}`)
        return true
      }
      await setTimeout(100 * (i + 1))
    }
    spinner.stop()
    console.debug(`File ${fileId} may not have been fully deleted`)
    return false
  }

  private async uploadWithRetry(
    name: string,
    contents: string,
    maxRetries = 10,
  ): Promise<UploadResult> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const result = await this.uploadFile(name, contents)

      if (result.success) {
        return result
      }

      if (result.error?.detail?.includes("Duplicate content detected")) {
        console.warn(
          `Duplicate content: ${name} is already in knowledge base, skipping`,
        )
        if (result.error.fileId) {
          try {
            console.debug(`Removing duplicate file: ${result.error.fileId}`)
            await this.filesApi.delete(result.error.fileId)
            await this.waitForFileDeletion(result.error.fileId, name)
          } catch (e) {
            console.debug("Failed to remove duplicate file", e)
          }
        }
        return {skipped: true, success: true}
      }

      if (attempt < maxRetries - 1) {
        const delay = 100 * Math.pow(2, attempt)
        console.debug(
          `Retrying ${name} in ${delay}ms (attempt ${attempt + 2}/${maxRetries})`,
        )
        await setTimeout(delay)
      }
    }
    console.debug(`Failed to upload ${name}`)
    return {success: false}
  }

  private async uploadFiles(
    files: Array<{contents: string; name: string}>,
  ): Promise<void> {
    const knowledge = await this.knowledgeApi.getById(this.config.knowledgeId)
    const receivedFiles = knowledge.files?.length
      ? knowledge.files.map(toKnowledgeFile)
      : await this.filesApi
          .list()
          .then((res) =>
            res.filter((file) => file.meta.collection_name === knowledge.id),
          )
    this.knowledgeFilesCache = receivedFiles
    await this.buildHashCache(this.knowledgeFilesCache)

    let skippedCount = 0
    let successCount = 0
    let failureCount = 0

    for (const file of files) {
      const result = await this.uploadWithRetry(file.name, file.contents)
      if (result.skipped) {
        skippedCount++
      } else if (result.success) {
        successCount++
      } else {
        failureCount++
      }
    }

    // Remove stale files that are no longer in the source
    const expectedNames = new Set(files.map((f) => f.name))
    const staleFiles = receivedFiles.filter(
      (f) => f.meta.name && !expectedNames.has(f.meta.name),
    )
    for (const stale of staleFiles) {
      try {
        const spinner = ora(`Removing stale file: ${stale.meta.name}`).start()
        await this.knowledgeApi.removeFile(
          this.config.knowledgeId,
          stale.id,
          true,
        )
        spinner.succeed(`Removed stale file: ${stale.meta.name}`)
      } catch (e) {
        console.warn(`Failed to remove stale file ${stale.meta.name}:`, e)
      }
    }

    if (skippedCount > 0) {
      console.debug(
        `Skipped uploading ${skippedCount} files because their contents did not change`,
      )
    }
    if (successCount > 0) {
      console.debug(`Successfully uploaded ${successCount} files`)
    }
    if (staleFiles.length > 0) {
      console.debug(`Removed ${staleFiles.length} stale file(s)`)
    }
    if (failureCount > 0) {
      console.debug(`Failed to upload ${failureCount} files`)
    }
  }

  private async uploadFile(
    name: string,
    contents: string,
  ): Promise<UploadResult> {
    const knowledgeFiles = this.knowledgeFilesCache ?? []
    const knowledgeFile = knowledgeFiles.find((f) => f.meta.name === name)
    const contentHash = calculateFileHash(contents)

    if (knowledgeFile && !this.config.force) {
      const existingHash = this.fileHashCache.get(knowledgeFile.id)
      if (existingHash === contentHash) {
        return {skipped: true, success: true}
      }
    }

    if (knowledgeFile) {
      try {
        const fileId = knowledgeFile.id
        const spinner = ora(`Updating ${name}`).start()
        await this.filesApi.updateDataContent(fileId, contents)
        await this.knowledgeApi.updateFile(this.config.knowledgeId, fileId)
        spinner.succeed(`Updated ${name}`)
        return {success: true}
      } catch (e) {
        console.warn(`Failed to update existing file ${name}:`, e)
        return {success: false}
      }
    }

    const spinner = ora(`Uploading ${name}`).start()
    const fileBuffer = Buffer.from(contents, "utf-8")

    let uploadedFileId: string | undefined = undefined
    try {
      const uploadResponse = await this.filesApi.upload(fileBuffer, name, {
        processInBackground: false,
      })

      uploadedFileId = uploadResponse.id

      if (!uploadResponse.id || !uploadResponse.filename) {
        spinner.fail(`Error uploading ${name}`)
        return {
          error: {fileId: uploadResponse.id, uploadResponse},
          success: false,
        }
      }

      spinner.text = `Associating ${name} with knowledge base`

      const addResponse = await this.knowledgeApi.addFile(
        this.config.knowledgeId,
        uploadResponse.id,
      )

      if (addResponse.name) {
        spinner.succeed(`${name} associated with knowledge base`)
        this.fileHashCache.set(uploadResponse.id, contentHash)
        return {success: true}
      } else {
        spinner.stop()
        return {
          error: {addResponse, fileId: uploadResponse.id},
          success: false,
        }
      }
    } catch (e) {
      spinner.fail(`Error uploading ${name}`)
      const detail = e instanceof Error ? e.message : String(e)
      return {error: {detail, fileId: uploadedFileId}, success: false}
    }
  }

  private async uploadFromPagesJson(pagesJsonPath: string): Promise<void> {
    const pagesContent = await readFile(pagesJsonPath, "utf-8")
    const pagesData: KnowledgePages = JSON.parse(pagesContent)

    const files = pagesData.pages.map((page) => ({
      contents: page.content,
      name: `${page.pageId}.md`,
    }))

    return this.uploadFiles(files)
  }

  async uploadKnowledge() {
    const inputPath = resolve(this.config.knowledgeFilePath)
    const pagesJsonPath = inputPath.endsWith("pages.json")
      ? inputPath
      : resolve(inputPath, "pages.json")

    const exists = await access(pagesJsonPath)
      .then(() => true)
      .catch(() => false)

    if (!exists) {
      throw new Error(`pages.json not found at ${pagesJsonPath}`)
    }

    return this.uploadFromPagesJson(pagesJsonPath)
  }
}

export function addUploadKnowledgeCommand(): void {
  function getUploader(
    knowledgePath: string | undefined,
    forceUpload?: boolean,
  ) {
    const sharedConfig = getConfigFromEnv()

    const knowledgeFilePath =
      knowledgePath || process.env.KNOWLEDGE_OUTPUT_PATH || "public/exports"

    if (!knowledgeFilePath) {
      throw new Error(
        "KNOWLEDGE_FILE_PATH must be set or provided as the --path option",
      )
    }

    return new Uploader({
      ...sharedConfig,
      force: forceUpload,
      knowledgeFilePath,
    })
  }

  program
    .name("upload-knowledge")
    .description("Upload files to OpenWebUI knowledge base")
    .command("upload-knowledge")
    .option("-p, --path <path>", "Path to file or folder relative to script")
    .option(
      "--force",
      "force upload files, even if their contents have not changed",
    )
    .option(
      "-i, --integration <integrations>",
      "Comma-separated list of integrations to upload to (default: all)",
    )
    .action(async (options) => {
      loadEnv()

      const integrationFilter = options.integration
        ?.split(",")
        .map((e) => e.trim())
        .filter(Boolean)

      const integrations = loadOpenWebUiIntegrations({
        integrations: integrationFilter,
      })

      if (integrations.length === 0) {
        console.log("No integrations configured, using legacy env vars")
        return getUploader(options.path, options.force).uploadKnowledge()
      }

      let successCount = 0
      let failureCount = 0

      for (const {integration, name, outputPath} of integrations) {
        console.log(`\n[${name}] Uploading to OpenWebUI...`)

        try {
          const resolved = resolveOpenWebUiIntegration(
            name,
            integration,
            outputPath,
          )
          const uploader = new Uploader({
            force: options.force,
            knowledgeFilePath: options.path ?? resolved.outputPath,
            knowledgeId: resolved.knowledgeId,
            webUiKey: resolved.apiKey,
            webUiUrl: resolved.url,
          })

          await uploader.uploadKnowledge()
          successCount++
          console.log(`[${name}] Upload complete`)
        } catch (error) {
          failureCount++
          console.error(`[${name}] Upload failed:`, error)
        }
      }

      if (integrations.length > 1) {
        console.log(
          `\nUploaded to ${successCount} integration(s)${
            failureCount > 0 ? `, ${failureCount} failed` : ""
          }`,
        )
      }
    })

  program
    .command("get-knowledge-files")
    .description("Get files from OpenWebUI knowledge base")
    .option("-p, --path <path>", "Path to file or folder relative to script")
    .action(async (options) => {
      loadEnv()

      const uploader = getUploader(options.path)

      const files = await uploader.filesApi.search("*")
      console.debug(`found ${files.length} files`)
      writeFileSync(
        resolve(uploader.config.knowledgeFilePath, "files.json"),
        JSON.stringify(files, null, 2),
        "utf-8",
      )
    })

  program
    .command("clear-knowledge")
    .description("Remove all files from the knowledge base collection")
    .action(async () => {
      loadEnv()

      const sharedConfig = getConfigFromEnv()
      const apiConfig: ApiConfig = {
        apiKey: sharedConfig.webUiKey,
        baseUrl: sharedConfig.webUiUrl,
      }
      const filesApi = new FilesApi(apiConfig)
      const knowledgeApi = new KnowledgeApi(apiConfig)

      const knowledge = await knowledgeApi.getById(sharedConfig.knowledgeId)
      const knowledgeFiles = knowledge.files ?? []

      if (!knowledge) {
        console.log("Knowledge base not found")
        return
      }

      const files = await filesApi
        .list(false)
        .then((files) =>
          files.filter((file) => file.meta?.collection_name === knowledge.id),
        )

      if (files.length === 0) {
        console.log("No files in knowledge base")
        return
      }

      console.log(`Removing ${files.length} files from knowledge base...`)

      for (const file of files) {
        if (knowledgeFiles.some((f) => f.id === file.id)) {
          await knowledgeApi.removeFile(knowledge.id, file.id, true)
        } else {
          // file was already removed from knowledge, but still exists in file
          // storage.
          await filesApi.delete(file.id)
        }
        console.log(`Removed ${file.id}`)
      }

      console.log(`Removed ${files.length} files`)
    })
}
