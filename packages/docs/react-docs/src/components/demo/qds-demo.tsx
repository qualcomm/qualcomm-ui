import {type ReactNode, useEffect, useRef, useState} from "react"

import {useLocation} from "react-router"
import {getDemo} from "virtual:qui-demo-scope/auto"
import {getReactDemoConfig} from "virtual:qui-demo-scope/config"

import {
  QdsDemoRunner,
  type QdsDemoRunnerProps,
} from "@qualcomm-ui/mdx-docs/code-demo"
import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-docs-common"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {requestSavedScrollPosition, useGlobalConfigContext} from "../layout"

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
    import.meta.env.DEV && getReactDemoConfig().lazyLoadDevModules
      ? null
      : getDemo(props.name),
  )
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()
  const pathname = useLocation().pathname
  const [devLoaded, setDevLoaded] = useState<boolean>(false)
  const updating = import.meta.env.DEV && !demo && !devLoaded
  const demoElementRef = useRef<HTMLDivElement>(null)

  const onDemoRendered = (error: Error | undefined) => {
    requestAnimationFrame(() => {
      if (!error) {
        // retrieve the scroll position after all demos have been rendered.
        requestSavedScrollPosition()
      }
    })
  }

  useSafeLayoutEffect(() => {
    if (import.meta.hot && getReactDemoConfig().lazyLoadDevModules) {
      void import("./lazy-demo-loader").then((mod) => {
        const lazyDemos = mod.lazyDemos
        const lazyModule = lazyDemos[pathname]
        if (lazyModule) {
          lazyModule().then((res) => {
            const demo = res.getDemo(props.name)
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
            const lazyModule: any = lazyDemos[pathname]
            if (lazyModule) {
              import.meta.hot?.invalidate()
            } else {
              console.warn(
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
    if (import.meta.hot && getReactDemoConfig().lazyLoadDevModules) {
      // force reload when dependent modules change. This happens when a demo
      // imports an entity from a workspace-linked package.
      import.meta.hot.accept(() => {
        // window.location.reload()
      })
    }
  }, [])

  return (
    <QdsDemoRunner
      ref={demoElementRef}
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      demo={demo}
      hideBrandSwitcher={hideDemoBrandSwitcher || hideDemoBrandSwitcherProp}
      onDemoRendered={import.meta.env.DEV ? onDemoRendered : undefined}
      qdsBrand={brand || "qualcomm"}
      setQdsBrand={setBrand}
      suppressHydrationWarning
      updating={updating}
      {...props}
    />
  )
}
