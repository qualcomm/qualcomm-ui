import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {
  ComponentExplorerBase,
  type ComponentExplorerBaseProps,
} from "@qualcomm-ui/react-mdx/component-explorer"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {QdsDemo} from "./qds-demo"

interface ComponentExplorerProps
  extends Omit<ComponentExplorerBaseProps, "children"> {
  name: string
}

export function ComponentExplorer({name, ...props}: ComponentExplorerProps) {
  const {brand} = useQdsThemeContext()
  const [theme] = useTheme()
  const scheme = theme === Theme.LIGHT ? "light" : "dark"

  return (
    <ComponentExplorerBase {...props}>
      <QdsDemo
        data-brand={brand || "qualcomm"}
        data-theme={scheme}
        hideDemoControls
        name={name}
      />
    </ComponentExplorerBase>
  )
}
