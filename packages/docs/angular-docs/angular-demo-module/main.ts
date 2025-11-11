/* eslint-disable no-restricted-globals */

import type {ApplicationRef} from "@angular/core"
import {bootstrapApplication} from "@angular/platform-browser"

import {AngularDemoComponent} from "./angular-demo.component"
import {angularDemoConfig} from "./angular-demo.config"

declare global {
  interface Window {
    __bootstrapCodeDemo: (id: string, container: HTMLElement) => void
    __destroyCodeDemo: (id: string) => void
  }
}

const originalLog = console.log
console.log = (...args: unknown[]) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Angular is running in development mode")
  ) {
    // suppress Angular log message in dev mode, else this emits for every demo on
    // the page.
    return
  }
  originalLog(...args)
}

const appRefs = new Map<string, ApplicationRef | null>()

window.__bootstrapCodeDemo = (id: string, container: HTMLElement) => {
  const codeDemoEls = container.querySelectorAll(
    `angular-demo:not([data-bootstrapped])`,
  )

  for (const codeDemoEl of codeDemoEls) {
    bootstrap(id, codeDemoEl)
  }
}

function bootstrap(id: string, element: Element) {
  const componentNameAttr = element.getAttribute("componentName") ?? ""

  bootstrapApplication(AngularDemoComponent, angularDemoConfig)
    .then((appRef) => {
      appRefs.set(id, appRef)

      const angularContainer = document.createElement("div")
      angularContainer.className = "angular-demo-container"
      angularContainer.style.display = "contents"
      element.appendChild(angularContainer)

      const cmpRef = appRef.bootstrap(AngularDemoComponent, angularContainer)
      const componentFilePathAttr = element.getAttribute("filePath") ?? ""
      cmpRef.instance.componentName.set(componentNameAttr)
      cmpRef.instance.filePath.set(componentFilePathAttr)
    })
    .catch((error) => {
      console.error("Error bootstrapping code demo component:", error)
    })
    .finally(() => {
      element.setAttribute("data-bootstrapped", "")
    })
}

window.__destroyCodeDemo = (id: string) => {
  if (appRefs.get(id)) {
    appRefs.get(id)?.destroy()
    appRefs.set(id, null)
  }
}
