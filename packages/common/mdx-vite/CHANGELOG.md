# @qualcomm-ui/mdx-vite

## 2.1.2 (2025/11/21)

### Bug Fixes

- [docs-plugin]: add css HMR

## 2.1.1 (2025/11/21)

### Bug Fixes

- [owui-knowledge]: remove unused jsx from parsed mdx

## 2.1.0 (2025/11/21)

### Features

- [docs-plugin]: enable common shiki transformers by default
- [react-demo-plugin]: enable common shiki transformers
- [docs-plugin]: add initial shiki-preview-blocks transformer
- [docs-plugin]: add shiki-transformer-code-attribute

### Bug Fixes

- restrict plugin scope to avoid duplicate init
- [docs-plugin]: trigger full reload on frontmatter/config changes
- force reload module when mdx changes to update toc
- [plugin-hmr]: only invalidate associated modules

### Miscellaneous Chores

- [remark-code-tabs]: update jsdoc comment with example
- migrate change-case to @qualcomm-ui/utils/change-case
- remove legacy object key in test config
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 2.0.0 (2025/11/19)

### BREAKING CHANGES

- [react-demo-plugin]: plugin scope reduced to syntax highlighting for demo files

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.1.0 (2025/11/17)

### Features

- [search]: add rich text metadata to search index

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common]

## 1.0.3 (2025/11/13)

### Bug Fixes

- add stub ts files for npm ts badge

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.2 (2025/11/12)

### Bug Fixes

- react readme url

### Miscellaneous Chores

- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]

## 1.0.1 (2025/11/12)

### Miscellaneous Chores

- add missing package licenses
- add per-package readmes
- **deps:** update dependencies [@qualcomm-ui/mdx-common, @qualcomm-ui/typedoc-common, @qualcomm-ui/utils]
