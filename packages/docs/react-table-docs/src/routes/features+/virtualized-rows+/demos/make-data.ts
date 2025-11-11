import {faker} from "@faker-js/faker"
import dayjs from "dayjs"

export interface User {
  accountStatus: string
  id: number
  lastVisitedAt: string
  role: string
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

function powerDistribution(
  min: number,
  max: number,
  power: number = 3,
): number {
  const random = Math.random()
  const normalized = Math.pow(1 - random, power)
  return Math.floor(min + (max - min) * normalized)
}

function newUser(index: number): User {
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
    id: index,
    lastVisitedAt: `${dayjs(lastVisited).format("DD MMM YYYY HH:mm:ss")} PDT`,
    role: faker.helpers.arrayElement(["admin", "user", "moderator"]),
    username: faker.internet.username({firstName, lastName}),
    visitCount: powerDistribution(2, 500, 5),
  }
}

export function makeUserData(...lens: number[]) {
  const makeDataLevel = (depth = 0): User[] => {
    const len = lens[depth]
    return range(len).map((_value, index): User => {
      return newUser(index + 1)
    })
  }

  return makeDataLevel()
}
