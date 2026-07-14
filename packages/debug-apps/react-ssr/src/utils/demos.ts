import {createElement, type ReactNode} from "react"

import {pascalCase, sentenceCase} from "@qualcomm-ui/utils/change-case"

export type DemoComponent = () => ReactNode

export interface Demo {
  component: DemoComponent
  title: string
}

export function getDemos(
  componentName: string,
  demoModules: Record<string, Record<string, DemoComponent>>,
): Demo[] {
  return Object.entries(demoModules)
    .map(([modulePath, module]) => {
      const demoFileName = modulePath.match(/\/([^/]+)\.tsx$/)?.[1]

      if (!demoFileName) {
        return undefined
      }

      const demoSlug = demoFileName.replace(/-demo$/, "")
      const demoName = demoSlug.startsWith(`${componentName}-`)
        ? demoSlug.slice(componentName.length + 1)
        : demoSlug
      const exportName = pascalCase(demoFileName)
      const component = module[exportName]

      if (!component) {
        const MissingDemo: DemoComponent = () =>
          createElement(
            "div",
            {className: "text-danger", role: "alert"},
            `Missing demo export: ${exportName}`,
          )

        return {component: MissingDemo, title: sentenceCase(demoName)}
      }

      return {component, title: sentenceCase(demoName)}
    })
    .filter((demo): demo is Demo => Boolean(demo))
    .sort((a, b) => a.title.localeCompare(b.title))
}
