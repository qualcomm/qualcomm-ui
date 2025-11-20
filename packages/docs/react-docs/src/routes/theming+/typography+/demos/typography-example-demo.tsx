export function TypographyExampleDemo() {
  return (
    <div className="flex flex-col gap-4">
      {/* preview */}
      <div className="font-body-md text-neutral-primary">
        Body, primary color
      </div>

      {/* Or via CSS variables */}
      <div
        style={{
          color: `var(--color-text-neutral-primary)`,
          font: `var(--font-static-body-md-default)`,
        }}
      >
        Body, primary color (css variables)
      </div>
      {/* preview */}
    </div>
  )
}
