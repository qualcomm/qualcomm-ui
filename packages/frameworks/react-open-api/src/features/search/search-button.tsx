import {useCallback, useEffect} from "react"

export interface SearchButtonProps {
  className?: string
  hotKey?: string
  onClick: () => void
  variant?: "default" | "icon"
}

function isMacOS(): boolean {
  if (typeof navigator === "undefined") {
    return false
  }
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0
}

export function SearchButton({
  className,
  hotKey = "k",
  onClick,
  variant = "default",
}: SearchButtonProps) {
  const handleHotKey = useCallback(
    (e: KeyboardEvent) => {
      const modifier = isMacOS() ? e.metaKey : e.ctrlKey
      if (modifier && e.key.toLowerCase() === hotKey.toLowerCase()) {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }
    },
    [hotKey, onClick],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleHotKey)
    return () => window.removeEventListener("keydown", handleHotKey)
  }, [handleHotKey])

  if (variant === "icon") {
    return (
      <button
        className={`openapi-search-button--icon ${className || ""}`}
        type="button"
        onClick={onClick}
        aria-label="Search"
      >
        <SearchIcon />
      </button>
    )
  }

  return (
    <button
      className={`openapi-search-button ${className || ""}`}
      type="button"
      onClick={onClick}
    >
      <SearchIcon />
      <span className="openapi-search-button__text">Search</span>
      <span className="openapi-search-button__shortcut" aria-hidden="true">
        {isMacOS() ? "⌘" : "⌃"}
        {hotKey.toUpperCase()}
      </span>
      <span className="sr-only">
        Press {isMacOS() ? "Command" : "Control"} + {hotKey.toUpperCase()} to
        search
      </span>
    </button>
  )
}

function SearchIcon() {
  return (
    <svg
      className="openapi-search-button__icon"
      width="14"
      height="14"
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
