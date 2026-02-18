import {
  type ComponentPropsWithRef,
  type ReactElement,
  type RefObject,
  useId,
  useRef,
  useState,
} from "react"

import {
  qualcommDarkMermaidTheme,
  qualcommLightMermaidTheme,
} from "@qualcomm-ui/qds-core/styles"
import {useSafeLayoutEffect} from "@qualcomm-ui/react-core/effects"
import {ShikiHighlighter} from "@qualcomm-ui/react-mdx/shiki"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface MermaidDiagramProps extends ComponentPropsWithRef<"div"> {
  chart: string
}

export function MermaidDiagram({
  chart,
  ...props
}: MermaidDiagramProps): ReactElement {
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const mermaidDarkRef = useRef<HTMLDivElement | null>(null)
  const mermaidLightRef = useRef<HTMLDivElement | null>(null)

  useSafeLayoutEffect(() => {
    const currentDarkRef = mermaidDarkRef.current
    const currentLightRef = mermaidLightRef.current
    // Flag to prevent updates after the component is unmounted
    let isMounted = true
    const renderDiagram = async () => {
      const mermaid = await import("mermaid").then((res) => res.default)
      // Guard against empty or whitespace-only code
      if (!chart?.trim()) {
        // if empty code, clear element.
        if (mermaidDarkRef.current) {
          mermaidDarkRef.current.innerHTML = ""
        }
        if (mermaidLightRef.current) {
          mermaidLightRef.current.innerHTML = ""
        }
        return
      }
      setError(null)
      async function initialize(
        ref: RefObject<HTMLDivElement | null>,
        dark: boolean,
      ) {
        // Always initialize Mermaid inside the effect for consistency
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          theme: "default",
          themeVariables: dark
            ? qualcommDarkMermaidTheme
            : qualcommLightMermaidTheme,
        })
        const {svg} = await mermaid.render(
          `mermaid-${id}-${dark ? "dark" : "light"}`,
          chart,
        )

        // Only update the DOM if the component is still mounted
        if (isMounted && ref.current) {
          ref.current.innerHTML = svg
        }
      }
      try {
        await Promise.all([
          initialize(mermaidDarkRef, true),
          initialize(mermaidLightRef, false),
        ])
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message)
        }
      }
    }

    renderDiagram()
    return () => {
      isMounted = false
      if (currentDarkRef) {
        currentDarkRef.innerHTML = "" // Clear the SVG on unmount
      }
      if (currentLightRef) {
        currentLightRef.innerHTML = ""
      }
    }
  }, [chart, id])

  const mergedProps = mergeProps(
    {
      className: "qui-docs__mermaid-renderer",
    },
    props,
  )

  if (error) {
    return (
      <div className="qui-docs__mermaid-error-container">
        <ShikiHighlighter code={chart} lang="mermaid" />
      </div>
    )
  }

  return (
    <div key={chart} {...mergedProps}>
      <div
        ref={mermaidDarkRef}
        className="qui-docs__mermaid-diagram"
        data-dark
      />
      <div
        ref={mermaidLightRef}
        className="qui-docs__mermaid-diagram"
        data-light
      />
    </div>
  )
}
