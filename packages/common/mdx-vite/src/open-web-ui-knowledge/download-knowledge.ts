// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {mkdir, writeFile} from "node:fs/promises"
import {resolve} from "node:path"

import {getConfigFromEnv, KnowledgeApi, loadEnv} from "./common"

export function addDownloadKnowledgeCommand() {
  program
    .command("download-knowledge")
    .description("Download files from an Open Web UI knowledge base")
    .requiredOption("-o, --output-dir <outputDir>", "Folder path")
    .action(async (opts) => {
      loadEnv()

      await mkdir(opts.outputDir, {recursive: true}).catch()

      const api = new KnowledgeApi(getConfigFromEnv())

      const knowledge = await api.listKnowledgeFiles()
      for (const file of knowledge.files) {
        const data = await api.downloadFile(file.id)

        if (data) {
          await writeFile(
            resolve(opts.outputDir, file.meta.name),
            data,
            "utf-8",
          )
        }
      }
    })
}
