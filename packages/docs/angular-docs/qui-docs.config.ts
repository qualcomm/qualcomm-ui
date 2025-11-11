import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

export default {
  appDirectory: "src",
  /*
   * Angular demos are built and copied to the public directory. The
   * angularDemoPlugin handles hot reloading when this happens, so we ignore the
   * dist directory to prevent the docsPlugin from reloading in response to the same
   * changes.
   */
  hotUpdateIgnore: /angular-demo-module|public/,
  navConfig: [
    {sectionTitle: "Getting Started"},
    {
      hidden: true,
      id: "_index",
    },
    {
      id: "installation",
    },
    {
      separator: true,
    },
    {sectionTitle: "Patterns and Pitfalls"},
    {
      id: "patterns",
      title: "Patterns",
    },
    {
      id: "pitfalls",
    },
    {
      separator: true,
    },
    {
      expanded: true,
      groupOrder: [
        "Buttons",
        "Form Controls",
        "Data Display",
        "Overlays",
        "Disclosure",
        "Feedback",
      ],
      id: "components",
      title: "Components",
    },
    {
      children: [
        {
          id: "angular",
        },
        {
          id: "tailwind-plugin",
        },
      ],
      id: "changelogs",
    },
  ],
  pageDirectory: "routes",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
