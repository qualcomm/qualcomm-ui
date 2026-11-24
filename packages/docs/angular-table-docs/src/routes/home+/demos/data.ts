import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"
import dayjs from "dayjs"

import type {ColumnDef, Row} from "@qualcomm-ui/core/table"

import {PinCell} from "./pin-cell"
import {PinHeader} from "./pin-header"
import {UsernameCell} from "./username-cell"

export interface User {
  accountStatus: string
  createdAt: string
  lastVisitedAt: string
  role: string
  subRows?: User[]
  username: string
  visitCount: number
}

/**
 * Dates are formatted strings, so the default alphanumeric sort would order them
 * lexically.
 */
function sortByDate(rowA: Row<User>, rowB: Row<User>, columnId: string) {
  const valueA: string = rowA.getValue(columnId)
  const valueB: string = rowB.getValue(columnId)
  return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
}

export const userColumns: ColumnDef<User, any>[] = [
  {
    cell: () => PinCell,
    header: () => PinHeader,
    id: "pin",
  },
  {
    accessorKey: "username",
    cell: () => UsernameCell,
    header: "Username",
    id: "username",
    minSize: 250,
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    minSize: 135,
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
  },
  {
    accessorKey: "createdAt",
    header: "Account Created On",
    id: "createdAt",
    minSize: 205,
    sortingFn: sortByDate,
  },
  {
    accessorKey: "lastVisitedAt",
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
    sortingFn: sortByDate,
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
  },
]

export function createUserQuery(
  ...dimensions: number[]
): CreateQueryResult<User[], Error> {
  // [!code hide]
  const isInitialLoad = signal(true)
  return injectQuery<User[]>(() => ({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({
          size: dimensions,
          // [!code hide]
          timestamp: isInitialLoad() ? 0 : Date.now(),
        }),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      // [!code hide]
      isInitialLoad.set(false)
      return data
    },
    queryKey: ["mock-user-data", "kitchen-sink", dimensions],
    refetchOnWindowFocus: false,
  }))
}
