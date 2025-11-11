import {faker} from "@faker-js/faker"
import dayjs from "dayjs"

import type {ColumnDef} from "@qualcomm-ui/core/table"

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
  },
  {
    accessorKey: "lastVisitedAt",
    header: "Last Visited At",
    id: "lastVisitedAt",
    minSize: 205,
  },
  {
    accessorKey: "visitCount",
    header: "Visit Count",
    id: "visitCount",
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

const data = makeUserData(totalCount)

interface FetchOptions {
  /**
   * The zero-based page index to fetch.
   */
  pageIndex: number

  /**
   * The number of rows to fetch per page.
   */
  pageSize: number
}

export interface FetchResult {
  /**
   * The total number of pages, ceil(totalCount / pageSize) to include the final
   * page if partial.
   */
  pageCount: number

  /**
   * The total number of items in the entire dataset.
   */
  totalUsers: number

  /**
   * The paginated results for the requested page, i.e., a subset of the full
   * dataset.
   */
  users: User[]
}

export async function fetchData(options: FetchOptions): Promise<FetchResult> {
  // Simulate some network latency
  await new Promise((r) => setTimeout(r, 500))

  return {
    pageCount: Math.ceil(totalCount / options.pageSize),
    totalUsers: totalCount,
    // simulate a paginated results response
    users: data.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize,
    ),
  }
}
