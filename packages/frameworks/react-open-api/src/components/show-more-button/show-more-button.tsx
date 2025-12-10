export interface ShowMoreButtonProps {
  collapsedLabel?: string
  expandedLabel?: string
  isExpanded: boolean
  onClick: () => void
}

export function ShowMoreButton({
  collapsedLabel = "Show more",
  expandedLabel = "Show less",
  isExpanded,
  onClick,
}: ShowMoreButtonProps) {
  return (
    <button
      className="openapi-show-more-button"
      type="button"
      onClick={onClick}
      data-expanded={isExpanded || undefined}
    >
      <span>{isExpanded ? expandedLabel : collapsedLabel}</span>
      <ChevronIcon rotated={isExpanded} />
    </button>
  )
}

function ChevronIcon({rotated}: {rotated: boolean}) {
  return (
    <svg
      className="openapi-show-more-button__icon"
      data-rotated={rotated || undefined}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
