import {type ReactNode, useEffect, useRef} from "react"

export interface SectionProps {
  children?: ReactNode
  id?: string
  onIntersecting?: () => void
}

export function Section({children, id, onIntersecting}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!onIntersecting || typeof IntersectionObserver === "undefined") {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersecting()
          }
        })
      },
      {threshold: 0.1},
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [onIntersecting])

  return (
    <section ref={sectionRef} id={id} className="openapi-section">
      {children}
    </section>
  )
}
