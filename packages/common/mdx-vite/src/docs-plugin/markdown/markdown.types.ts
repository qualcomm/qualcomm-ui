// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  PageHeading,
  PageSection,
  PageSectionContent,
  SectionEntry,
} from "@qualcomm-ui/mdx-common"

/**
 * Used by DocPropsIndexer for TypeDoc prop search sections.
 */
export interface IndexedSection {
  content: PageSectionContent[]
  heading: PageHeading | null
}

export interface IndexedPage {
  sections: SectionEntry[]
  toc: PageHeading[]
}

export interface CompiledMdxFileMetadata {
  changed: {
    /**
     * true if the file's frontmatter has changed since the last build.
     */
    frontmatter?: boolean | undefined

    /**
     * true if the file's toc has changed since the last build.
     */
    toc?: boolean | undefined
  }
  filePath: string
}

export interface CompiledMdxFile {
  /**
   * Metadata about the file.
   */
  metadata: CompiledMdxFileMetadata
  pageSections: PageSection[]
}
