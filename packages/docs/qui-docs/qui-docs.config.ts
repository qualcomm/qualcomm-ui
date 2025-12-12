import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"
import {createSimpleRoutingStrategy} from "@qualcomm-ui/react-router-utils/node"

export default {
  appDirectory: "src",
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
          id: "markdown",
        },
        {
          expanded: true,
          id: "page-setup",
          title: "Page Setup",
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
  ],
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  routingStrategy: createSimpleRoutingStrategy(),
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
