import {faker} from "@faker-js/faker"
import dayjs from "dayjs"

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  createdAt: string
  lastVisitedAt: string
  role: string
  username: string
  visitCount: number
}

export interface UserColumnMeta {
  filterLabel?: string
}

export const userColumns: ColumnDef<User, any, UserColumnMeta>[] = [
  {
    accessorKey: "username",
    header: "Username",
    id: "username",
    meta: {
      filterLabel: "Search by username",
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    meta: {
      filterLabel: "Filter by role",
    },
    size: 120,
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
    meta: {
      filterLabel: "Filter by account status",
    },
    minSize: 170,
  },
  {
    accessorKey: "createdAt",
    enableColumnFilter: false,
    header: "Account Created On",
    id: "createdAt",
    minSize: 205,
  },
  {
    accessorKey: "lastVisitedAt",
    enableColumnFilter: false,
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
    meta: {
      filterLabel: "Filter by visit count",
    },
  },
]

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

function newUser(): User {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const createdAt = faker.date.between({from: "01/01/2024", to: "10/30/2025"})
  const lastVisited = faker.date.between({from: createdAt, to: "10/30/2025"})
  return {
    accountStatus: faker.helpers.arrayElement([
      "active",
      "suspended",
      "pending",
    ]),
    createdAt: `${dayjs(createdAt).format("DD MMM YYYY HH:mm:ss")} PDT`,
    lastVisitedAt: `${dayjs(lastVisited).format("DD MMM YYYY HH:mm:ss")} PDT`,
    role: faker.helpers.arrayElement(["admin", "user", "moderator"]),
    username: faker.internet.username({firstName, lastName}),
    visitCount: faker.number.int({max: 999, min: 1}),
  }
}

export function makeUserData(...lens: number[]) {
  const makeDataLevel = (depth = 0): User[] => {
    const len = lens[depth]
    return range(len).map((): User => {
      return newUser()
    })
  }

  return makeDataLevel()
}

const totalCount: number = 10005

let cache: User[] = []

export interface FetchOptions {
  columnFilters: ColumnFiltersState
  globalFilter: string
  pageIndex: number
  pageSize: number
  sorting: SortingState
}

export interface FetchResult {
  availableFilters: Record<string, string[]>
  pageCount: number
  totalUsers: number
  users: User[]
}

function filterUser(user: User, filters: ColumnFiltersState): boolean {
  for (const filter of filters) {
    const value = user[filter.id as keyof User]
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

function filterUserGlobal(user: User, globalFilter: string): boolean {
  if (!globalFilter) {
    return true
  }
  const searchLower = globalFilter.toLowerCase()
  return Object.values(user).some((value) =>
    String(value).toLowerCase().includes(searchLower),
  )
}

const dateColumns = new Set(["createdAt", "lastVisitedAt"])

function sortUsers(users: User[], sorting: SortingState): User[] {
  if (sorting.length === 0) {
    return users
  }

  return [...users].sort((a, b) => {
    for (const sort of sorting) {
      const aValue = a[sort.id as keyof User]
      const bValue = b[sort.id as keyof User]

      let comparison = 0
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue
      } else if (dateColumns.has(sort.id)) {
        const aDate = dayjs(String(aValue), "DD MMM YYYY HH:mm:ss")
        const bDate = dayjs(String(bValue), "DD MMM YYYY HH:mm:ss")
        comparison = aDate.valueOf() - bDate.valueOf()
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }

      if (comparison !== 0) {
        return sort.desc ? -comparison : comparison
      }
    }
    return 0
  })
}

export async function fetchData(options: FetchOptions): Promise<FetchResult> {
  if (!cache.length) {
    cache = makeUserData(totalCount)
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Apply filters
  let filteredData = cache

  if (options.globalFilter) {
    filteredData = filteredData.filter((user) =>
      filterUserGlobal(user, options.globalFilter),
    )
  }

  if (options.columnFilters.length > 0) {
    filteredData = filteredData.filter((user) =>
      filterUser(user, options.columnFilters),
    )
  }

  // Apply sorting
  if (options.sorting.length > 0) {
    filteredData = sortUsers(filteredData, options.sorting)
  }

  const filteredCount = filteredData.length

  return {
    // simulate available filters
    availableFilters: {
      accountStatus: ["active", "suspended", "pending"],
      role: ["admin", "user", "moderator"],
    },
    pageCount: Math.ceil(filteredCount / options.pageSize),
    totalUsers: filteredCount,
    users: filteredData.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize,
    ),
  }
}
