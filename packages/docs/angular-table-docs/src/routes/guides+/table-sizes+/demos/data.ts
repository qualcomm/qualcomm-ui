import {createColumnHelper} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  country: string
  lastVisitedAt: string
  role: string
  username: string
}

const columnHelper = createColumnHelper<User>()

export const userColumns = [
  columnHelper.accessor("username", {
    cell: (info) => info.getValue(),
    header: () => "Username",
  }),
  columnHelper.accessor((row) => row.accountStatus, {
    cell: (info) => info.getValue(),
    header: "Account Status",
  }),
  columnHelper.accessor("country", {
    cell: (info) => info.getValue(),
    header: "Country",
  }),
  columnHelper.accessor("lastVisitedAt", {
    header: "Last Visited",
  }),
  columnHelper.accessor("role", {
    header: "Role",
  }),
  columnHelper.accessor("averageSessionDuration", {
    header: "Avg Session Duration",
  }),
]

export const userData: User[] = [
  {
    accountStatus: "active",
    averageSessionDuration: 12,
    country: "US",
    lastVisitedAt: "02 Sep 2026 07:21:43 PDT",
    role: "user",
    username: "john_pond1",
  },
  {
    accountStatus: "suspended",
    averageSessionDuration: 35,
    country: "US",
    lastVisitedAt: "02 Oct 2026 08:52:36 PDT",
    role: "user",
    username: "anne.m15",
  },
  {
    accountStatus: "pending",
    averageSessionDuration: 0,
    country: "US",
    lastVisitedAt: "19 Mar 2026 04:55:19 PDT",
    role: "admin",
    username: "joe_dirte",
  },
]
