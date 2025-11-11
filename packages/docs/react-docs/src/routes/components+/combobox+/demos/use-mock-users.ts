import {useQuery} from "@tanstack/react-query"

export interface User {
  username: string
}

export function useMockUsers(count: number) {
  return useQuery<string[]>({
    queryFn: async () => {
      const data = await fetch("/get-mock-user-data", {
        body: JSON.stringify({count}),
        headers: {"Content-Type": "application/json"},
        method: "POST",
      }).then((res) => res.json())
      return data
    },
    queryKey: ["mockUserData", count],
    refetchInterval: false,
    refetchOnMount: false,
  })
}
