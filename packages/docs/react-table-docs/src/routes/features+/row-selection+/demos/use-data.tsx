import {useQuery} from "@tanstack/react-query"
import dayjs from "dayjs"

import type {ColumnDef} from "@qualcomm-ui/core/table"
import {Checkbox} from "@qualcomm-ui/react/checkbox"

export interface User {
  accountStatus: string
  createdAt: string
  lastVisitedAt: string
  role: string
  username: string
  visitCount: number
}

export const userColumns: ColumnDef<User>[] = [
  {
    cell: ({row}) => {
      const indeterminate = row.getIsSomeSelected()
      const checked = row.getIsSelected() && !indeterminate
      return (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onCheckedChange={(checked) => row.toggleSelected(checked)}
          size="sm"
        />
      )
    },
    header: ({table}) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
        size="sm"
      />
    ),
    id: "select",
  },
  {
    accessorKey: "username",
    header: "Username",
    id: "username",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    size: 120,
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
    // we override this column's default sorting function for compatibility with
    // formatted date strings.
    sortingFn: (rowA, rowB, columnId) => {
      const valueA: string = rowA.getValue(columnId)
      const valueB: string = rowB.getValue(columnId)
      return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
    },
  },
  {
    accessorKey: "lastVisitedAt",
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
    // we override this column's default sorting function for compatibility with
    // formatted date strings.
    sortingFn: (rowA, rowB, columnId) => {
      const valueA: string = rowA.getValue(columnId)
      const valueB: string = rowB.getValue(columnId)
      return dayjs(valueA).isAfter(dayjs(valueB)) ? 1 : -1
    },
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
  },
]

export function useUserData(...dimensions: number[]) {
  return useQuery({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({size: dimensions}),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      return data
    },
    queryKey: ["mockUserData", dimensions],
    refetchInterval: false,
    refetchOnMount: false,
  })
}
