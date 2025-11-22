import {type ReactNode, useEffect, useState} from "react"

import {getDemo} from "virtual:qui-demo-scope/auto"

import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {useGlobalConfigContext} from "@qualcomm-ui/react-internal/layout"
import {
  QdsDemoRunner,
  type QdsDemoRunnerProps,
} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

interface Props
  extends Omit<QdsDemoRunnerProps, "qdsBrand" | "setQdsBrand" | "demo"> {
  hideDemoBrandSwitcher?: boolean
}

export function QdsDemo({
  hideDemoBrandSwitcher: hideDemoBrandSwitcherProp,
  ...props
}: Props): ReactNode {
  const [theme] = useTheme()
  const [demo, setDemo] = useState<ReactDemoWithScope | null>(() =>
    getDemo(props.name),
  )
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()

  useEffect(() => {
    if (!import.meta.hot) {
      return
    }

    const handler = (data: {
      demo: ReactDemoWithScope | null
      demoName: string
    }) => {
      if (data.demoName === props.name) {
        const scope = getDemo(props.name)?.scope
        setDemo({...data.demo!, scope})
      }
    }

    import.meta.hot.on("react-demo-update", handler)
    return () => {
      import.meta.hot?.off("react-demo-update", handler)
    }
  }, [props.name])

  useEffect(() => {
    if (!import.meta.hot) {
      return
    }

    function handler() {
      console.debug("Demo scope changed, triggering full reload")
      window.location.reload()
    }

    import.meta.hot.on("scope-change", handler)
    return () => {
      import.meta.hot?.off("scope-change", handler)
    }
  }, [])

  return (
    <QdsDemoRunner
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      demo={demo}
      hideBrandSwitcher={hideDemoBrandSwitcher || hideDemoBrandSwitcherProp}
      qdsBrand={brand || "qualcomm"}
      setQdsBrand={setBrand}
      {...props}
    />
  )
}
