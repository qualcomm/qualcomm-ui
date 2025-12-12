export function NestedElements() {
  return (
    <div className="bg-surface-primary flex flex-col gap-2 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <span className="bg-brand-primary h-3 w-3 rounded-full" />
        <span className="text-neutral-primary font-medium">Parent flex</span>
      </div>
      {/* preview */}
      <div className="ml-5 flex flex-col gap-1">
        <span className="text-neutral-secondary text-sm">Nested child 1</span>
        <span className="text-neutral-secondary text-sm">Nested child 2</span>
      </div>
      {/* preview */}
    </div>
  )
}
