// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  PageHeading,
  PageSectionContent,
} from "@qualcomm-ui/mdx-common"

export interface IndexedSection {
  content: PageSectionContent[]
  heading: PageHeading | null
}

export interface IndexedPage {
  sections: IndexedSection[]
  toc: PageHeading[]
}
