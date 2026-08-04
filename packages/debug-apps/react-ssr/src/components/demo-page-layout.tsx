import type {ComponentPropsWithRef, ReactNode} from "react"

import {kebabCase} from "lodash-es"
import {Link} from "react-router"

import {mergeProps} from "@qualcomm-ui/utils/merge-props"

interface Demo {
  component: () => ReactNode
  title: string
}

interface DemoPageLayoutProps extends ComponentPropsWithRef<"div"> {
  componentName: string
  demos: Demo[]
}

export function DemoPageLayout({
  componentName,
  demos,
  ...props
}: DemoPageLayoutProps) {
  const mergedProps = mergeProps({className: "page"}, props)
  return (
    <div {...mergedProps}>
      {demos.map(({component: Demo, title}) => {
        const demoSlug = kebabCase(title)
        return (
          <div key={title} className="section">
            <h2 className="section-title">
              <Link
                className="hover:underline"
                to={`/components/${componentName}/${demoSlug}`}
              >
                {title}
              </Link>
            </h2>
            <div className="demo-container">
              <Demo />
            </div>
          </div>
        )
      })}
    </div>
  )
}
