import type {ComponentPropsWithRef, ReactNode} from "react"

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
        const demoSlug = title.toLowerCase().replace(/\s+/g, "-")
        return (
          <div className="section" key={title}>
            <h2 className="section-title">
              <Link
                to={`/components/${componentName}/${demoSlug}`}
                className="hover:underline"
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
