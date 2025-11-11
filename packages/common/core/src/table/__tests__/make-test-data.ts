import {faker} from "@faker-js/faker"

import {type ColumnDef, createColumnHelper} from "../"

export type Person = {
  age: number
  firstName: string
  lastName: string
  progress: number
  status: "relationship" | "complicated" | "single"
  subRows?: Person[]
  visits: number
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    age: faker.number.int(40),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person["status"]>([
      "relationship",
      "complicated",
      "single",
    ])[0],
    visits: faker.number.int(1000),
  }
}

export function makeData(...lens: number[]): Person[] {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]
    return range(len).map((): Person => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

export type PersonKeys = keyof Person
export type PersonColumn = ColumnDef<
  Person,
  string | number | Person[] | undefined
>

export function generateColumns(people: Person[]): PersonColumn[] {
  const columnHelper = createColumnHelper<Person>()
  const person = people[0]
  return Object.keys(person).map((key) => {
    const typedKey = key as PersonKeys
    return columnHelper.accessor(typedKey, {id: typedKey})
  })
}
