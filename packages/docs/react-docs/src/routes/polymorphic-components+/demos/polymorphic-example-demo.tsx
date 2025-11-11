import type {ReactElement, ReactNode} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

interface AlertButtonProps extends ElementRenderProp<"button"> {}

function AlertButton(props: AlertButtonProps): ReactElement {
  const mergedProps = mergeProps(
    {
      onClick: () => {
        window.alert("Hello")
      },
    },
    props,
  )
  return <PolymorphicElement as="button" {...mergedProps} />
}

export default function PolymorphicExampleDemo(): ReactNode {
  return (
    <div className="flex flex-col gap-4">
      <AlertButton className="border p-1">
        This is just a simple button
      </AlertButton>

      <AlertButton
        onClick={() => {
          console.debug("Hello from our QUI Button")
        }}
        render={<Button emphasis="primary" size="sm" />}
      >
        This renders our QUI Button
      </AlertButton>
    </div>
  )
}
