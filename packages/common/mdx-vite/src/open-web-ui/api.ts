// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

// ============================================================================
// File Types
// ============================================================================

export interface FileMeta {
  collection_name?: string
  content_type?: string
  data?: Record<string, unknown>
  name?: string
  size?: number
}

export interface FileModel {
  access_control?: Record<string, unknown> | null
  created_at: number
  data?: Record<string, unknown> | null
  filename: string
  hash?: string | null
  id: string
  meta?: FileMeta | null
  path?: string | null
  updated_at: number
  user_id: string
}

export interface FileModelResponse {
  created_at: number
  data?: Record<string, unknown> | null
  filename: string
  hash?: string | null
  id: string
  meta: FileMeta
  updated_at: number
  user_id: string
}

export interface FileMetadataResponse {
  created_at: number
  hash?: string | null
  id: string
  meta: Record<string, unknown>
  updated_at: number
}

export interface FileUploadResponse extends FileModelResponse {
  status?: boolean
}

export interface FileProcessStatus {
  error?: string
  status: "pending" | "processing" | "completed" | "failed"
}

export interface FileContentResponse {
  content: string
}

// ============================================================================
// Knowledge Types
// ============================================================================

export interface AccessControl {
  read?: {
    group_ids?: string[]
    user_ids?: string[]
  }
  write?: {
    group_ids?: string[]
    user_ids?: string[]
  }
}

export interface UserResponse {
  email: string
  id: string
  name: string
  profile_image_url?: string
  role: string
}

export interface KnowledgeModel {
  access_control?: AccessControl | null
  created_at: number
  description: string
  id: string
  meta?: Record<string, unknown> | null
  name: string
  updated_at: number
  user_id: string
}

export interface KnowledgeUserModel extends KnowledgeModel {
  user?: UserResponse | null
}

export interface KnowledgeResponse extends KnowledgeModel {
  files?: FileMetadataResponse[] | null
}

export interface KnowledgeUserResponse extends KnowledgeUserModel {
  files?: FileMetadataResponse[] | null
}

export interface KnowledgeFilesResponse extends KnowledgeResponse {
  files: FileMetadataResponse[]
  warnings?: {
    errors: string[]
    message: string
  }
}

export interface KnowledgeForm {
  access_control?: AccessControl | null
  description: string
  name: string
}

export interface KnowledgeFileIdForm {
  file_id: string
}

// ============================================================================
// Common Types
// ============================================================================

export interface ErrorResponse {
  detail: string
}

export interface MessageResponse {
  message: string
}

export interface ApiConfig {
  apiKey: string
  baseUrl: string
}

function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === "object" && response !== null && "detail" in response
  )
}

// ============================================================================
// Files API
// ============================================================================

export class FilesApi {
  private readonly config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
    }
  }

  private get jsonHeaders() {
    return {
      ...this.headers,
      "Content-Type": "application/json",
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()
    if (isErrorResponse(data)) {
      throw new Error(data.detail)
    }
    return data as T
  }

  async upload(
    file: Blob | ArrayBuffer | Uint8Array,
    filename: string,
    options?: {
      metadata?: Record<string, unknown>
      process?: boolean
      processInBackground?: boolean
    },
  ): Promise<FileUploadResponse> {
    const formData = new FormData()
    let blob: Blob
    if (file instanceof Blob) {
      blob = file
    } else if (file instanceof ArrayBuffer) {
      blob = new Blob([file], {type: "text/markdown; charset=utf-8"})
    } else {
      // Create a copy of the data to ensure we have a proper ArrayBuffer
      const copy = new Uint8Array(file).buffer
      blob = new Blob([copy], {type: "text/markdown; charset=utf-8"})
    }
    formData.append("file", blob, filename)

    if (options?.metadata) {
      formData.append("metadata", JSON.stringify(options.metadata))
    }

    const params = new URLSearchParams()
    if (options?.process !== undefined) {
      params.set("process", String(options.process))
    }
    if (options?.processInBackground !== undefined) {
      params.set("process_in_background", String(options.processInBackground))
    }

    const url = `${this.config.baseUrl}/api/v1/files/${params.toString() ? `?${params}` : ""}`
    const response = await fetch(url, {
      body: formData,
      headers: this.headers,
      method: "POST",
    })
    return this.handleResponse<FileUploadResponse>(response)
  }

  async list(includeContent = true): Promise<FileModelResponse[]> {
    const params = new URLSearchParams({content: String(includeContent)})
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/files/?${params}`,
      {
        headers: this.headers,
      },
    )
    return this.handleResponse<FileModelResponse[]>(response)
  }

  async search(
    pattern: string,
    includeContent = true,
  ): Promise<FileModelResponse[]> {
    const params = new URLSearchParams({
      content: String(includeContent),
      filename: pattern,
    })
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/files/search?${params}`,
      {headers: this.headers},
    )
    // Search returns 404 for no matches, treat as empty array
    if (response.status === 404) {
      return []
    }
    return this.handleResponse<FileModelResponse[]>(response)
  }

  async deleteAll(): Promise<MessageResponse> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/files/all`, {
      headers: this.headers,
      method: "DELETE",
    })
    return this.handleResponse<MessageResponse>(response)
  }

  async getById(id: string): Promise<FileModel> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/files/${id}`, {
      headers: this.headers,
    })
    return this.handleResponse<FileModel>(response)
  }

  async getProcessStatus(id: string): Promise<FileProcessStatus> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/files/${id}/process/status`,
      {headers: this.headers},
    )
    return this.handleResponse<FileProcessStatus>(response)
  }

  async waitForProcessing(
    id: string,
    options?: {intervalMs?: number; maxAttempts?: number},
  ): Promise<FileProcessStatus> {
    const maxAttempts = options?.maxAttempts ?? 120
    const intervalMs = options?.intervalMs ?? 1000

    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getProcessStatus(id)
      if (status.status === "completed" || status.status === "failed") {
        return status
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
    throw new Error(`File processing timed out after ${maxAttempts} attempts`)
  }

  async getDataContent(id: string): Promise<FileContentResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/files/${id}/data/content`,
      {headers: this.headers},
    )
    return this.handleResponse<FileContentResponse>(response)
  }

  async updateDataContent(
    id: string,
    content: string,
  ): Promise<FileContentResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/files/${id}/data/content/update`,
      {
        body: JSON.stringify({content}),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<FileContentResponse>(response)
  }

  async getContent(id: string, asAttachment = false): Promise<Response> {
    const params = new URLSearchParams({attachment: String(asAttachment)})
    return fetch(
      `${this.config.baseUrl}/api/v1/files/${id}/content?${params}`,
      {
        headers: this.headers,
      },
    )
  }

  async getContentAsText(id: string): Promise<string> {
    const response = await this.getContent(id)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to get file content")
    }
    return response.text()
  }

  async delete(id: string): Promise<MessageResponse> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/files/${id}`, {
      headers: this.headers,
      method: "DELETE",
    })
    return this.handleResponse<MessageResponse>(response)
  }
}

