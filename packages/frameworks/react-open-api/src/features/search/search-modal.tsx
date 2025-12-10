import {useCallback, useEffect, useId, useRef, useState} from "react"

import {SearchResult, type SearchResultItem} from "./search-result"

export interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  onSelect: (result: SearchResultItem) => void
  results: SearchResultItem[]
}

export function SearchModal({
  isOpen,
  onClose,
  onSearch,
  onSelect,
  results,
}: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const baseId = useId()
  const listboxId = `${baseId}-results`
  const instructionsId = `${baseId}-instructions`

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(undefined)
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    onSearch(query)
  }, [query, onSearch])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => {
            if (prev === undefined) {
              return 0
            }
            return (prev + 1) % results.length
          })
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => {
            if (prev === undefined) {
              return results.length - 1
            }
            return (prev - 1 + results.length) % results.length
          })
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex !== undefined && results[selectedIndex]) {
            onSelect(results[selectedIndex])
            onClose()
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    },
    [results, selectedIndex, onSelect, onClose],
  )

  const handleSelect = useCallback(
    (result: SearchResultItem) => {
      onSelect(result)
      onClose()
    },
    [onSelect, onClose],
  )

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    return () => document.removeEventListener("keydown", handleGlobalKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const activeDescendantId =
    selectedIndex !== undefined && results[selectedIndex]
      ? `search-result-${results[selectedIndex].id}`
      : undefined

  return (
    <div className="openapi-search-modal__overlay" onClick={onClose}>
      <div
        className="openapi-search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="openapi-search-modal__input-wrapper" role="search">
          <SearchIcon />
          <input
            ref={inputRef}
            className="openapi-search-modal__input"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-describedby={instructionsId}
            aria-activedescendant={activeDescendantId}
            aria-expanded={results.length > 0}
          />
        </div>

        <div
          id={listboxId}
          className="openapi-search-modal__results"
          role="listbox"
          aria-label="Search Results"
        >
          {results.length === 0 && query.length > 0 && (
            <div className="openapi-search-modal__no-results">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {results.map((result, index) => (
            <SearchResult
              key={result.id}
              id={`search-result-${result.id}`}
              result={result}
              isSelected={selectedIndex === index}
              onClick={() => handleSelect(result)}
            />
          ))}
        </div>

        <div id={instructionsId} className="openapi-search-modal__footer">
          <span aria-hidden="true">
            <span>↑↓ Navigate</span>
            <span>⏎ Select</span>
            <span>Esc Close</span>
          </span>
          <span className="sr-only">
            Press up arrow / down arrow to navigate, enter to select, escape to
            close
          </span>
        </div>
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      className="openapi-search-modal__search-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
