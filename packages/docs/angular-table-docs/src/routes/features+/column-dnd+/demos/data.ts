import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

import {type ColumnDef, createColumnHelper} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  companyName: string
  lastVisitedAt: string
  role: string
  userId: string
  username: string
  visitCount: number
}

const columnHelper = createColumnHelper<User>()

export const userColumns: ColumnDef<User, any>[] = [
  columnHelper.accessor("username", {
    header: "Username",
    id: "username",
    minSize: 200,
  }),
  columnHelper.accessor("accountStatus", {
    header: "Account Status",
    id: "accountStatus",
  }),
  columnHelper.accessor("role", {
    header: "Role",
    id: "role",
    minSize: 180,
  }),
  columnHelper.accessor("averageSessionDuration", {
    header: "Avg Session Duration",
    id: "averageSessionDuration",
  }),
  columnHelper.accessor("companyName", {
    header: "Company Name",
    id: "companyName",
    minSize: 220,
  }),
  columnHelper.accessor("lastVisitedAt", {
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
  }),
  columnHelper.accessor("visitCount", {
    header: "Visit Count",
    id: "visitCount",
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
