import type {FacetFilterItem} from "@qualcomm-ui/utils/facet-filter"

export interface Build extends FacetFilterItem {
  name: string
  platform: string
  status: string
}

export interface BuildsQuery {
  platform?: string[] | undefined
  status?: string[] | undefined
}

const builds: Build[] = [
  {id: "1", name: "android-arm64", platform: "Android", status: "Failed"},
  {id: "2", name: "android-x86", platform: "Android", status: "Passed"},
  {id: "3", name: "ios-simulator", platform: "iOS", status: "Queued"},
  {id: "4", name: "linux-gcc", platform: "Linux", status: "Passed"},
  {id: "5", name: "linux-clang", platform: "Linux", status: "Failed"},
  {id: "6", name: "windows-msvc", platform: "Windows", status: "Passed"},
  {id: "7", name: "windows-arm64", platform: "Windows", status: "Queued"},
  {id: "8", name: "macos-arm64", platform: "macOS", status: "Passed"},
]

const fields = ["platform", "status"] as const

/**
 * Stands in for a search endpoint that returns the builds matching the query.
 * A build matches any selected value within a field, and every field.
 */
export async function fetchBuilds(query: BuildsQuery): Promise<Build[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return builds.filter((build) =>
    fields.every((field) => {
      const selected = query[field]
      return !selected?.length || selected.includes(build[field])
    }),
  )
}
