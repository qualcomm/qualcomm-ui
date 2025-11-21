# @qualcomm-ui/react-mdx

## 1.4.0 (2025/11/21)

### Features

- [shiki]: add error/warning notation styles
- [shiki]: add word highlight styles
- [mdx-docs-context]: expand ssrUserAgent type to include null
- [shiki]: add focus notation styles
- [shiki styles]: add line highlight, diff styles for shiki transformers

### Bug Fixes

- [sidebar, header]: use correct background in light mode
- [mdx-css]: add top margin to qui-tabs\_\_root in mdx
- [code-tabs]: remove margin from child shiki blocks
- [sidebar]: expand parent node when pathname changes to a hidden child node

### Miscellaneous Chores

- migrate change-case to @qualcomm-ui/utils/change-case
- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react-core]

## 1.3.0 (2025/11/19)

### Features

- [Demos]: add ReactDemo and ReactDemoRunner components

### Code Refactoring

- [Demos]: deprecate QdsReactDemo and QdsDemoRunner

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/react]

## 1.2.3 (2025/11/18)

### Build System

- do not minify identifiers

### Miscellaneous Chores

- [dependencies]: omit all devDependencies from build
- **deps:** update dependencies [@qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.2.2 (2025/11/18)

### Bug Fixes

- [typedoc-descriptions]: use qui link component

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.2.1 (2025/11/17)

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.2.0 (2025/11/17)

### Features

- [PageLinks]: show adjacent page path segment prefix when it differs from current page path segment prefix

### Bug Fixes

- [site-search]: open dialog when input is focused
- [site-search]: prevent match highlight when query length is < 2

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/core, @qualcomm-ui/react-core, @qualcomm-ui/react]

## 1.1.0 (2025/11/14)

### Features

- add text-input to site-search
- add github custom lucide-icon

### Bug Fixes

- sidebar branch node link behavior restored, but deprecated
- mdx table min-width extends to content
- fix search activation keyboard shortcut
- stricter dependency on workspace packages to ensure paired version bumps
- prevent breadcrumbs list key dupe

### Code Refactoring

- remove react-device-detect dependency

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react-core, @qualcomm-ui/react, @qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils]

## 1.0.4 (2025/11/14)

### Bug Fixes

- element preflight styles
- shiki inner html padding

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/react]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/core, @qualcomm-ui/mdx-common, @qualcomm-ui/utils, @qualcomm-ui/react, @qualcomm-ui/react-core]
