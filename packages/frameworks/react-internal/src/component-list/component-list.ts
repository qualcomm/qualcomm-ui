// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

interface UiComponent {
  description: string
  fileName?: string
  name: string
  planned?: boolean
  url: string
}

export const componentList: UiComponent[] = [
  {
    description:
      "Expand and collapse content sections to organize information efficiently.",
    fileName: "accordion.svg",
    name: "Accordion",
    url: "/components/accordion",
  },
  {
    description:
      "An alert banner displays important system-wide messages or notifications.",
    fileName: "alert-banner.svg",
    name: "Alert Banner",
    url: "/components/alert-banner",
  },
  {
    description:
      "An avatar represents a user or entity with an image or initials.",
    fileName: "avatar.svg",
    name: "Avatar",
    url: "/components/avatar",
  },
  {
    description:
      "Color-coded indicators that communicate status, state, or priority at a glance.",
    fileName: "badge.svg",
    name: "Badge",
    url: "/components/badges/icon-badge",
  },
  {
    description:
      "A breadcrumb shows the user's current location within a site hierarchy.",
    fileName: "breadcrumbs.svg",
    name: "Breadcrumbs",
    url: "/components/breadcrumbs",
  },
  {
    description:
      "A button group combines related actions into a unified control set.",
    fileName: "button-group.svg",
    name: "Button Group",
    url: "/components/button-group",
  },
  {
    description: "A button triggers an action or event when clicked.",
    fileName: "button.svg",
    name: "Button",
    url: "/components/button",
  },
  {
    description:
      "Cards present information in a compact and visually appealing way.",
    name: "Card",
    url: "/components/card",
  },
  {
    description:
      "A checkbox allows users to select one or more options from a set.",
    fileName: "checkbox.svg",
    name: "Checkbox",
    url: "/components/checkbox",
  },
  {
    description:
      "Groups related checkboxes with a shared label, hint text, and validation state.",
    name: "Checkbox Group",
    url: "/components/checkbox-group",
  },
  {
    description: "Toggles the visibility of content sections on demand.",
    name: "Collapsible",
    url: "/components/collapsible",
  },
  {
    description:
      "Combines a text input with a dropdown list for searchable selection.",
    name: "Combobox",
    url: "/components/combobox",
  },
  {
    description: "Displays device information in a structured card format.",
    name: "Device Card",
    planned: true,
    url: "/components/device-card",
  },
  {
    description:
      "A dialog presents focused content or actions in an overlay window.",
    fileName: "dialog.svg",
    name: "Dialog",
    url: "/components/dialog",
  },
  {
    description: "A divider visually separates content sections or groups.",
    fileName: "divider.svg",
    name: "Divider",
    url: "/components/divider",
  },
  {
    description:
      "Creates an overlay panel for forms, details, or supplementary information.",
    name: "Drawer",
    url: "/components/drawer",
  },
  {
    description:
      "Provides consistent site-wide navigation and information at the page bottom.",
    name: "Footer",
    planned: true,
    url: "/components/footer",
  },
  {
    description:
      "Provides a consistent control surface with logo, navigation, and actions.",
    name: "Header Bar",
    url: "/components/header-bar",
  },
  {
    description:
      "Displays visual symbols that represent functions or content types.",
    name: "Icon",
    url: "/components/icon",
  },
  {
    description:
      "Performs an action when clicked using an icon instead of text.",
    name: "Icon Button",
    url: "/components/icon-button",
  },
  {
    description:
      "Provides a compact icon-only action trigger for tight spaces.",
    name: "Inline Icon Button",
    url: "/components/inline-icon-button",
  },
  {
    description:
      "An inline notification provides contextual feedback within content areas.",
    fileName: "inline-notification.svg",
    name: "Inline Notification",
    url: "/components/inline-notification",
  },
  {
    description:
      "A link navigates users to another page or section when clicked.",
    fileName: "link.svg",
    name: "Link",
    url: "/components/link",
  },
  {
    description:
      "A menu presents a list of actions or options for users to choose from.",
    fileName: "menu.svg",
    name: "Menu",
    url: "/components/menu",
  },
  {
    description:
      "A toast notification delivers temporary messages that appear and disappear automatically.",
    fileName: "notification.svg",
    name: "Notification",
    url: "/components/toast",
  },
  {
    description: "A number input restricts entry to numeric values only.",
    fileName: "number-input.svg",
    name: "Number Input",
    url: "/components/number-input",
  },
  {
    description: "Pagination breaks large datasets into navigable pages.",
    fileName: "pagination.svg",
    name: "Pagination",
    url: "/components/pagination",
  },
  {
    description: "A password input lets users securely enter hidden text.",
    fileName: "password-input.svg",
    name: "Password Input",
    url: "/components/password-input",
  },
  {
    description:
      "A popover displays contextual content in a floating container.",
    fileName: "popover.svg",
    name: "Popover",
    url: "/components/popover",
  },
  {
    description:
      "A progress bar indicates task completion with a horizontal fill.",
    fileName: "progress-bar.svg",
    name: "Progress Bar",
    url: "/components/progress",
  },
  {
    description:
      "A progress ring shows completion status in a circular format.",
    fileName: "progress-circle.svg",
    name: "Progress Ring",
    url: "/components/progress-ring",
  },
  {
    description:
      "A radio group lets users select one option from multiple choices.",
    fileName: "radio.svg",
    name: "Radio",
    url: "/components/radio",
  },
  {
    description:
      "A search input enables users to find content by entering queries.",
    fileName: "search-input.svg",
    name: "Search Input",
    planned: true,
    url: "/components/search-input",
  },
  {
    description:
      "Presents selectable segments for single or multi-select interactions.",
    name: "Segmented Control",
    url: "/components/segmented-control",
  },
  {
    description: "A select dropdown lets users choose one option from a list.",
    fileName: "select.svg",
    name: "Select",
    url: "/components/select",
  },
  {
    description:
      "Provides persistent navigation through major application sections.",
    name: "Side Nav",
    url: "/components/side-nav",
  },
  {
    description: "A slider lets users select values by dragging along a track.",
    fileName: "slider.svg",
    name: "Slider",
    url: "/components/slider",
  },
  {
    description:
      "A stepper visualizes a group of connected actions or the order of a workflow.",
    name: "Stepper",
    url: "/components/stepper",
  },
  {
    description: "A switch toggles between two states, like on and off.",
    fileName: "switch.svg",
    name: "Switch",
    url: "/components/switch",
  },
  {
    description:
      "Groups related switches with a shared label, hint text, and validation state.",
    name: "Switch Group",
    url: "/components/switch-group",
  },
  {
    description:
      "Displays structured data with sorting, filtering, and selection features.",
    name: "Table",
    url: "/components/table",
  },
  {
    description:
      "A tab organizes content into separate panels that users can switch between.",
    fileName: "tabs.svg",
    name: "Tabs",
    url: "/components/tabs",
  },
  {
    description: "A tag labels or categorizes content with removable keywords.",
    fileName: "tag.svg",
    name: "Tag",
    url: "/components/tag",
  },
  {
    description:
      "A text area provides space for users to enter multiple lines of text.",
    fileName: "text-area.svg",
    name: "Text Area",
    url: "/components/text-area",
  },
  {
    description: "A text input allows users to enter a single line of text.",
    fileName: "text-input.svg",
    name: "Text Input",
    url: "/components/text-input",
  },
  {
    description:
      "A tooltip shows additional information when users hover over an element.",
    fileName: "tooltip.svg",
    name: "Tooltip",
    url: "/components/tooltip",
  },
  {
    description:
      "Guides users through product features with a sequence of contextual steps.",
    name: "Tour",
    url: "/components/tour",
  },
  {
    description:
      "A tree displays hierarchical data in expandable nested levels.",
    fileName: "tree.svg",
    name: "Tree",
    url: "/components/tree",
  },
]
