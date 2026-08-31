import type {ReactElement} from "react"

import {skipToken, useQuery} from "@tanstack/react-query"

import type {SemanticSearchResult} from "@qualcomm-ui/mdx-common"
import {
  SemanticSiteSearch,
  useSemanticSearchReducer,
} from "@qualcomm-ui/react-mdx/site-search"

export function GlobalSearch(): ReactElement {
  const [searchState, searchDispatch] = useSemanticSearchReducer()
  const {data, error, isLoading} = useQuery<SemanticSearchResult[]>({
    placeholderData: (previousData) => previousData,
    queryFn:
      searchState.inputValue.trim().length > 2
        ? async () => {
            return fetch("/api/search", {
              body: JSON.stringify({query: searchState.inputValue.trim()}),
              headers: {"Content-Type": "application/json"},
              method: "POST",
            })
              .then((res) => res.json())
              .then((resJson) => {
                return resJson.results
              })
          }
        : skipToken,
    queryKey: [searchState.inputValue],
  })

  return (
    <SemanticSiteSearch
      error={
        error && !isLoading && !data?.length
          ? "Search is unavailable."
          : undefined
      }
      isLoadingResults={isLoading}
      results={data ?? []}
      searchActionDispatch={searchDispatch}
      searchState={searchState}
    />
  )
}
