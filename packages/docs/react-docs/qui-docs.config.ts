import {readFileSync} from "node:fs"
import {resolve} from "node:path"

import type {
  KnowledgeExtraFile,
  NavConfig,
  QuiDocsConfig,
} from "@qualcomm-ui/mdx-vite"

const navConfig: NavConfig[] = [
  {sectionTitle: "Getting Started"},
  {
    hidden: true,
    id: "_index",
  },
  {
    id: "installation",
  },
  {
    id: "setup",
  },
  {
    id: "versioning",
  },
  {separator: true},
  {sectionTitle: "Integrations"},
  {
    children: [
      {id: "mcp"},
      {id: "claude-code"},
      {id: "codex"},
      {
        children: [
          {id: "qui-docs"},
          {id: "qui-react-development"},
          {id: "qui-angular-development"},
          {id: "ui-testing"},
        ],
        id: "plugins",
      },
    ],
    id: "ai-tools",
    title: "AI Tools",
  },
  {id: "eslint"},
  {id: "tailwind"},

  {separator: true},
  {sectionTitle: "Theming & Patterns"},
  {
    children: [{id: "overview"}],
    id: "theming",
  },
  {
    children: [
      {
        id: "overview",
      },
      {
        id: "introduction-to-javascript",
      },
      {
        children: [{id: "clean-code"}],
        id: "clean-code",
        ignoreRouteMetaOrder: true,
      },
    ],
    id: "patterns",
    title: "Patterns & Best Practices",
  },
  {separator: true},
  {
    sectionTitle: "Composition",
  },
  {
    id: "polymorphic-components",
  },
  {
    id: "render-props",
  },
  {separator: true},
  {
    children: [
      {
        id: "overview",
      },
    ],
    expanded: true,
    id: "components",
    title: "Components",
  },
  {separator: true},
  {
    children: [
      {
        id: "getting-started",
      },
      {
        id: "overview",
      },
      {
        id: "component-authoring",
      },
      {
        id: "base-component",
      },
      {
        id: "react-component",
      },
      {
        id: "react-documentation",
      },
      {
        id: "testing-guidelines",
      },
    ],
    id: "contribution-guidelines",
  },
  {
    id: "troubleshooting",
  },
  {
    hidden: true,
    hideBreadcrumbs: true,
    hidePageLinks: true,
    hideSideNav: true,
    id: "debug",
  },
]

const packageDirectory = process.cwd()

const extraFiles: KnowledgeExtraFile[] = [
  {
    contents: readFileSync(
      resolve(packageDirectory, "../../frameworks/react/CHANGELOG.md"),
      "utf-8",
    ),
    id: "react-changelog",
  },
  {
    contents: readFileSync(
      resolve(packageDirectory, "../../common/core/CHANGELOG.md"),
      "utf-8",
    ),
    id: "core-changelog",
  },
  {
    contents: readFileSync(
      resolve(
        packageDirectory,
        "../../frameworks/react-internal/files/component-list.md",
      ),
      "utf-8",
    ),
    id: "component-list",
    processAsMdx: true,
  },
  {
    contents: readFileSync(
      resolve(
        packageDirectory,
        "../../frameworks/react-internal/files/mcp-server-setup.md",
      ),
      "utf-8",
    ),
    id: "mcp-server-setup",
  },
]

export default {
  appDirectory: "src",
  disableLegacySearchIndex: true,
  knowledge: {
    baseUrl: "https://react.qui.qualcomm.com",
    exclude: [
      "**/installation+/**",
      "index.mdx",
      "**/components+/overview*",
      "**/components+/overview*",
    ],
    extraFiles,
    frontmatter: {exclude: ["url"], include: ["*"]},
    integrations: {
      openWebUi: [{id: "qui-ai"}, {id: "saga-ai"}, {id: "saga-ai-test"}],
    },
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
