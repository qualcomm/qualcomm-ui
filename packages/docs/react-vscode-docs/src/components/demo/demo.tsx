import {type ReactNode, useEffect, useState} from "react"

import {getDemo} from "virtual:qui-demo-scope/auto"

import type {ReactDemoData} from "@qualcomm-ui/mdx-common"
import {ReactDemo, type ReactDemoProps} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {VscodeThemeMenu} from "./vscode-theme-menu"

interface Props extends Omit<ReactDemoProps, "demo"> {}

export function Demo({component, ...props}: Props): ReactNode {
  const [theme] = useTheme()
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
    <ReactDemo
      actions={<VscodeThemeMenu />}
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      component={component}
      demo={demo}
      suppressHydrationWarning
      {...props}
    />
  )
}
