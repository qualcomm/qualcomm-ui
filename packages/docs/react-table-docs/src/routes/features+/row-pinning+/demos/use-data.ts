import {useQuery} from "@tanstack/react-query"

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
