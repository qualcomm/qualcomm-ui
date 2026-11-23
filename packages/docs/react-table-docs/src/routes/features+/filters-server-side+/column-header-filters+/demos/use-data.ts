import type {ColumnFiltersState, SortingState} from "@qualcomm-ui/core/table"

export interface Device {
  batteryLevel: number
  category: string
  country: string
  enrolledAt: string
  firmware: string
  id: string
  lastSeenAt: string
  model: string
  name: string
  site: string
  status: string
}

export interface DeviceColumnMeta {
  filterLabel?: string
}

export interface FetchOptions {
  columnFilters: ColumnFiltersState
  globalFilter: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
}

export interface FetchResult {
  availableFilters: Record<string, string[]>
  devices: Device[]
  pageCount: number
  totalDevices: number
}

let devicesPromise: Promise<Device[]> | undefined

/**
 * Stands in for the server's database. The devices load once and stay in
 * memory.
 */
function loadDevices(): Promise<Device[]> {
  devicesPromise ??= fetch("/data/devices-10k.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load devices: ${res.status}`)
      }
      return res.json()
    })
    .catch((error) => {
      // allow the next request to retry
      devicesPromise = undefined
      throw error
    })
  return devicesPromise
}

function filterDevice(device: Device, filters: ColumnFiltersState): boolean {
  for (const filter of filters) {
    const value = device[filter.id as keyof Device]
    const filterValue = filter.value

    if (typeof value === "number" && Array.isArray(filterValue)) {
      const [min, max] = filterValue as [number, number]
      if (min !== undefined && value < min) {
        return false
      }
      if (max !== undefined && value > max) {
        return false
      }
    } else if (typeof value === "string" && typeof filterValue === "string") {
      if (!value.toLowerCase().includes(filterValue.toLowerCase())) {
        return false
      }
    }
  }
  return true
}

function filterDeviceGlobal(device: Device, globalFilter: string): boolean {
  if (!globalFilter) {
    return true
  }
  const searchLower = globalFilter.toLowerCase()
  return Object.values(device).some((value) =>
    String(value).toLowerCase().includes(searchLower),
  )
}

/**
 * The dates are ISO strings, so they sort correctly as strings.
 */
function sortDevices(devices: Device[], sorting: SortingState): Device[] {
  if (sorting.length === 0) {
    return devices
  }

  return [...devices].sort((a, b) => {
    for (const sort of sorting) {
      const aValue = a[sort.id as keyof Device]
      const bValue = b[sort.id as keyof Device]

      const comparison =
        typeof aValue === "number" && typeof bValue === "number"
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue))

      if (comparison !== 0) {
        return sort.desc ? -comparison : comparison
      }
    }
    return 0
  })
}

function getUniqueValues(
  devices: Device[],
  key: "category" | "status",
): string[] {
  return [...new Set(devices.map((device) => device[key]))].sort()
}

export async function fetchData(options: FetchOptions): Promise<FetchResult> {
  const [devices] = await Promise.all([
    loadDevices(),
    // simulated network latency
    new Promise((resolve) => setTimeout(resolve, 500)),
  ])

  let filteredData = devices

  if (options.globalFilter) {
    filteredData = filteredData.filter((device) =>
      filterDeviceGlobal(device, options.globalFilter),
    )
  }

  if (options.columnFilters.length > 0) {
    filteredData = filteredData.filter((device) =>
      filterDevice(device, options.columnFilters),
    )
  }

  if (options.sorting.length > 0) {
    filteredData = sortDevices(filteredData, options.sorting)
  }

  const filteredCount = filteredData.length

  return {
    availableFilters: {
      category: getUniqueValues(devices, "category"),
      status: getUniqueValues(devices, "status"),
    },
    devices: filteredData.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize,
    ),
    pageCount: Math.ceil(filteredCount / options.pageSize),
    totalDevices: filteredCount,
  }
}
