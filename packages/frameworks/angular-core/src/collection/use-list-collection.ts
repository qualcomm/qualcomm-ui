import {
  computed,
  linkedSignal,
  type Signal,
  type WritableSignal,
} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/locale"
import {accessSignal} from "@qualcomm-ui/angular-core/signals"
import {ListCollection, type ListCollectionOptions} from "@qualcomm-ui/utils/collection"
import type {FilterReturn} from "@qualcomm-ui/utils/i18n"

export interface UseListCollectionProps<T>
  extends Omit<ListCollectionOptions<T>, "items"> {
  /**
   * Filter strategy for the items. Use one of the predefined options, or pass as a
   * function for full control.
   *
   * @option `contains` - Checks if string contains substring using locale-aware exact matching
   * @option `endsWith` - Checks if string ends with substring using locale-aware exact matching
   * @option `startsWith` - Checks if string starts with substring using locale-aware exact matching
   * @option `fuzzyContains` - Checks if string contains substring within Levenshtein distance threshold
   */
  filter:
    | keyof FilterReturn
    | ((itemText: string, filterText: string, item: T) => boolean)
  /**
   * Optional filter text which will filter the items.
   */
  filterText?: Signal<string>
  /**
   * The items to use in the collection, prior to filtering.
   */
  items: Signal<T[]> | T[]
  limit?: number
}

/**
 * @returns an object containing the mutable collection and filterText
 */
export function useListCollection<T>(
  props: UseListCollectionProps<T>,
): UseListCollectionReturn<T> {
  const {
    filter: filterProp,
    filterText: filterTextProp,
    items: itemsProp,
    limit,
    ...collectionOptions
  } = props

  let filterFn: Signal<
    ((itemText: string, filterText: string, item: T) => boolean) | undefined
  >
  if (typeof filterProp === "string") {
    const hook = useFilter({sensitivity: "base"})
    filterFn = computed(() => hook()[filterProp])
  } else {
    filterFn = computed(() => filterProp)
  }

  const baseCollection = linkedSignal(
    () =>
      new ListCollection({
        ...collectionOptions,
        items: accessSignal(itemsProp) ?? [],
      }),
  )
  const filterText = linkedSignal<string>(() => filterTextProp?.() || "")

  const collection = computed(() => {
    let result = baseCollection()
    const filter = filterFn()

    if (filterText() && filter) {
      result = result.filter((itemString: string, _index: number, item: T) =>
        filter(itemString, filterText(), item),
      )
    }

    if (limit != null) {
      result = new ListCollection({
        ...collectionOptions,
        items: result.items.slice(0, limit),
      })
    }

    return result
  })

  return {
    collection,
    filterText,
    reset: () => {
      baseCollection.set(
        new ListCollection({
          ...collectionOptions,
          items: accessSignal(itemsProp) ?? [],
        }),
      )
    },
  }
}

export interface UseListCollectionReturn<T> {
  /**
   * The filtered collection. Pass this as input to your select/combobox.
   */
  collection: Signal<ListCollection<T>>
  /**
   * Mutable filter text which will filter the items when set. This may also be
   * passed as an input property to this hook.
   */
  filterText: WritableSignal<string>
  /**
   * Helper function to reset the collection to its initial state.
   */
  reset: () => void
}
