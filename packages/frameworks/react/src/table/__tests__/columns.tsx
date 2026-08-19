import type {ColumnDef} from "@qualcomm-ui/core/table"

import type {GuideUser} from "./fixtures.js"

export function createGuideColumns(): ColumnDef<GuideUser>[] {
  return [
    {
      accessorKey: "name",
      cell: (info) => String(info.getValue()),
      header: "Name",
      id: "name",
    },
    {
      accessorKey: "team",
      cell: (info) => String(info.getValue()),
      header: "Team",
      id: "team",
    },
    {
      accessorKey: "role",
      cell: (info) => String(info.getValue()),
      header: "Role",
      id: "role",
    },
    {
      accessorKey: "status",
      cell: (info) => String(info.getValue()),
      header: "Status",
      id: "status",
    },
    {
      accessorKey: "visits",
      cell: (info) => String(info.getValue()),
      header: "Visits",
      id: "visits",
    },
    {
      accessorKey: "rank",
      cell: (info) => {
        const rank = info.getValue() as string
        return rank === undefined ? "Unranked" : String(rank)
      },
      header: "Rank",
      id: "rank",
    },
  ]
}
