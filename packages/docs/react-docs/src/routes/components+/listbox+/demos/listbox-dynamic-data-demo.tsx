import {useEffect, useState, type ReactElement} from "react"

import {Search} from "lucide-react"

import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"
import {Listbox} from "@qualcomm-ui/react/listbox"

interface Region {
  description: string
  label: string
  value: string
}

const regions: Region[] = [
  {
    description: "Germany",
    label: "Frankfurt",
    value: "frankfurt",
  },
  {
    description: "United States",
    label: "Oregon",
    value: "oregon",
  },
  {
    description: "Singapore",
    label: "Singapore",
    value: "singapore",
  },
  {
    description: "Australia",
    label: "Sydney",
    value: "sydney",
  },
  {
    description: "Japan",
    label: "Tokyo",
    value: "tokyo",
  },
  {
    description: "United States",
    label: "Virginia",
    value: "virginia",
  },
]

function fetchRegions(): Promise<Region[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(regions)
    }, 800)
  })
}

export function ListboxDynamicDataDemo(): ReactElement {
  const [loading, setLoading] = useState(true)
  const {fuzzyContains} = useFilter({sensitivity: "base"})
  const {collection, filter, set} = useListCollection<Region>({
    filter: fuzzyContains,
    initialItems: [],
    itemLabel: (region) => `${region.label} ${region.description}`,
    itemValue: (region) => region.value,
  })

  useEffect(() => {
    let mounted = true

    fetchRegions().then((items) => {
      if (!mounted) {
        return
      }
      set(items)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [set])

  const status = loading
    ? "Loading regions..."
    : collection.items.length === 0
      ? "No regions found"
      : null

  return (
    <div className="w-full max-w-sm">
      {/* preview */}
      <Listbox.Root collection={collection} selectionMode="single">
        <Listbox.Input
          className="mb-4"
          label="Filter regions"
          onValueChange={filter}
          placeholder="Search regions"
          startIcon={Search}
        />
        <Listbox.Label>Deployment region</Listbox.Label>
        <Listbox.Content
          aria-busy={loading}
          className="max-h-64 overflow-y-auto"
        >
          {collection.items.map((region) => (
            <Listbox.Item key={region.value} item={region}>
              <Listbox.ItemControl />
              <Listbox.ItemLabel>{region.label}</Listbox.ItemLabel>
              <Listbox.ItemDescription>
                {region.description}
              </Listbox.ItemDescription>
            </Listbox.Item>
          ))}
        </Listbox.Content>
      </Listbox.Root>
      {status ? (
        <p className="text-muted-foreground mt-2 text-sm" role="status">
          {status}
        </p>
      ) : null}
      {/* preview */}
    </div>
  )
}
