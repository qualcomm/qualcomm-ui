export function ResponsiveVariants() {
  return (
    <div className="bg-surface-primary rounded-lg p-4">
      <p className="text-neutral-secondary mb-2 text-sm">
        Resize browser to see changes
      </p>
      <div className="hidden gap-4 sm:block md:flex lg:grid lg:grid-cols-3">
        <div className="bg-surface-secondary rounded p-3 text-center">
          <span className="text-neutral-primary">Item 1</span>
        </div>
        <div className="bg-surface-secondary rounded p-3 text-center">
          <span className="text-neutral-primary">Item 2</span>
        </div>
        <div className="bg-surface-secondary rounded p-3 text-center">
          <span className="text-neutral-primary">Item 3</span>
        </div>
      </div>
    </div>
  )
}
