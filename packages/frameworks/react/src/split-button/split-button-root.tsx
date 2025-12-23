import {type ReactElement, useMemo} from "react"

import {
  createQdsSplitButtonApi,
  type QdsSplitButtonApiProps,
} from "@qualcomm-ui/qds-core/split-button"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsSplitButtonContextProvider} from "./qds-split-button-context"

export interface SplitButtonRootProps
  extends ElementRenderProp<"div">,
    QdsSplitButtonApiProps {}

export function SplitButtonRoot({
  children,
  density,
  disabled,
  emphasis,
  size,
  variant,
  ...props
}: SplitButtonRootProps): ReactElement {
  const splitButtonApi = useMemo(
    () =>
      createQdsSplitButtonApi(
        {
          density,
          disabled,
          emphasis,
          size,
          variant,
        },
        normalizeProps,
      ),
    [density, disabled, emphasis, size, variant],
  )

  const mergedProps = mergeProps(splitButtonApi.getRootBindings(), props)

  return (
    <QdsSplitButtonContextProvider value={splitButtonApi}>
      <PolymorphicElement as="div" {...mergedProps}>
        {children}
      </PolymorphicElement>
    </QdsSplitButtonContextProvider>
  )
}
