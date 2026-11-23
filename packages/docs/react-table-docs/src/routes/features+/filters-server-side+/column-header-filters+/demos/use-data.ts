import {
  type DateFilterPreset,
  type DateFilterPresetRange,
  type DateFilterValue,
  type FilterOptionObject,
  type RangeFilterValue,
  resolveDateFilterPreset,
} from "@qualcomm-ui/core/filters"
import type {ColumnFilter, ColumnFiltersState} from "@qualcomm-ui/core/table"

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

/**
 * The date presets the API resolves. The enrolled filter offers the same
 * presets.
 */
export const enrolledAtPresets: DateFilterPreset[] = [
  {label: "2025", range: () => ["2025-01-01", "2025-12-31"], value: "2025"},
  {label: "2026", range: () => ["2026-01-01", "2026-12-31"], value: "2026"},
]

type OptionField = "category" | "status"

export interface FilterOptionsResult {
  /**
   * Every value of each list field across all devices, keyed by field.
   */
  options: Record<string, FilterOptionObject[]>
  /**
   * The bounds of each numeric field across all devices, keyed by field.
   */
  ranges: Record<string, {max: number; min: number}>
}

export interface FetchDevicesOptions {
  filters: ColumnFiltersState
  pageIndex: number
  pageSize: number
}

export interface FetchDevicesResult {
  /**
   * The number of matching devices per value of each list field, keyed by
   * field. Each field's counts apply every filter except the field's own.
   */
  counts: Record<string, Record<string, number>>
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

async function handleRequest<T>(handler: (devices: Device[]) => T): Promise<T> {
  const [devices] = await Promise.all([
    loadDevices(),
    // simulated network latency
    new Promise((resolve) => setTimeout(resolve, 500)),
  ])
  return handler(devices)
}

interface DevicePredicate {
  field: string
  matches: (device: Device) => boolean
}

function resolveDateRange(value: DateFilterValue): DateFilterPresetRange {
  if ("range" in value) {
    return value.range
  }
  const preset = enrolledAtPresets.find(({value: id}) => id === value.preset)
  return preset ? resolveDateFilterPreset(preset) : [null, null]
}

/**
 * The bounds are ISO 8601 dates, so the end date is included in full.
 */
function isInDateRange(
  date: string,
  [start, end]: DateFilterPresetRange,
): boolean {
  const time = Date.parse(date)
  return (
    (start === null || time >= new Date(start).getTime()) &&
    (end === null || time <= new Date(end).getTime())
  )
}

function toPredicate({id, value}: ColumnFilter): DevicePredicate {
  switch (id) {
    case "name": {
      const query = (value as string).toLowerCase()
      return {
        field: id,
        matches: ({name}) => name.toLowerCase().includes(query),
      }
    }
    case "batteryLevel": {
      const [min, max] = value as RangeFilterValue
      return {
        field: id,
        matches: ({batteryLevel}) =>
          (min === null || batteryLevel >= min) &&
          (max === null || batteryLevel <= max),
      }
    }
    case "enrolledAt": {
      const range = resolveDateRange(value as DateFilterValue)
      return {
        field: id,
        matches: ({enrolledAt}) => isInDateRange(enrolledAt, range),
      }
    }
    case "category":
    case "status": {
      const field = id
      const selected = new Set(value as string[])
      return {field, matches: (device) => selected.has(device[field])}
    }
    default:
      return {field: id, matches: () => true}
  }
}

function getOptions(
  devices: Device[],
  field: OptionField,
): FilterOptionObject[] {
  return [...new Set(devices.map((device) => device[field]))]
    .sort()
    .map((value) => ({label: value, value}))
}

function countOptions(
  devices: Device[],
  predicates: DevicePredicate[],
  field: OptionField,
): Record<string, number> {
  const others = predicates.filter((predicate) => predicate.field !== field)
  const counts: Record<string, number> = {}
  for (const device of devices) {
    if (others.every((predicate) => predicate.matches(device))) {
      counts[device[field]] = (counts[device[field]] ?? 0) + 1
    }
  }
  return counts
}

export function fetchFilterOptions(): Promise<FilterOptionsResult> {
  return handleRequest((devices) => {
    const levels = devices.map((device) => device.batteryLevel)
    return {
      options: {
        category: getOptions(devices, "category"),
        status: getOptions(devices, "status"),
      },
      ranges: {
        batteryLevel: {max: Math.max(...levels), min: Math.min(...levels)},
      },
    }
  })
}

export function fetchDevices({
  filters,
  pageIndex,
  pageSize,
}: FetchDevicesOptions): Promise<FetchDevicesResult> {
  return handleRequest((devices) => {
    const predicates = filters.map(toPredicate)
    const matches = devices.filter((device) =>
      predicates.every((predicate) => predicate.matches(device)),
    )
    return {
      counts: {
        category: countOptions(devices, predicates, "category"),
        status: countOptions(devices, predicates, "status"),
      },
      devices: matches.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
      pageCount: Math.ceil(matches.length / pageSize),
      totalDevices: matches.length,
    }
  })
}
