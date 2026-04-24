import type {ReactElement, ReactNode} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {FieldApiProps} from "@qualcomm-ui/core/field"
import {FieldContextProvider, useField} from "@qualcomm-ui/react-core/field"
import {PolymorphicElement} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

/**
 * @public
 */
export type FieldProps = FieldApiProps & {
  children: ReactNode
  className?: string
}

export function Field({
  children,
  className,
  ...props
}: FieldProps): ReactElement {
  const fieldContext = useField(props)
  const mergedProps = mergeProps(fieldContext.getRootBindings(), {
    className: clsx("vs-field", className),
  })

  return (
    <FieldContextProvider value={fieldContext}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </FieldContextProvider>
  )
}
