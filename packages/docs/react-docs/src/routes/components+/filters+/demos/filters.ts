import {
  checkboxFilter,
  checkboxTreeFilter,
  comboboxFilter,
  dateFilter,
  defineFilters,
  radioFilter,
  rangeFilter,
  selectFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

export const filters = defineFilters({
  buildPath: textFilter({label: "Build path"}),
  chipset: checkboxTreeFilter({label: "Chipset"}),
  duration: rangeFilter({
    formatValue: (value) => `${value} min`,
    label: "Duration",
    max: 120,
    min: 0,
  }),
  mode: radioFilter({
    label: "Build mode",
    options: [
      {label: "Any", value: ""},
      {label: "Debug", value: "debug"},
      {label: "Release", value: "release"},
    ],
  }),
  owner: comboboxFilter({
    label: "Owner",
    options: [
      {label: "Anna Robinson", value: "u1"},
      {label: "Ben Ortiz", value: "u2"},
      {label: "Chloe Nguyen", value: "u3"},
      {label: "Dev Patel", value: "u4"},
      {label: "Elena Rossi", value: "u5"},
      {label: "Farah Haddad", value: "u6"},
    ],
  }),
  standard: selectFilter({
    label: "Standard",
    options: [
      {label: "Wi-Fi 6", value: "wifi6"},
      {label: "Wi-Fi 6E", value: "wifi6e"},
      {label: "Wi-Fi 7", value: "wifi7"},
    ],
  }),
  status: checkboxFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
  submitted: dateFilter({
    label: "Submitted",
    presets: [
      {label: "Last 7 days", value: "last7Days"},
      {label: "This month", value: "thisMonth"},
      {
        label: "Since release",
        range: () => ["2026-09-01", null],
        value: "sinceRelease",
      },
    ],
  }),
})

interface ChipsetNode {
  id: string
  nodes?: ChipsetNode[]
  text: string
}

export const chipsets = createTreeCollection<ChipsetNode>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "snapdragon-x",
        nodes: [
          {id: "x1e-84-100", text: "X1E-84-100"},
          {id: "x1e-80-100", text: "X1E-80-100"},
          {id: "x1p-64-100", text: "X1P-64-100"},
        ],
        text: "Snapdragon X",
      },
      {
        id: "snapdragon-8",
        nodes: [
          {id: "sm8750", text: "SM8750"},
          {id: "sm8650", text: "SM8650"},
        ],
        text: "Snapdragon 8",
      },
    ],
    text: "",
  },
})
