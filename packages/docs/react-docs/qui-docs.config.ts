import type {QuiDocsConfig} from "@qualcomm-ui/mdx-vite"

export default {
  appDirectory: "src",
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
      id: "setup",
    },
    {
      children: [{id: "tailwind"}],
      id: "integrations",
    },
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
          id: "all-components",
        },
      ],
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
  ],
  pageDirectory: "routes",
  typeDocProps: ".typedoc/doc-props.json",
} satisfies QuiDocsConfig
