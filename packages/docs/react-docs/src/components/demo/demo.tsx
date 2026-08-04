import {type ReactNode, useEffect, useState} from "react"

import {getDemo} from "virtual:qui-demo-scope/auto"

import type {ReactDemoData} from "@qualcomm-ui/mdx-common"
import {useGlobalConfigContext} from "@qualcomm-ui/react-internal/layout"
import {
  ReactDemoRunner,
  type ReactDemoRunnerProps,
} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"

interface Props extends Omit<
  ReactDemoRunnerProps,
  "qdsBrand" | "setQdsBrand" | "demo"
> {}

export function Demo({
  component,
  hideBrandSwitcher: hideBrandSwitcherProp = false,
  ...props
}: Props): ReactNode {
  const [theme] = useTheme()
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()
  const [demo, setDemo] = useState<ReactDemoData>(getDemo(props.name))

  useEffect(() => {
    if (!import.meta.hot) {
      return
    }
    const handler = (data: ReactDemoData) => {
      if (data.demoName === props.name) {
        setDemo(data)
      }
    }
    import.meta.hot.on("qui-demo:update", handler)
    return () => {
      import.meta.hot!.off("qui-demo:update", handler)
    }
  }, [props.name])

  return (
    <ReactDemoRunner
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      component={component}
      demo={demo}
      hideBrandSwitcher={hideDemoBrandSwitcher || hideBrandSwitcherProp}
      qdsBrand={brand || "qualcomm"}
      setQdsBrand={setBrand}
      suppressHydrationWarning
      {...props}
    />
  )
}