// ============================================================================
// Knowledge API
// ============================================================================

export class KnowledgeApi {
  private readonly config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
    }
  }

  private get jsonHeaders() {
    return {
      ...this.headers,
      "Content-Type": "application/json",
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()
    if (isErrorResponse(data)) {
      throw new Error(data.detail)
    }
    return data as T
  }

  async list(): Promise<KnowledgeUserResponse[]> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/knowledge/`, {
      headers: this.headers,
    })
    return this.handleResponse<KnowledgeUserResponse[]>(response)
  }

  async listWritable(): Promise<KnowledgeUserResponse[]> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/list`,
      {
        headers: this.headers,
      },
    )
    return this.handleResponse<KnowledgeUserResponse[]>(response)
  }

  async create(form: KnowledgeForm): Promise<KnowledgeResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/create`,
      {
        body: JSON.stringify(form),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeResponse>(response)
  }

  async reindex(): Promise<boolean> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/reindex`,
      {
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<boolean>(response)
  }

  async getById(id: string): Promise<KnowledgeFilesResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${id}`,
      {
        headers: this.headers,
      },
    )
    return this.handleResponse<KnowledgeFilesResponse>(response)
  }

  async update(
    id: string,
    form: KnowledgeForm,
  ): Promise<KnowledgeFilesResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${id}/update`,
      {
        body: JSON.stringify(form),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeFilesResponse>(response)
  }

  async addFile(
    knowledgeId: string,
    fileId: string,
  ): Promise<KnowledgeFilesResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${knowledgeId}/file/add`,
      {
        body: JSON.stringify({file_id: fileId}),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeFilesResponse>(response)
  }

  async updateFile(
    knowledgeId: string,
    fileId: string,
  ): Promise<KnowledgeFilesResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${knowledgeId}/file/update`,
      {
        body: JSON.stringify({file_id: fileId}),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeFilesResponse>(response)
  }

  async removeFile(
    knowledgeId: string,
    fileId: string,
    deleteFile = true,
  ): Promise<KnowledgeFilesResponse> {
    const params = new URLSearchParams({delete_file: String(deleteFile)})
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${knowledgeId}/file/remove?${params}`,
      {
        body: JSON.stringify({file_id: fileId}),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeFilesResponse>(response)
  }

  async delete(id: string): Promise<boolean> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${id}/delete`,
      {
        headers: this.headers,
        method: "DELETE",
      },
    )
    return this.handleResponse<boolean>(response)
  }

  async reset(id: string): Promise<KnowledgeResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${id}/reset`,
      {
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeResponse>(response)
  }

  async addFilesBatch(
    knowledgeId: string,
    fileIds: string[],
  ): Promise<KnowledgeFilesResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/v1/knowledge/${knowledgeId}/files/batch/add`,
      {
        body: JSON.stringify(fileIds.map((file_id) => ({file_id}))),
        headers: this.jsonHeaders,
        method: "POST",
      },
    )
    return this.handleResponse<KnowledgeFilesResponse>(response)
  }
}
