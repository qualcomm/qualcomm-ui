import type {NavConfig, QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

const navConfig: NavConfig[] = [
  {
    id: "_index",
  },
  {
    id: "installation",
  },
  {
    id: "troubleshooting",
  },
  {
    children: [
      {
        id: "overview",
      },
      {
        id: "column-definitions",
      },
      {
        id: "data",
      },
      {
        id: "table-state",
      },
      {
        id: "row-models",
      },
      {
        id: "rows",
      },
      {
        id: "cells",
      },
      {
        id: "header-groups",
      },
      {
        id: "headers",
      },
      {
        id: "columns",
      },
    ],
    expanded: true,
    id: "guides",
    title: "Guides",
  },
  {
    expanded: false,
    id: "feature-guides",
    title: "Feature Guides",
  },
  {
    expanded: true,
    id: "features",
    title: "Feature Examples",
  },
  {
    children: [
      {
        children: [{id: "overview"}, {id: "core"}],
        id: "features",
      },
    ],
    expanded: true,
    id: "api",
    title: "API",
  },
  {
    expanded: true,
    id: "components",
    title: "Components",
  },
]

export default {
  appDirectory: "src",
  knowledge: {
    environments: [
      {
        id: "qui-ai",
        outputPath: "./knowledge/qui-ai",
      },
      {
        id: "saga-ai",
        outputPath: "./knowledge/saga-ai",
      },
      {
        id: "saga-ai-test",
        outputPath: "./knowledge/saga-ai-test",
      },
    ],
    global: {
      baseUrl: "https://react-table-next.qui.qualcomm.com",
      exclude: ["installation.mdx", "index/_index.mdx"],
      exports: {enabled: true, exclude: []},
      pageIdPrefix: "table",
    },
    integrations: {
      openWebUi: [{id: "qui-ai"}, {id: "saga-ai"}, {id: "saga-ai-test"}],
    },
  },
  navConfig,
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
