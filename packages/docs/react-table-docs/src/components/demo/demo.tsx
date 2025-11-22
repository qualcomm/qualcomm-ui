import type {ReactNode} from "react"

import {getDemo} from "virtual:qui-demo-scope/auto"

import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {useGlobalConfigContext} from "@qualcomm-ui/react-internal/layout"
import {
  ReactDemoRunner,
  type ReactDemoRunnerProps,
} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

interface Props
  extends Omit<ReactDemoRunnerProps, "qdsBrand" | "setQdsBrand" | "demo"> {}

export function Demo({
  component,
  hideBrandSwitcher: hideBrandSwitcherProp = false,
  ...props
}: Props): ReactNode {
  const [theme] = useTheme()
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()

  return (
    <ReactDemoRunner
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      component={component}
      demo={getDemo(props.name)}
      hideBrandSwitcher={hideDemoBrandSwitcher || hideBrandSwitcherProp}
      qdsBrand={brand || "qualcomm"}
      setQdsBrand={setBrand}
      suppressHydrationWarning
      {...props}
    />
  )
}
