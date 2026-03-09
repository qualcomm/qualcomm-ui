// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ApiConfig, FilesApi, KnowledgeApi} from "./api"
import type {SharedConfig} from "./env"

export interface KnowledgeCleanerConfig extends SharedConfig {}

export class KnowledgeCleaner {
  private readonly filesApi: FilesApi
  private readonly knowledgeApi: KnowledgeApi

  constructor(config: KnowledgeCleanerConfig) {
    const apiConfig: ApiConfig = {
      apiKey: config.webUiKey,
      baseUrl: config.webUiUrl,
    }
    this.filesApi = new FilesApi(apiConfig)
    this.knowledgeApi = new KnowledgeApi(apiConfig)
  }

  /**
   * TODO: fix. A recent OWUI update changed the KnowledgeApi.list command. We used
   *  that to determine which files belonged to which Knowledge Base.
   */
  async cleanUpOrphanedFiles() {}
}
