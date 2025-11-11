import {type ReactNode, useEffect, useState} from "react"

import {useLocation} from "react-router"
import {getDemo} from "virtual:qui-demo-scope/auto"

import {
  QdsDemoRunner,
  type QdsDemoRunnerProps,
} from "@qualcomm-ui/react-mdx/code-demo"
import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {useGlobalConfigContext} from "../layout"

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
    import.meta.env.DEV ? null : getDemo(props.name),
  )
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()
  const pathname = useLocation().pathname
  const [devLoaded, setDevLoaded] = useState<boolean>(false)
  const updating = import.meta.env.DEV && !demo && !devLoaded

  useSafeLayoutEffect(() => {
    if (import.meta.hot) {
      void import("./lazy-demo-loader").then((mod) => {
        const lazyDemos = mod.lazyDemos
        const lazyModule = lazyDemos[pathname]
        if (lazyModule) {
          lazyModule().then((lazy) => {
            const demo = lazy.getDemo(props.name)
            if (demo) {
              setDemo(demo)
            }
            setDevLoaded(true)
          })
        } else {
          setDevLoaded(true)
        }

        function handler(data: ReactDemoWithScope) {
          if (props.name === data.demoName) {
            console.log("Name matches, loading from lazyDemos")
            const lazyModule: any = lazyDemos[pathname]
            if (lazyModule) {
              import.meta.hot?.invalidate()
            } else {
              console.log(
                "HMR update failed. No lazy module for pathname:",
                pathname,
              )
            }
          }
        }
        import.meta.hot?.on("qui-demo-update", handler)
        return () => {
          import.meta.hot?.off("qui-demo-update", handler)
        }
      })
    }
  }, [pathname, props.name])

  useEffect(() => {
    if (import.meta.hot) {
      // force reload when dependent modules change. This happens when a demo
      // imports an entity from a workspace-linked package.
      import.meta.hot.accept(() => {
        window.location.reload()
      })
    }
  }, [])

  return (
    <QdsDemoRunner
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      demo={demo}
      hideBrandSwitcher={hideDemoBrandSwitcher || hideDemoBrandSwitcherProp}
      qdsBrand={brand || "qualcomm"}
      setQdsBrand={setBrand}
      updating={updating}
      {...props}
    />
  )
}
