export function ArbitraryValues() {
  return (
    <div className="bg-surface-primary flex flex-col gap-4 rounded-lg p-4">
      <p className="text-neutral-secondary text-sm">
        Arbitrary values with bracket syntax
      </p>

      <div className="flex items-end gap-4">
        <div className="bg-brand-primary flex h-[60px] w-[100px] items-center justify-center rounded">
          <span className="text-on-brand-primary text-xs">100x60</span>
        </div>
        <div className="bg-brand-primary flex h-[80px] w-[150px] items-center justify-center rounded">
          <span className="text-on-brand-primary text-xs">150x80</span>
        </div>
        <div className="bg-brand-primary flex h-[40px] w-[200px] items-center justify-center rounded">
          <span className="text-on-brand-primary text-xs">200x40</span>
        </div>
      </div>

      <div className="bg-surface-secondary mt-[10px] rounded p-[18px]">
        <span className="text-neutral-primary">Custom padding: 18px</span>
      </div>
    </div>
  )
}
