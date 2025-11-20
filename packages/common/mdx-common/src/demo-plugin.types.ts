// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface SourceCodeData {
  fileName: string
  filePath?: string
  highlighted: {
    full: string
    preview?: string
  }
  raw: {
    full: string
    preview: string
    withoutImports: string
  }
}

export interface ReactDemoData {
  demoName: string
  errorMessage?: string
  fileName: string
  filePath: string
  imports: string[]
  pageId: string
  sourceCode: SourceCodeData[]
}

/**
 * @deprecated no longer used
 */
export interface ReactDemoWithScope extends ReactDemoData {
  scope: Record<string, any>
}

export interface PreviewBlock {
  content: string
  endLine: number
  startLine: number
}

export interface AngularDemoInfo {
  componentClass: string
  dimensions?: {
    height: number
  }
  filePath: string
  hasDefaultExport: boolean
  id: string
  imports: string[]
  initialHtml?: string
  isStandalone: boolean
  lastModified: number
  pageId: string
  selector: string
  sourceCode: SourceCodeData[]
}

export interface PreviewContext {
  content: string
  context: "template" | "typescript"
  endLine: number
  startLine: number
}

export interface ExtractedPreview {
  formattedPreview?: string
  previewBlocks?: PreviewContext[]
  sourceWithoutPreviews: string
}
