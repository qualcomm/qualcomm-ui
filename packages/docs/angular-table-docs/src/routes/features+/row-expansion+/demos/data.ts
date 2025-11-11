import {signal} from "@angular/core"
import {
  type CreateQueryResult,
  injectQuery,
} from "@tanstack/angular-query-experimental"

export interface User {
  accountStatus: string
  averageSessionDuration: number
  companyName: string
  lastVisitedAt: string
  role: string
  subRows?: User[]
  username: string
  visitCount: number
}

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
