import type {ReactElement} from "react"

import {AArrowDown} from "lucide-react"

import {Button, ButtonGroup} from "@qualcomm-ui/react/button"

export default function ButtonGroupSharedPropsDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <ButtonGroup disabled size="sm">
        <Button startIcon={AArrowDown} variant="ghost">
          Button
        </Button>
        <Button startIcon={AArrowDown} variant="outline">
          Button
        </Button>
        <Button emphasis="primary" startIcon={AArrowDown} variant="fill">
          Button
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="outline">
        <Button startIcon={AArrowDown}>Button</Button>
        <Button startIcon={AArrowDown}>Button</Button>
        <Button emphasis="primary" startIcon={AArrowDown}>
          Button
        </Button>
      </ButtonGroup>
      {/* preview */}
    </div>
  )
}
