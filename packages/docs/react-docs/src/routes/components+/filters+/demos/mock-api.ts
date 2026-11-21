import type {FacetIndexItem} from "@qualcomm-ui/utils/facet-index"

export interface Build extends FacetIndexItem {
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

export interface Owner {
  label: string
  value: string
}

const owners: Owner[] = [
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
  {label: "Chloe Nguyen", value: "u3"},
  {label: "Dev Patel", value: "u4"},
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

/**
 * Stands in for an endpoint that returns the users who own builds.
 */
export async function fetchOwners(): Promise<Owner[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return owners
}
