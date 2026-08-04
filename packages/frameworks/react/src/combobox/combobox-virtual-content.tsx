// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type CSSProperties,
  Fragment,
  type ReactElement,
  useEffect,
  useRef,
} from "react"

import {
  type ScrollToOptions,
  useVirtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual"

import type {ScrollToIndexDetails} from "@qualcomm-ui/core/select"
import {useComboboxContext} from "@qualcomm-ui/react-core/combobox"
import {useNoMemo} from "@qualcomm-ui/react-core/compat"
import {HighlightText} from "@qualcomm-ui/react-core/highlight"
import {useMergedRef} from "@qualcomm-ui/react-core/refs"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {ComboboxContent, type ComboboxContentProps} from "./combobox-content.js"
import {ComboboxItemIndicator} from "./combobox-item-indicator.js"
import {ComboboxItemText} from "./combobox-item-text.js"
import {ComboboxItem} from "./combobox-item.js"
import type {ComboboxItemRenderProp} from "./combobox-items.js"
import {useQdsComboboxContext} from "./qds-combobox-context.js"

export interface ComboboxVirtualContentProps<
  T extends CollectionItem,
> extends ComboboxContentProps {
  /**
   * Set to `true` to highlight option text matches during filtering.
   */
  highlightMatchingText?: boolean

  /**
   * Customize the rendering of the combobox list items. You must forward the
   * `style` prop to the item, otherwise it won't render properly.
   */
  renderItem?: ComboboxItemRenderProp<T>

  /**
   * {@link https://tanstack.com/virtual/v3/docs/api/virtualizer @tanstack/react-virtual options},
   * forwarded to the virtualizer.
   * @inheritDoc
   */
  virtualOptions?: Partial<VirtualizerOptions<any, any>>
}

/**
 * Virtual scrolling container for efficiently rendering large lists of combobox
 * options. Renders a `<div>` element by default.
 */
export function ComboboxVirtualContent<
  T extends CollectionItem = CollectionItem,
>({
  children,
  highlightMatchingText,
  ref,
  renderItem,
  virtualOptions,
  ...props
}: ComboboxVirtualContentProps<T>): ReactElement {
  const {collection, inputValue, open, setScrollToIndexFn} =
    useComboboxContext()
  const qdsContext = useQdsComboboxContext()
  const localRef = useRef<HTMLDivElement>(null!)
  const mergedRef = useMergedRef(ref, localRef)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const content = localRef.current
      if (!content) {
        return
      }

      const positioner: HTMLDivElement | null = content.closest(
        `[data-combobox-part="positioner"]`,
      )
      if (!positioner) {
        return
      }
      positioner.style.setProperty(
        "--scrollbar-width",
        `${positioner.offsetWidth - positioner.clientWidth}px`,
      )
    })
    return () => cancelAnimationFrame(frame)
  }, [inputValue, open])

  const virtualizer = useVirtualizer({
    count: collection.items.length,
    enabled: open,
    estimateSize: () => (qdsContext.size === "sm" ? 32 : 40),
    getScrollElement: () =>
      localRef.current.closest(`[data-combobox-part="positioner"]`) ||
      localRef.current,
    overscan: 5,
    // account for 2px border
    paddingEnd: 2,
    scrollPaddingEnd: 2,
    ...virtualOptions,
  })

  const mergedProps = mergeProps(
    qdsContext.getContentBindings(),
    {
      style: {
        height: `${useNoMemo(() => virtualizer.getTotalSize())}px`,
      } satisfies CSSProperties,
    },
    props,
  )

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const handleScrollToIndexFn = (details: ScrollToIndexDetails) => {
      const scrollOptions: ScrollToOptions = {
        align: "auto",
        behavior: "auto",
      }
      if (!details) {
        return
      }
      if (details.immediate) {
        virtualizer.scrollToIndex(details.index, scrollOptions)
      } else {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          virtualizer.scrollToIndex(details.index, scrollOptions)
        })
      }
    }
    setScrollToIndexFn(handleScrollToIndexFn)
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [setScrollToIndexFn, virtualizer])

  const virtualItems = useNoMemo(() => virtualizer.getVirtualItems())

  if (renderItem) {
    return (
      <ComboboxContent {...mergedProps} ref={mergedRef} data-virtual>
        {children}
        {virtualItems.map((virtualItem) => {
          const item = collection.items.at(virtualItem.index)
          const value = collection.getItemValue(item)

          return (
            <Fragment key={value}>
              {renderItem({
                "data-virtual": "",
                item,
                style: {
                  "--virtual-item-start": `${virtualItem.start}px`,
                } as CSSProperties,
              })}
            </Fragment>
          )
        })}
      </ComboboxContent>
    )
  }

  return (
    <ComboboxContent {...mergedProps} ref={mergedRef} data-virtual>
      {children}
      {virtualItems.map((virtualItem) => {
        const item = collection.items.at(virtualItem.index)
        const label = collection.stringifyItem(item)
        const value = collection.getItemValue(item)

        return (
          <ComboboxItem
            key={value}
            data-virtual
            item={item}
            style={
              {
                "--virtual-item-start": `${virtualItem.start}px`,
              } as CSSProperties
            }
          >
            <ComboboxItemText>
              {highlightMatchingText ? (
                <HighlightText
                  ignoreCase
                  query={inputValue}
                  text={label ?? ""}
                />
              ) : (
                label
              )}
            </ComboboxItemText>
            <ComboboxItemIndicator />
          </ComboboxItem>
        )
      })}
    </ComboboxContent>
  )
}
