import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

import {createColumnHelper} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  companyName: string
  createdAt: string
  lastVisitedAt: string
  role: string
  username: string
  visitCount: number
}

const columnHelper = createColumnHelper<User>()

export const columns = [
  columnHelper.group({
    columns: [
      columnHelper.accessor("username", {
        header: "Username",
      }),
      columnHelper.accessor("companyName", {
        header: "Company Name",
      }),
    ],
    header: () => "User Identification",
    id: "userData",
  }),
  columnHelper.group({
    columns: [
      columnHelper.accessor("lastVisitedAt", {
        header: "Last Visited At",
      }),
      columnHelper.accessor("role", {
        header: "Role",
      }),
      columnHelper.accessor("visitCount", {
        header: "Visit Count",
      }),
      columnHelper.accessor("accountStatus", {
        header: "Account Status",
      }),
    ],
    header: "User Info",
  }),
]

export function createUserQuery(
  ...dimensions: number[]
): CreateQueryResult<User[], Error> {
  // qui-docs::omit-next-line
  const isInitialLoad = signal(true)
  return injectQuery<User[]>(() => ({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({
          size: dimensions,
          // qui-docs::omit-next-line
          timestamp: isInitialLoad() ? 0 : Date.now(),
        }),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      // qui-docs::omit-next-line
      isInitialLoad.set(false)
      return data
    },
    queryKey: ["mock-user-data", dimensions],
    refetchOnWindowFocus: false,
  }))
}
