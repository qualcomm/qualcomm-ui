import {
  customFilter,
  defineFilters,
  optionFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"

export const filters = defineFilters({
  attachments: customFilter<boolean>({
    getValueLabels: () => ["Has attachments"],
    isEmptyValue: (value) => !value,
    label: "Attachments",
  }),
  chipset: optionFilter({label: "Chipset"}),
  mode: optionFilter({
    label: "Build mode",
    options: [
      {label: "Debug", value: "debug"},
      {label: "Test", value: "test"},
      {label: "Release", value: "release"},
    ],
  }),
  owner: optionFilter({label: "Owner"}),
  status: optionFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
})

export const owners = [
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
  {label: "Chloe Nguyen", value: "u3"},
  {label: "Dev Patel", value: "u4"},
]

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
        id: "snapdragon_x_elite",
        nodes: [
          {id: "X1E-00-1DE", text: "12-core X1E-00-1DE"},
          {id: "X1E-84-100", text: "12-core X1E-84-100"},
          {id: "X1E-80-100", text: "12-core X1E-80-100"},
          {id: "X1E-78-100", text: "12-core X1E-78-100"},
        ],
        text: "Snapdragon X Elite",
      },
      {
        id: "snapdragon_x_plus",
        nodes: [
          {id: "X1P-66-100", text: "10-core X1P-66-100"},
          {id: "X1P-64-100", text: "10-core X1P-64-100"},
          {id: "X1P-46-100", text: "8-core X1P-46-100"},
          {id: "X1P-42-100", text: "8-core X1P-42-100"},
        ],
        text: "Snapdragon X Plus",
      },
    ],
    text: "",
  },
})
