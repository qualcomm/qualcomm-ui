export function MixedClasses() {
  return (
    <div className="bg-surface-primary rounded-lg p-4">
      <p className="text-neutral-secondary mb-4 text-sm">
        Mix of inlineable and variant classes
      </p>

      <div className="flex flex-col gap-3">
        <div className="bg-surface-secondary hover:bg-surface-tertiary flex items-center gap-2 rounded p-3 sm:flex-row-reverse">
          <div className="bg-brand-primary h-8 w-8 rounded-full" />
          <span className="text-neutral-primary font-medium">
            Inlined: flex, items-center, gap-2, p-3, rounded
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <div className="bg-surface-secondary rounded p-2 text-center transition-transform hover:scale-105">
            A
          </div>
          <div className="bg-surface-secondary rounded p-2 text-center transition-transform hover:scale-105">
            B
          </div>
          <div className="bg-surface-secondary rounded p-2 text-center transition-transform hover:scale-105">
            C
          </div>
          <div className="bg-surface-secondary rounded p-2 text-center transition-transform hover:scale-105">
            D
          </div>
        </div>

        <p className="text-neutral-tertiary text-xs">
          CSS variants kept: hover:*, sm:*, md:*
        </p>
      </div>
    </div>
  )
}
