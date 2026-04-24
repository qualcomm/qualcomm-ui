import type {ReactNode} from "react"

import {Dropdown, DropdownContent, DropdownTrigger} from "@qualcomm-ui/react-vscode/dropdown"
import {DropdownInput} from "@qualcomm-ui/react-vscode/dropdown-input"
import {Option} from "@qualcomm-ui/react-vscode/option"

export function DropdownShowcaseDemo(): ReactNode {
  return (
    <Dropdown>
      <DropdownTrigger>
        {(bindings) => <DropdownInput defaultValue="Select an option" {...bindings} />}
      </DropdownTrigger>
      <DropdownContent>
        <Option value="microsoft/vscode">microsoft/vscode</Option>
        <Option value="microsoft/vscode-codicons">microsoft/vscode-codicons</Option>
        <Option value="microsoft/vscode-docs">microsoft/vscode-docs</Option>
      </DropdownContent>
    </Dropdown>
  )
}
