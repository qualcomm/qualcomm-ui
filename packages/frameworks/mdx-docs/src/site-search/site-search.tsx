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
import {getSelectorsByUserAgent, OsTypes} from "react-device-detect"

import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {useMdxDocsContext} from "@qualcomm-ui/mdx-docs/context"
import {Dialog} from "@qualcomm-ui/react/dialog"
import {HeaderBar} from "@qualcomm-ui/react/header-bar"
import {TextInput} from "@qualcomm-ui/react/text-input"
import {useDebounce} from "@qualcomm-ui/react-core/effects"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {GroupedResultItem} from "./grouped-result-item"
import {SearchResultItem} from "./search-result-item"
import {useGroupedResults} from "./use-grouped-results"

interface SiteSearchMobileProps {
  /**
   * Node to render when no results are found.
   *
   * @default "No results found..."
   */
  noResults?: ReactNode
}

export function SiteSearch({
  noResults = "No results found...",
}: SiteSearchMobileProps): ReactNode {
  const [showDialog, setShowDialog] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogInputRef = useRef<HTMLInputElement>(null)
  const dialogInputContainerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<Array<HTMLElement | null>>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

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

  const groupedResults = useGroupedResults(debouncedInputValue)

  const onInputChange = useCallback((value: string) => {
    setInputValue(value)
  }, [])

  useEffect(() => {
    const {osName} = getSelectorsByUserAgent(window.navigator.userAgent)

    const isMac = osName === OsTypes.MAC_OS

    function listener(event: KeyboardEvent) {
      if (
        event.key === "k" &&
        ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
      ) {
        inputRef.current?.focus()
        event.preventDefault()
      }
    }

    window.addEventListener("keydown", listener)

    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, [showDialog])

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
          className="qui-site-search__mobile-icon"
          role="searchbox"
        >
          <HeaderBar.ActionIconButton aria-label="Search" icon={SearchIcon} />
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
                inputProps={{ref: dialogInputRef}}
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
                  {groupedResults.length ? (
                    <>
                      {groupedResults.map((result) => (
                        <div
                          key={`${result.id}-${result.categoryId}`}
                          className="qui-site-search__result-group-wrapper"
                        >
                          <GroupedResultItem
                            active={result.index === activeIndex}
                            render={<Link href={result.pathname} />}
                            {...getItemProps({
                              onKeyDown: onListItemKeyDown,
                              ref: (ref) => {
                                listRef.current[result.index] = ref
                              },
                              tabIndex: -1,
                            })}
                            item={result}
                          />
                          <div className="qui-site-search__result-group">
                            {result.items.map((item) => (
                              <SearchResultItem
                                key={item.id}
                                inputValue={inputValue}
                                {...getItemProps({
                                  onKeyDown: onListItemKeyDown,
                                  ref: (ref) => {
                                    listRef.current[item.index] = ref
                                  },
                                  tabIndex: -1,
                                })}
                                active={item.index === activeIndex}
                                isChild
                                item={item}
                                render={<Link href={item.href} />}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
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
