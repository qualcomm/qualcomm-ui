export type SearchResultType =
  | "operation"
  | "tag"
  | "model"
  | "heading"
  | "webhook"

export interface SearchResultItem {
  description?: string
  id: string
  isDeprecated?: boolean
  method?: string
  path?: string
  title: string
  type: SearchResultType
}

export interface SearchResultProps {
  id: string
  isSelected?: boolean
  onClick?: () => void
  result: SearchResultItem
}

const TYPE_ICONS: Record<SearchResultType, string> = {
  heading: "§",
  model: "{}",
  operation: "⌘",
  tag: "#",
  webhook: "⚡",
}

const TYPE_LABELS: Record<SearchResultType, string> = {
  heading: "Heading",
  model: "Model",
  operation: "Operation",
  tag: "Tag",
  webhook: "Webhook",
}

export function SearchResult({
  id,
  isSelected = false,
  onClick,
  result,
}: SearchResultProps) {
  return (
    <button
      id={id}
      className="openapi-search-result"
      data-selected={isSelected || undefined}
      data-type={result.type}
      data-deprecated={result.isDeprecated || undefined}
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
    >
      <span className="openapi-search-result__icon" aria-hidden="true">
        {TYPE_ICONS[result.type]}
      </span>

      <div className="openapi-search-result__content">
        <span className="openapi-search-result__title">
          <span className="sr-only">{TYPE_LABELS[result.type]}: </span>
          {result.title}
        </span>

        {(result.path || result.description) && (
          <span className="openapi-search-result__description">
            {result.type === "operation" && result.method && (
              <span
                className="openapi-search-result__method"
                data-method={result.method.toLowerCase()}
              >
                {result.method.toUpperCase()}
              </span>
            )}
            {result.path || result.description}
          </span>
        )}
      </div>
    </button>
  )
}
