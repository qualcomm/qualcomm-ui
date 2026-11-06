export const specs = [
  {label: "Height", token: "--sizing-140"},
  {label: "Padding inline", token: "--spacing-100"},
  {label: "Gap", token: "--spacing-70"},
]

export function Swatch() {
  return (
    <div className="w-[var(--sizing-70)] rounded-[var(--border-radius-sm)]" />
  )
}
