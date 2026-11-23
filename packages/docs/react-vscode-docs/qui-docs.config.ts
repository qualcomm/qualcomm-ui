import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

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
      title: "QUI React VS Code",
    },
    {sectionTitle: "Getting Started"},
    {id: "installation"},
    {
      children: [{id: "vite"}],
      id: "setup",
      title: "Setup",
    },
    {id: "migrate-vscode-plugin-to-css"},
    {separator: true},
    {
      children: [{id: "overview"}, {id: "colors"}, {id: "typography"}],
      id: "theming",
    },
    {separator: true},
    {
      children: [{id: "overview"}],
      expanded: true,
      id: "components",
    },
  ],
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
