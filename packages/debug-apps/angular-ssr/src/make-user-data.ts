import {faker} from "@faker-js/faker"

export function makeUserData(count: number) {
  return faker.helpers.uniqueArray(faker.internet.username, count).sort()
}
