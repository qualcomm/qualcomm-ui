/// <reference types="vite/client" />

import {type ComponentType, lazy, Suspense} from "react"

import {useParams} from "react-router"

// Use Vite's glob import to load all demos at build time
// Relative path from this file to the docs-site demos
const demoModules = import.meta.glob<Record<string, ComponentType>>(
  "../../../../docs/react-table-docs/src/routes/features+/**/demos/*-demo.tsx",
)

function kebabToUppercased(str: string): string[] {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
}
function kebabToPascal(str: string): string {
  return kebabToUppercased(str).join("")
}
function kebabToTitle(str: string): string {
  return kebabToUppercased(str).join(" ")
}

export default function SingleDemoPage() {
  const {feature} = useParams()

  if (!feature) {
    return (
      <div className="page">
        <div className="section">
          <h1 className="section-title">Invalid Demo URL</h1>
          <p>Feature and demo name are required.</p>
        </div>
      </div>
    )
  }

  const demoFileName = `${feature}-demo`
  const componentName = kebabToPascal(demoFileName)
  const modulePath = `../../../../docs/react-table-docs/src/routes/features+/${feature}+/demos/${demoFileName}.tsx`

  const loadDemoModule = demoModules[modulePath]

  if (!loadDemoModule) {
    return (
      <div className="page">
        <div className="section">
          <h1 className="section-title">Demo Not Found: {feature}</h1>
          <p className="text-neutral-secondary mt-4 text-sm">
            Make sure the demo exists in react-table-docs at{" "}
            <code>
              features+/{feature}+/demos/{feature}-demo.tsx
            </code>
          </p>
        </div>
      </div>
    )
  }

  const Demo = lazy(async () => {
    const module = await loadDemoModule()
    const demoComponent = module[componentName]

    if (!demoComponent) {
      const MissingDemo: ComponentType = () => (
        <div role="alert" className="text-danger">
          Missing demo export: {componentName}
        </div>
      )

      return {default: MissingDemo}
    }

    return {default: demoComponent}
  })

  return (
    <div className="page">
      <div className="section">
        <h1 className="section-title">{kebabToTitle(feature)}</h1>
        <div className="demo-container">
          <Suspense fallback={<div>Loading demo...</div>}>
            <Demo />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
