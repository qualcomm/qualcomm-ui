export function InteractiveVariants() {
  return (
    <div className="bg-surface-primary flex flex-col gap-4 rounded-lg p-4">
      <button
        className="bg-brand-primary text-on-brand-primary focus:ring-brand-primary rounded-lg px-4 py-2 hover:opacity-80 focus:ring-2 focus:outline-none active:scale-95"
        type="button"
      >
        Hover, Focus, Active
      </button>

      <div className="flex gap-2">
        <div className="bg-surface-secondary hover:bg-brand-primary h-12 w-12 rounded transition-colors" />
        <div className="bg-surface-secondary hover:bg-brand-primary h-12 w-12 rounded transition-colors" />
        <div className="bg-surface-secondary hover:bg-brand-primary h-12 w-12 rounded transition-colors" />
      </div>

      <input
        className="border-neutral-secondary focus:border-brand-primary focus:ring-brand-primary rounded border px-3 py-2 outline-none focus:ring-1"
        placeholder="Focus me..."
        type="text"
      />
    </div>
  )
}
