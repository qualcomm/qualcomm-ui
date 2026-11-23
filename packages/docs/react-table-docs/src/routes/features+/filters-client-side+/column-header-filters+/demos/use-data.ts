import {useQuery} from "@tanstack/react-query"

export interface Device {
  batteryLevel: number
  category: string
  country: string
  enrolledAt: string
  firmware: string
  id: string
  lastSeenAt: string
  model: string
  name: string
  site: string
  status: string
}

export function useDeviceData(size: "10k" | "100k") {
  return useQuery<Device[]>({
    queryFn: async () => {
      const [devices] = await Promise.all([
        fetch(`/data/devices-${size}.json`).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load devices: ${res.status}`)
          }
          return res.json()
        }),
        // simulated network latency
        new Promise((resolve) => setTimeout(resolve, 400)),
      ])
      return devices
    },
    queryKey: ["devices", size],
    staleTime: Infinity,
  })
}
