import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

export default {
  appDirectory: "src",
  hotUpdateIgnore: /.*changelog.*/,
  navConfig: [
    {
      hidden: true,
      hideBreadcrumbs: true,
      hidePageLinks: true,
      hideSideNav: true,
      hideToc: true,
      id: "_index",
    },
    {
      id: "introduction",
    },
    {
      id: "installation",
    },
    {
      id: "help",
      title: "Help",
    },
    {
      children: [
        {
          expanded: true,
          id: "page-setup",
        },
        {
          id: "markdown",
        },
        {
          id: "typedoc",
        },
        {
          expanded: true,
          id: "swagger",
          title: "Swagger",
        },
      ],
      expanded: true,
      id: "guide",
      title: "Guide",
    },
    {
      expanded: true,
      id: "components",
      title: "Components",
    },
    {
      expanded: true,
      id: "api",
      title: "API",
    },
    {
      children: [
        {
          id: "mdx-docs",
        },
        {
          id: "mdx-vite",
        },
        {
          id: "react",
        },
        {
          id: "base",
        },
      ],
      id: "changelogs",
      title: "Changelogs",
    },
  ],
  pageDirectory: "routes",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
