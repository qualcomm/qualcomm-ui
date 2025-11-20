import {useState} from "react"

import {useQuery} from "@tanstack/react-query"

import {Combobox} from "@qualcomm-ui/react/combobox"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {useAsyncListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

interface Starship {
  name: string
  url: string
}

export function ComboboxAsyncDemo() {
  const {data, isFetching} = useQuery({
    queryFn: async () => {
      return fetch("https://www.swapi.tech/api/starships?page=1&limit=100", {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
    },
    queryKey: ["SWAPI-people"],
    refetchOnWindowFocus: false,
  })

  const {contains} = useFilter({sensitivity: "base"})

  const [inputValue, setInputValue] = useState<string>("")

  const {collection} = useAsyncListCollection<Starship>({
    filter: contains,
    filterText: inputValue,
    itemLabel: (item) => item.name,
    items: data?.results,
    itemValue: (item) => item.url,
  })

  return (
    // preview
    <Combobox
      className="w-56"
      collection={collection}
      icon={isFetching ? <ProgressRing size="xs" /> : undefined}
      inputValue={inputValue}
      label="Starship"
      onInputValueChange={(details) => setInputValue(details.inputValue)}
      placeholder="Search for a starship"
    />
    // preview
  )
}
