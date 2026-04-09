import type {ReactNode} from "react"

import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {
  ComponentExplorerBase,
  type ComponentExplorerBaseProps,
} from "@qualcomm-ui/react-mdx/component-explorer"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

interface ComponentExplorerProps
  extends Omit<ComponentExplorerBaseProps, "children"> {
  component: () => ReactNode
}

export function ComponentExplorer({
  component: Component,
  ...props
}: ComponentExplorerProps): ReactNode {
  const [theme] = useTheme()
  const {brand} = useQdsThemeContext()
  const scheme = theme === Theme.LIGHT ? "light" : "dark"

  return (
    <ComponentExplorerBase
      data-brand={brand || "qualcomm"}
      data-theme={scheme}
      {...props}
    >
      <Component />
    </ComponentExplorerBase>
  )
}
