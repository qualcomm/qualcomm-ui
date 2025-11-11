import {useQuery} from "@tanstack/react-query"

export interface User {
  accountStatus: string
  companyName: string
  createdAt: string
  lastVisitedAt: string
  role: string
  username: string
  visitCount: number
}

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
