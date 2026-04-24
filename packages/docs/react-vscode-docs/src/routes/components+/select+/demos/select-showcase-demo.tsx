import type {ReactNode} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react-vscode/select"

const repos = selectCollection({
  items: [
    {label: "microsoft/vscode", value: "microsoft/vscode"},
    {label: "microsoft/vscode-codicons", value: "microsoft/vscode-codicons"},
    {label: "microsoft/vscode-docs", value: "microsoft/vscode-docs"},
  ],
})

export function SelectShowcaseDemo(): ReactNode {
  return (
    <Select collection={repos} placeholder="Select an option">
      {repos.items.map((item) => (
        <Select.Item key={item.value} item={item}>
          <Select.ItemText>{item.label}</Select.ItemText>
          <Select.ItemIndicator />
        </Select.Item>
      ))}
    </Select>
  )
}
