import type {ReactNode} from "react"

import {
  DisclosureActions,
  DisclosureBody,
  DisclosureDescription,
  DisclosureHeader,
  DisclosureLabel,
  DisclosureRoot,
} from "@qualcomm-ui/react-vscode/disclosure"
import {Icon} from "@qualcomm-ui/react-vscode/icon"

export function DisclosureShowcaseDemo(): ReactNode {
  return (
    <DisclosureRoot className="w-full max-w-[300px]">
      <DisclosureHeader>
        <DisclosureLabel>
          Label
          <DisclosureDescription>Description</DisclosureDescription>
        </DisclosureLabel>

        <DisclosureActions>
          <Icon icon="new-file" render={<button />} />
        </DisclosureActions>
      </DisclosureHeader>
      <DisclosureBody>
        Suspendisse potenti. Maecenas eu egestas metus. Nulla eget placerat mi,
        et efficitur augue.
      </DisclosureBody>
    </DisclosureRoot>
  )
}
