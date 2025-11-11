import {Fragment, useEffect, useId, useMemo, useRef, useState} from "react"

import {getAngularDemoInfo} from "virtual:angular-demo-registry"

import type {AngularDemoInfo} from "@qualcomm-ui/mdx-common"
import {useQdsThemeContext} from "@qualcomm-ui/react/qds-theme"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {
  QdsAngularDemoRunner,
  type QdsAngularDemoRunnerProps,
} from "@qualcomm-ui/react-mdx/code-demo"
import {Theme, useTheme} from "@qualcomm-ui/react-router-utils/client"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useDemoUpdateContext, useGlobalConfigContext} from "../layout"

declare global {
  interface Window {
    __bootstrapCodeDemo: (id: string, container: Element) => void
    __destroyCodeDemo: (id: string) => void
  }
}

export interface QdsDemoProps
  extends Pick<QdsAngularDemoRunnerProps, "expanded" | "wrapperProps"> {
  className?: string
  hideDemoBrandSwitcher?: boolean
  name: string
}

export function QdsDemo({name, ...props}: QdsDemoProps) {
  const [key, setKey] = useState(0)
  const [demoInfo, setDemoInfo] = useState<AngularDemoInfo | null>(
    getAngularDemoInfo(name),
  )
  const uniqueId = useId()
  const demoUpdateContext = useDemoUpdateContext()

  useEffect(() => {
    if (demoUpdateContext.demoInfo[name]) {
      requestAnimationFrame(() => {
        setDemoInfo(demoUpdateContext.demoInfo[name])
        setKey((prevKey) => prevKey + 1)
      })
    }
  }, [demoUpdateContext, name])

  useEffect(() => {
    return () => {
      window.__destroyCodeDemo(uniqueId)
    }
  }, [uniqueId])

  const isUpdating = useMemo(
    () => demoUpdateContext.updatingDemoIds?.includes(name),
    [demoUpdateContext.updatingDemoIds, name],
  )

  return (
    <QdsDemoImpl
      key={key}
      demoInfo={demoInfo}
      name={name}
      uniqueId={uniqueId}
      updating={isUpdating}
      {...props}
    />
  )
}

interface QdsDemoImplProps extends QdsDemoProps {
  demoInfo: AngularDemoInfo | null
  uniqueId: string
  updating?: boolean
}

function QdsDemoImpl({
  className,
  demoInfo,
  hideDemoBrandSwitcher: hideDemoBrandSwitcherProp,
  name,
  uniqueId,
  updating,
  wrapperProps,
  ...props
}: QdsDemoImplProps) {
  const {brand, setBrand} = useQdsThemeContext()
  const {hideDemoBrandSwitcher} = useGlobalConfigContext()
  const [theme] = useTheme()
  const demoRef = useRef<HTMLDivElement>(null)
  const codeDemoRef = useRef<HTMLElement>(null)
  const mountedRef = useRef<boolean>(false)
  const [demoContentRendered, setDemoContentRendered] = useState<boolean>(false)

  const prevName = useRef<string>("")

  useSafeLayoutEffect(() => {
    if (!document.querySelector("script#ng-code-demo")) {
      const script = Object.assign(document.createElement("script"), {
        id: "ng-code-demo",
        onload: () => {
          window.__bootstrapCodeDemo(uniqueId, document.body)
        },
        src: "/main.js",
        type: "module",
      })
      document.body.appendChild(script)
    }
  }, [])

  useSafeLayoutEffect(() => {
    if (
      prevName.current !== name &&
      typeof window.__bootstrapCodeDemo === "function"
    ) {
      prevName.current = name
      window.__bootstrapCodeDemo(uniqueId, demoRef.current!)
    }
  }, [name, uniqueId])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!mountedRef.current) {
      return
    }
    const demo = demoRef.current!
    const observer = new MutationObserver(() => {
      const demoElement = demo.querySelector(".qui-demo-runner__wrapper")
      if (!demoElement) {
        console.warn("Demo element not found for:", name)
        return
      }
      setTimeout(() => {
        if (!mountedRef.current) {
          return
        }
        if (import.meta.hot) {
          const height = demoInfo?.dimensions?.height
          if (
            !height ||
            height !== demoElement.getBoundingClientRect().height
          ) {
            import.meta.hot.send("custom:store-demo-dimensions", {
              demoId: name,
              dimensions: demoElement.getBoundingClientRect(),
            })
          }
        }
      }, 200)
    })
    if (codeDemoRef.current) {
      observer.observe(codeDemoRef.current, {
        attributeFilter: ["data-bootstrapped"],
        attributes: true,
      })
    }
    return () => {
      observer.disconnect()
    }
  }, [demoInfo?.dimensions?.height, name])

  useEffect(() => {
    let mounted = true
    const codeDemo = codeDemoRef.current!
    function handleEvent() {
      setTimeout(() => {
        if (mounted) {
          setDemoContentRendered(true)
        }
      }, 200)
      codeDemo.removeEventListener("content-rendered", handleEvent)
    }
    codeDemo.addEventListener("content-rendered", handleEvent)
    return () => {
      mounted = false
      codeDemo.removeEventListener("content-rendered", handleEvent)
    }
  }, [])

  return (
    <Fragment>
      <QdsAngularDemoRunner
        ref={demoRef}
        className={className}
        colorScheme={theme === Theme.LIGHT ? "light" : "dark"}
        data-demo-id={name}
        demoName={name}
        hideDemoBrandSwitcher={
          hideDemoBrandSwitcher || hideDemoBrandSwitcherProp
        }
        notFound={!demoInfo}
        qdsBrand={brand || "qualcomm"}
        setQdsBrand={setBrand}
        sourceCode={demoInfo?.sourceCode || []}
        updating={updating}
        wrapperProps={mergeProps(
          {
            style: {
              minHeight: demoInfo?.dimensions?.height ?? "auto",
            },
          },
          wrapperProps,
        )}
        {...props}
      >
        <>
          {demoInfo?.initialHtml &&
          !demoContentRendered &&
          !import.meta.env?.DEV ? (
            <div
              className="qds-demo-runner__ssr-placeholder"
              dangerouslySetInnerHTML={{__html: demoInfo.initialHtml}}
            ></div>
          ) : null}
          {/* @ts-expect-error jsx type not accounted for */}
          <angular-demo
            ref={codeDemoRef}
            componentName={demoInfo?.componentClass}
            data-demo-rendered={booleanDataAttr(demoContentRendered)}
            filePath={demoInfo?.filePath}
          />
        </>
      </QdsAngularDemoRunner>
    </Fragment>
  )
}
