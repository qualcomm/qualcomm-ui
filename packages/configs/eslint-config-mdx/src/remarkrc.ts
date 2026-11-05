// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import remarkLintCodeFormat from "./remark-lint-code-format.js"
import remarkLintMdxJsxFormat from "./remark-lint-mdx-jsx-format.js"
import remarkPreserveAlertMarkers from "./remark-preserve-alert-markers.js"

const remarkConfig: any = {
  plugins: [
    "remark-frontmatter",
    "remark-lint-fenced-code-flag",
    "remark-lint-final-newline",
    "remark-lint-heading-increment",
    "remark-lint-list-item-content-indent",
    ["remark-lint-list-item-indent", "one"],
    ["remark-lint-maximum-heading-length", {size: 80}],
    "remark-lint-no-consecutive-blank-lines",
    "remark-lint-no-duplicate-headings-in-section",
    ["remark-lint-no-heading-punctuation", ",.:;"],
    ["remark-lint-unordered-list-marker-style", "-"],
    remarkLintCodeFormat,
    remarkLintMdxJsxFormat,
    remarkPreserveAlertMarkers,
  ],
  settings: {
    bullet: "-",
    rule: "-",
  },
}

export default remarkConfig
