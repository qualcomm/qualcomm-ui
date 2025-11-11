import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

export default {
  appDirectory: "src",
  navConfig: [
    {
      id: "_index",
    },
    {
      id: "installation",
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
          children: [{id: "core"}],
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
    {
      children: [
        {
          id: "react-table",
          title: "React Table",
        },
        {
          id: "react",
          title: "React",
        },
        {
          id: "base",
          title: "Base",
        },
      ],
      id: "changelogs",
      title: "Changelogs",
    },
  ],
  pageDirectory: "routes",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
