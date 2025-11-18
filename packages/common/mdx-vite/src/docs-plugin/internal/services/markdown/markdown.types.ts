// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  PageHeading,
  PageSectionContent,
  RichContentNode,
} from "@qualcomm-ui/mdx-common"

export interface IndexedSection {
  content: PageSectionContent[]
  heading: PageHeading | null
  richContent: RichContentNode[]
}

export interface IndexedPage {
  sections: IndexedSection[]
  toc: PageHeading[]
}
