import {type ReactNode, useEffect, useRef, useState} from "react"

import {useLocation} from "react-router"
import {getDemo} from "virtual:qui-demo-scope/auto"
import {getReactDemoConfig} from "virtual:qui-demo-scope/config"

import type {ReactDemoWithScope} from "@qualcomm-ui/mdx-common"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {
  QdsDemoRunner,
  type QdsDemoRunnerProps,
} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"

import {requestSavedScrollPosition, useGlobalConfigContext} from "../layout"

import {cachedDemos} from "./cached-demos"
import {useDemoContext} from "./demo-context"

interface Props
  extends Omit<QdsDemoRunnerProps, "qdsBrand" | "setQdsBrand" | "demo"> {
  hideDemoBrandSwitcher?: boolean
}

export function QdsDemo({
  hideDemoBrandSwitcher: hideDemoBrandSwitcherProp,
  ...props
}: Props): ReactNode {
  const [theme] = useTheme()
  const demoContext = useDemoContext()
  const [demo, setDemo] = useState<ReactDemoWithScope | null>(() =>
    import.meta.env.DEV && getReactDemoConfig().lazyLoadDevModules
      ? cachedDemos[props.name] || null
      : getDemo(props.name),
  )
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()
  const pathname = useLocation().pathname
  const [devLoaded, setDevLoaded] = useState<boolean>(false)
  const updating = import.meta.env.DEV && !demo && !devLoaded
  const demoElementRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState<number>(0)

  const onDemoRendered = (error: Error | undefined) => {
    requestAnimationFrame(() => {
      if (!error) {
        // retrieve the scroll position after all demos have been rendered.
        requestSavedScrollPosition()
      }
    })
  }

  useEffect(() => {
    if (import.meta.hot && getReactDemoConfig().lazyLoadDevModules) {
      void import("./lazy-demo-loader").then(async (mod) => {
        const lazyDemos = mod.lazyDemos
        const lazyModule = lazyDemos[pathname]
        void lazyModule()
          .then((res) => {
            const demo = res.getDemo(props.name)
            if (demo) {
              setDemo({...demo, ...demoContext[props.name]})
              cachedDemos[props.name] = {...demo, ...demoContext[props.name]}
              setKey((prevState) => prevState + 1)
            }
          })
          .finally(() => {
            setDevLoaded(true)
          })
      })
    }
  }, [demoContext, pathname, props.name])

  return (
    <QdsDemoRunner
      key={key}
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
