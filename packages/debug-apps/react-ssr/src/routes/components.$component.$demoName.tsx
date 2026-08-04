/// <reference types="vite/client" />

import {type ComponentType, lazy, Suspense} from "react"

import {useParams} from "react-router"

// Use Vite's glob import to load all demos at build time
// Relative path from this file (packages/debug-apps/react-ssr/src/routes/)
// to packages/docs/react-docs/src/routes/components+/

const demoModules = import.meta.glob<Record<string, ComponentType>>(
  "../../../../docs/react-docs/src/routes/components+/**/demos/*-demo.tsx",
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
  const {component, demoName} = useParams()

  if (!component || !demoName) {
    return (
      <div className="page">
        <div className="section">
          <h1 className="section-title">Invalid Demo URL</h1>
          <p>Component and demo name are required.</p>
        </div>
      </div>
    )
  }

  const demoFileName = `${component}-${demoName}-demo`
  const componentName = kebabToPascal(demoFileName)
  const modulePath = `../../../../docs/react-docs/src/routes/components+/${component}+/demos/${demoFileName}.tsx`

  const loadDemoModule = demoModules[modulePath]

  if (!loadDemoModule) {
    return (
      <div className="page">
        <div className="section">
          <h1 className="section-title">
            Demo Not Found: {component}/{demoName}
          </h1>
          <p className="text-neutral-secondary mt-4 text-sm">
            Make sure the demo exists in react-docs at{" "}
            <code>
              components+/{component}+/demos/{component}-{demoName}-demo.tsx
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
        <div className="text-danger" role="alert">
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
        <h1 className="section-title">
          {kebabToTitle(component)} - {kebabToTitle(demoName)}
        </h1>
        <div className="demo-container">
          <Suspense fallback={<div>Loading demo...</div>}>
            <Demo />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
