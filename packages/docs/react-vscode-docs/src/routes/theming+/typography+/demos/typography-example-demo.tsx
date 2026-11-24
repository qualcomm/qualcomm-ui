import type {ReactElement} from "react"

export function TypographyExampleDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-3">
      <h2
        style={{
          color: "var(--color-text-normal)",
          font: "var(--font-static-heading-xxl)",
        }}
      >
        Project settings (CSS variables)
      </h2>
      <h2 className="font-heading-xxl text-normal">
        Project settings (Tailwind)
      </h2>
      <p
        style={{
          color: "var(--color-text-normal)",
          font: "var(--font-static-body-md-default)",
        }}
      >
        Build configuration (CSS variables)
      </p>
      <p className="font-body-md text-normal">Build configuration (Tailwind)</p>
    </div>
  )
}
