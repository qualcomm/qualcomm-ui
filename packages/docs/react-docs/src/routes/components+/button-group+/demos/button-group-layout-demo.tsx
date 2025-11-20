import type {ReactElement} from "react"

import {AArrowDown} from "lucide-react"

import type {QdsButtonGroupLayout} from "@qualcomm-ui/qds-core/button"
import {Button, ButtonGroup} from "@qualcomm-ui/react/button"

export function ButtonGroupLayoutDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      {(["hug", "start", "end", "fill"] satisfies QdsButtonGroupLayout[]).map(
        (layout) => (
          <ButtonGroup
            key={layout}
            className="border-brand-primary border-1 border-dashed p-1.5"
            layout={layout}
          >
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
        ),
      )}
      {/* preview */}
    </div>
  )
}
