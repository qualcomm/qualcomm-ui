// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import {
  useFloating,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react"
import {SearchIcon} from "lucide-react"

import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import type {
  SemanticSearchResponse,
  SemanticSearchResult,
} from "@qualcomm-ui/mdx-common"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Kbd} from "@qualcomm-ui/react/kbd"
import {TextInput} from "@qualcomm-ui/react/text-input"

import {SemanticSearchResultItem} from "./semantic-search-result-item.js"

export interface SemanticSiteSearchProps {
  /**
   * Server endpoint that accepts semantic search requests.
   *
   * @default "/api/search"
   */
  endpoint?: string

  /**
   * Node to render when the server returns no matches.
   *
   * @default "No results found..."
   */
  noResults?: ReactNode

  /**
   * Node to render when the semantic search server is unavailable.
   *
   * @default "Search is unavailable."
   */
  unavailable?: ReactNode
}

type SearchState = "idle" | "loading" | "ready" | "unavailable"

export function SemanticSiteSearch({
  endpoint = "/api/search",
  noResults = "No results found...",
  unavailable = "Search is unavailable.",
}: SemanticSiteSearchProps): ReactNode {
  const [showDialog, setShowDialog] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<SemanticSearchResult[]>([])
  const [searchState, setSearchState] = useState<SearchState>("idle")
  const dialogInputRef = useRef<HTMLInputElement>(null)
  const dialogInputContainerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMac, setIsMac] = useState<boolean>(false)

  const {renderLink: Link} = useMdxDocsContext()

  useEffect(() => {
    const unsub = trackFocusVisible({root: document.documentElement})
    return () => {
      unsub()
    }
  }, [])

  const {context, refs} = useFloating({
    open: showDialog,
  })

  const listNavigation = useListNavigation(context, {
    activeIndex,
    listRef,
    loop: true,
    onNavigate: (index) => {
      setActiveIndex(index)
    },
  })

  useEffect(() => {
    let cleanup: (() => void) | undefined

    async function setup() {
      let isMac = false

      try {
        const UaParser = await import("my-ua-parser").then((m) => m.UAParser)
        const userAgent = new UaParser(window.navigator.userAgent)
        isMac = userAgent.getOS().name === "Mac OS"
      } catch {
        isMac = /Mac/i.test(window.navigator.userAgent)
      }

      setIsMac(isMac)

      function listener(event: KeyboardEvent) {
        if (
          event.key === "k" &&
          ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
        ) {
          setShowDialog(true)
          event.preventDefault()
        }
      }

      window.addEventListener("keydown", listener)
      cleanup = () => {
        window.removeEventListener("keydown", listener)
      }
    }

    void setup()

    return () => {
      cleanup?.()
    }
  }, [])

  useEffect(() => {
    const query = inputValue.trim()
    const controller = new AbortController()

    setActiveIndex(null)
    if (query.length < 2) {
      setResults([])
      setSearchState("idle")
      return () => {
        controller.abort()
      }
    }

    const timeout = setTimeout(() => {
      setSearchState("loading")

      void fetch(endpoint, {
        body: JSON.stringify({query}),
        headers: {"Content-Type": "application/json"},
        method: "POST",
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              `Semantic search request failed: ${response.status}`,
            )
          }

          const body: unknown = await response.json()
          if (!isSemanticSearchResponse(body)) {
            throw new Error("Semantic search response is malformed.")
          }

          return body.results
        })
        .then((results) => {
          if (!controller.signal.aborted) {
            setResults(results)
            setSearchState("ready")
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setResults([])
            setSearchState("unavailable")
          }
        })
    }, 200)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [endpoint, inputValue])

  const onInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  const onListItemKeyDown = useCallback((event: ReactKeyboardEvent) => {
    switch (event.key) {
      case "Enter":
      case "Space":
        break
      case "Tab":
        dialogInputRef.current?.focus()
        event.preventDefault()
        break
      case "ArrowDown":
      case "ArrowUp":
        break
      default:
        dialogInputRef.current?.focus()
        break
    }
  }, [])

  const onInputKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          listRef.current[0]?.focus()
          break
        case "ArrowUp":
          event.preventDefault()
          break
      }
    },
    [],
  )

  const {getFloatingProps, getItemProps, getReferenceProps} = useInteractions([
    listNavigation,
  ])
  const shouldShowPanel = inputValue.trim().length >= 2

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        setShowDialog(open)
      }}
      open={showDialog}
      restoreFocus={false}
    >
      <Dialog.Trigger>
        <div
          aria-label="Search the documentation"
          className="qui-site-search__trigger"
          role="searchbox"
        >
          <HeaderBar.ActionIconButton
            aria-label="Search"
            className="qui-site-search__mobile-icon-button"
            icon={SearchIcon}
          />
          <TextInput
            className="qui-site-search__text-input"
            endIcon={
              <Kbd>
                <div>{isMac ? "⌘" : "CTRL"}</div>
                <div>+</div>
                <div>K</div>
              </Kbd>
            }
            inputProps={{
              "aria-label": "Search the docs",
            }}
            onClick={(event) => {
              event.stopPropagation()
            }}
            onFocus={() => setShowDialog(true)}
            placeholder="Search the docs"
            size="sm"
            startIcon={SearchIcon}
            value=""
          />
        </div>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop className="qui-site-search__mobile-dialog-backdrop" />
        <Dialog.Positioner>
          <Dialog.Content
            className="qui-site-search__mobile-dialog-content"
            onClick={(event) => {
              if (
                !dialogInputContainerRef.current?.contains(
                  event.target as HTMLElement,
                )
              ) {
                setShowDialog(false)
              }
            }}
            style={{background: "transparent", border: 0, padding: 0}}
          >
            <div className="qui-site-search__mobile-input-wrapper">
              <TextInput
                {...getReferenceProps({
                  onKeyDown: onInputKeyDown,
                })}
                ref={dialogInputContainerRef}
                className="q-background-2"
                inputProps={{
                  "aria-label": "Search the docs",
                  ref: dialogInputRef,
                }}
                onValueChange={onInputChange}
                placeholder="Search the docs"
                size="lg"
                startIcon={SearchIcon}
                value={inputValue}
              />
              {shouldShowPanel ? (
                <div
                  ref={refs.setFloating}
                  {...getFloatingProps()}
                  className="qui-site-search__floating-panel-mobile"
                >
                  {searchState === "loading" ? (
                    <div className="qui-site-search__no-results">
                      Searching…
                    </div>
                  ) : null}
                  {searchState === "ready" && results.length
                    ? results.map((result, index) => (
                        <SemanticSearchResultItem
                          key={result.sectionId}
                          active={index === activeIndex}
                          item={result}
                          render={<Link href={result.href} />}
                          {...getItemProps({
                            onKeyDown: onListItemKeyDown,
                            ref: (ref) => {
                              listRef.current[index] = ref
                            },
                            tabIndex: -1,
                          })}
                        />
                      ))
                    : null}
                  {searchState === "ready" && results.length === 0 ? (
                    <div className="qui-site-search__no-results">
                      {noResults}
                    </div>
                  ) : null}
                  {searchState === "unavailable" ? (
                    <div className="qui-site-search__no-results">
                      {unavailable}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

function isSemanticSearchResponse(
  value: unknown,
): value is SemanticSearchResponse {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray((value as {results?: unknown}).results)
  ) {
    return false
  }

  return (value as {results: unknown[]}).results.every(isSemanticSearchResult)
}

function isSemanticSearchResult(value: unknown): value is SemanticSearchResult {
  if (!value || typeof value !== "object") {
    return false
  }

  const result = value as Partial<SemanticSearchResult>
  return (
    typeof result.excerpt === "string" &&
    typeof result.heading === "string" &&
    typeof result.href === "string" &&
    typeof result.sectionId === "string" &&
    typeof result.title === "string" &&
    (result.highlights === undefined ||
      (Array.isArray(result.highlights) &&
        result.highlights.every(
          (highlight) =>
            !!highlight &&
            typeof highlight === "object" &&
            Number.isInteger(highlight.start) &&
            Number.isInteger(highlight.end),
        )))
  )
}
