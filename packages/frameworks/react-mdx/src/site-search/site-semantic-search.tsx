// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type Dispatch,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type SetStateAction,
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
import type {SemanticSearchResult} from "@qualcomm-ui/mdx-common"
import {useDebounce} from "@qualcomm-ui/react-core/effects"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {useMdxDocsContext} from "@qualcomm-ui/react-mdx/context"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {Kbd} from "@qualcomm-ui/react/kbd"
import {TextInput} from "@qualcomm-ui/react/text-input"

import {SemanticSearchResultItem} from "./semantic-search-result-item.js"

export interface SiteSemanticSearchProps {
  /**
   * The current value of the input.
   */
  inputValue: string

  /**
   * Boolean that indicates if the search results are currently loading.
   */
  isLoading?: boolean

  /**
   * Boolean that indicates to show Mac activation hotkey on initial SSR. If
   * omitted, the value will be determined automated based on the user's platform.
   */
  isMac?: boolean

  /**
   * Node to render when no results are found.
   *
   * @default "No results found..."
   */
  noResults?: ReactNode

  /**
   * Search results to display.
   */
  searchResults: SemanticSearchResult[]

  /**
   * The function to call when the input value changes.
   */
  setInputValue: Dispatch<SetStateAction<string>>
}

export function SiteSemanticSearch({
  inputValue,
  isLoading,
  isMac: isMacProp,
  noResults = "No results found...",
  searchResults,
  setInputValue,
}: SiteSemanticSearchProps): ReactNode {
  const [showDialog, setShowDialog] = useState(false)
  const dialogInputRef = useRef<HTMLInputElement>(null)
  const dialogInputContainerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isMac, setIsMac] = useState<boolean>(isMacProp ?? false)

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

  const debouncedInputValue = useDebounce(inputValue, 100)

  const onInputChange = useCallback(
    (value: string) => {
      setInputValue(value)
    },
    [setInputValue],
  )

  useEffect(() => {
    if (isMac) {
      return
    }
    let cleanup: (() => void) | undefined

    async function setup() {
      let isMac = false

      try {
        const UaParser = await import("my-ua-parser").then((m) => m.UAParser)
        const userAgent = new UaParser(window.navigator.userAgent)
        const osName = userAgent.getOS().name
        isMac = osName === "Mac OS"
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
  }, [isMac])

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
        break
      case "ArrowUp":
        break
      default:
        dialogInputRef.current?.focus?.()
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

  const matchedQuery =
    inputValue.length > 1 ? (inputValue.split(" ").at(-1) ?? "") : ""

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
              // firefox input hide on mouseUp fix
              event.stopPropagation()
            }}
            onFocus={() => setShowDialog(true)}
            placeholder="Search the docs"
            size="sm"
            startIcon={SearchIcon}
            // this field is purely visual
            value=""
          />
        </div>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop className="qui-site-search__mobile-dialog-backdrop" />
        <Dialog.Positioner>
          <Dialog.Content
            className="qui-site-search__mobile-dialog-content"
            // close dialog when a result item is selected
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
              {inputValue.length ? (
                <div
                  ref={refs.setFloating}
                  {...getFloatingProps()}
                  className="qui-site-search__floating-panel-mobile"
                >
                  {searchResults.length ? (
                    searchResults.map((item, index) => {
                      return (
                        <SemanticSearchResultItem
                          key={item.id}
                          {...getItemProps({
                            onKeyDown: onListItemKeyDown,
                            ref: (ref) => {
                              listRef.current[index] = ref
                            },
                            tabIndex: -1,
                          })}
                          active={index === activeIndex}
                          item={item}
                          matchedQuery={matchedQuery}
                        />
                      )
                    })
                  ) : noResults ? (
                    <div className="qui-site-search__no-results">
                      {noResults}
                    </div>
                  ) : null}
                </div>
              ) : null}{" "}
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
