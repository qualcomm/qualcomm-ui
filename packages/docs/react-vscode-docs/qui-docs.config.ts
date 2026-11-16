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
      children: [{id: "webview"}, {id: "browser-preview"}],
      id: "setup",
      title: "Setup",
    },
    {separator: true},
    {sectionTitle: "Theming & Patterns"},
    {children: [{id: "overview"}], id: "theming"},
    {separator: true},
    {
      children: [{id: "overview"}, {id: "typography"}],
      expanded: true,
      id: "components",
    },
  ],
  pageDirectory: "routes",
  pageTimestampMetadata: "user-and-timestamp",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
