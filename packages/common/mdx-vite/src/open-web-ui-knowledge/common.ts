// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {program} from "@commander-js/extra-typings"
import {config} from "dotenv"

import type {GlobalCliOpts} from "./types"

export function loadEnv() {
  const options: GlobalCliOpts = program.optsWithGlobals()
  console.debug(options)
  if (options.env) {
    config({path: options.env})
  } else {
    config()
  }
}

export interface SharedConfig {
  knowledgeId: string
  webUiKey: string
  webUiUrl: string
}

export function getConfigFromEnv(): SharedConfig {
  const openWebUiUrl = process.env.WEB_UI_URL
  const openWebUiKey = process.env.WEB_UI_KEY
  const knowledgeId = process.env.KNOWLEDGE_ID

  if (!openWebUiUrl || !openWebUiKey || !knowledgeId) {
    throw new Error("WEB_UI_URL, WEB_UI_KEY, and KNOWLEDGE_ID must be set")
  }
  return {
    knowledgeId,
    webUiKey: openWebUiKey,
    webUiUrl: openWebUiUrl,
  }
}

export interface KnowledgeMeta {
  collection_name: string
  content_type: string
  data: Record<string, unknown>
  name: string
  size: number
}

export interface KnowledgeResponse {
  files: {id: string; meta: KnowledgeMeta}[]
}

export interface ErrorResponse {
  detail: string
}

export class KnowledgeApi {
  private readonly config: SharedConfig
  private knowledgeCache: KnowledgeResponse | null = null

  constructor(config: SharedConfig) {
    this.config = config
  }

  get headers() {
    return {
      Authorization: `Bearer ${this.config.webUiKey}`,
    }
  }

  async listKnowledgeFiles() {
    if (this.knowledgeCache) {
      return this.knowledgeCache
    }
    const knowledge: KnowledgeResponse | ErrorResponse = await fetch(
      `${this.config.webUiUrl}/api/v1/knowledge/${this.config.knowledgeId}`,
      {
        headers: {
          ...this.headers,
          Accept: "application/json",
        },
      },
    ).then((res) => res.json())
    if ("detail" in knowledge) {
      throw new Error(knowledge.detail)
    } else {
      this.knowledgeCache = knowledge
    }
    return this.knowledgeCache
  }

  async downloadFile(fileId: string): Promise<string | null> {
    const fileResponse = await fetch(
      `${this.config.webUiUrl}/api/v1/files/${fileId}`,
      {
        headers: {
          ...this.headers,
          Accept: "application/json",
        },
      },
    ).then((res) => res.json())

    return fileResponse?.data?.content ?? ""
  }

  async removeKnowledgeFile(id: string) {
    return fetch(
      `${this.config.webUiUrl}/api/v1/knowledge/${this.config.knowledgeId}/file/remove`,
      {
        body: JSON.stringify({file_id: id}),
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    ).then((res) => res.json())
  }

  async deleteFile(id: string) {
    return fetch(`${this.config.webUiUrl}/api/v1/files/${id}`, {
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
      },
      method: "DELETE",
    }).then((res) => res.json())
  }

  async uploadFile(
    fileBuffer: Buffer,
    name: string,
  ): Promise<{filename?: string; id?: string}> {
    const formData = new FormData()
    formData.append("file", new Blob([fileBuffer as BlobPart]), name)
    formData.append("knowledge_id", this.config.knowledgeId)

    return fetch(`${this.config.webUiUrl}/api/v1/files/`, {
      body: formData,
      headers: {
        ...this.headers,
        Accept: "application/json",
      },
      method: "POST",
    }).then((res) => res.json())
  }

  async associateFile(fileId: string): Promise<{name?: string}> {
    return fetch(
      `${this.config.webUiUrl}/api/v1/knowledge/${this.config.knowledgeId}/file/add`,
      {
        body: JSON.stringify({file_id: fileId}),
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    ).then((res) => res.json())
  }
}
