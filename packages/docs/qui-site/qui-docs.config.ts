import {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

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
  ],
  pageDirectory: "routes",
} satisfies QuiDocsConfig
