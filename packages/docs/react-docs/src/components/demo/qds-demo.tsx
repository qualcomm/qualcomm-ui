import {type ReactNode, useRef, useState} from "react"

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

import {cachedDemos} from "./cached-demos"

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
      ? cachedDemos[props.name] || null
      : getDemo(props.name),
  )
  const {brand, setBrand} = useQdsThemeContext()
  const pathname = useLocation().pathname
  const [devLoaded, setDevLoaded] = useState<boolean>(false)
  const updating = import.meta.env.DEV && !demo && !devLoaded
  const demoElementRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState<number>(0)

  return (
    <QdsDemoRunner
      key={key}
      ref={demoElementRef}
      colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
      demo={demo}
      hideBrandSwitcher={hideDemoBrandSwitcherProp}
      qdsBrand={brand || "qualcomm"}
      setQdsBrand={setBrand}
      suppressHydrationWarning
      updating={updating}
      {...props}
    />
  )
}
