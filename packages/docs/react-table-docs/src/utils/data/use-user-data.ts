import {faker} from "@faker-js/faker"
import {useQuery} from "@tanstack/react-query"
import dayjs from "dayjs"

import type {ColumnDef} from "@qualcomm-ui/core/table"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  companyName: string
  country: string
  createdAt: string
  displayName: string
  firstName: string
  lastName: string
  lastVisitedAt: string
  role: string
  subRows?: User[]
  userId: string
  username: string
  visitCount: number
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

function exponentialDuration(
  min: number,
  max: number,
  decay: number = 0.15,
): number {
  const random = Math.random()
  const range = max - min
  return Math.floor(min + range * (1 - Math.exp(-random / decay)))
}

function powerDistribution(
  min: number,
  max: number,
  power: number = 3,
): number {
  const random = Math.random()
  const normalized = Math.pow(1 - random, power)
  return Math.floor(min + (max - min) * normalized)
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
    averageSessionDuration: exponentialDuration(1, 120, 0.15),
    companyName: faker.company.name(),
    country: faker.location.countryCode(),
    createdAt: `${dayjs(createdAt).format("DD MMM YYYY HH:mm:ss")} PDT`,
    displayName: faker.internet.displayName({firstName, lastName}),
    firstName,
    lastName,
    lastVisitedAt: `${dayjs(lastVisited).format("DD MMM YYYY HH:mm:ss")} PDT`,
    role: faker.helpers.arrayElement(["admin", "user", "moderator"]),
    userId: faker.string.uuid(),
    username: faker.internet.username({firstName, lastName}),
    visitCount: powerDistribution(2, 500, 5),
  }
}

export function makeUserData(...lens: number[]) {
  const makeDataLevel = (depth = 0): User[] => {
    const len = lens[depth]
    return range(len).map((): User => {
      return {
        ...newUser(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

export function useUserData(...lengths: number[]) {
  return useQuery({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({size: lengths}),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      return data
    },
    queryKey: ["mockUserData", lengths],
    refetchInterval: false,
    refetchOnMount: false,
  })
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
    id: "username",
  },
  {
    accessorKey: "accountStatus",
    header: "Account Status",
    id: "accountStatus",
  },
  {
    accessorKey: "role",
    header: "Role",
    id: "role",
    minSize: 180,
  },
  {
    accessorKey: "averageSessionDuration",
    header: "Avg Session Duration",
    id: "averageSessionDuration",
  },
  {
    accessorKey: "companyName",
    header: "Company Name",
    id: "companyName",
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
