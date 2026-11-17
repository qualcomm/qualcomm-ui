import {
  checkboxFilter,
  comboboxFilter,
  customFilter,
  defineFilters,
  rangeFilter,
  textFilter,
} from "@qualcomm-ui/core/filters"

export const filters = defineFilters({
  attachments: customFilter<boolean>({
    getValueLabels: () => ["Has attachments"],
    isEmptyValue: (value) => !value,
    label: "Attachments",
  }),
  buildPath: textFilter({label: "Build path"}),
  duration: rangeFilter({
    formatValue: (value) => `${value} min`,
    label: "Duration",
    max: 120,
    min: 0,
  }),
  owner: comboboxFilter({label: "Owner"}),
  status: checkboxFilter({
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
