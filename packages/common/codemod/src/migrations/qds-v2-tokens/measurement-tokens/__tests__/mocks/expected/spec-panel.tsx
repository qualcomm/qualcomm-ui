export const specs = [
  {label: "Height", token: "--sizing-1000"},
  {label: "Padding inline", token: "--spacing-400"},
  {label: "Gap", token: "--spacing-200"},
]

export function Swatch() {
  return (
    <div className="w-[var(--sizing-400)] rounded-[var(--border-radius-75)]" />
  )
}
