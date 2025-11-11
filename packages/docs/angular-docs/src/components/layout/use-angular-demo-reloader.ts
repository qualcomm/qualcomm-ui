/* eslint-disable no-restricted-globals */
import {useEffect, useRef, useState} from "react"

import type {AngularDemoInfo} from "@qualcomm-ui/mdx-docs-common"

import type {DemoUpdateContextValue} from "./demo-update-context"

export function useAngularDemoReloader(): DemoUpdateContextValue {
  const [demoUpdateContext, setDemoUpdateContext] =
    useState<DemoUpdateContextValue>({demoInfo: {}, updatingDemoIds: []})

  const reloadTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  useEffect(() => {
    if (!import.meta.hot) {
      return
    }

    function handler(data: {ids: string[]}) {
      console.debug(data)
      setDemoUpdateContext((prev) => ({
        ...prev,
        updatingDemoIds: data.ids,
      }))
    }

    import.meta.hot.on("demo-bundle-updating", handler)
    return () => {
      import.meta.hot?.off("demo-bundle-updating", handler)
    }
  }, [])

  useEffect(() => {
    if (!import.meta.hot) {
      return
    }

    function handler(data: {demoInfo: Record<string, AngularDemoInfo>}) {
      if (reloadTimeout) {
        clearTimeout(reloadTimeout.current)
      }

      reloadTimeout.current = setTimeout(() => {
        const oldScript = document.querySelector("script#ng-code-demo")
        if (oldScript?.parentNode) {
          oldScript.remove()

          const newScript = Object.assign(document.createElement("script"), {
            id: "ng-code-demo",
            onload: () => {
              setDemoUpdateContext({
                demoInfo: data.demoInfo,
                updatingDemoIds: [],
              })
            },
            src: `/main.js?t=${Date.now()}`,
            type: "module",
          })
          document.body.appendChild(newScript)
        }
      }, 200)
    }

    import.meta.hot.on("demo-bundle-updated", handler)
    return () => {
      import.meta.hot?.off("demo-bundle-updated", handler)
    }
  }, [])

  return demoUpdateContext
}
