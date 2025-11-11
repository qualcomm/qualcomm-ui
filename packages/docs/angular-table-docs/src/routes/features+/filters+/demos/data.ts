import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

import type {ColumnDef} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  firstName: string
  lastName: string
  role: string
  username: string
  visitCount: number
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    id: "firstName",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    id: "lastName",
  },
  {
    accessorKey: "username",
    header: "Username",
    id: "username",
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
  },
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
