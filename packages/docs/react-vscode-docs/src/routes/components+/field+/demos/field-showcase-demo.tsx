import type {ReactNode} from "react"

import {Field} from "@qualcomm-ui/react-vscode/field"
import {Input} from "@qualcomm-ui/react-vscode/text-input"

export function FieldShowcaseDemo(): ReactNode {
  return (
    <Field className="w-48">
      <Input />
    </Field>
  )
}
