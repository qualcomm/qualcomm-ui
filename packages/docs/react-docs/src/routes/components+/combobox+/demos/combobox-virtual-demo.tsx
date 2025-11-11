import {useState} from "react"

import {Combobox} from "@qualcomm-ui/react/combobox"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {useAsyncListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {useMockUsers} from "./use-mock-users"

export default function Demo() {
  const {data, isFetching} = useMockUsers(5000)
  const {contains} = useFilter({sensitivity: "base"})

  const [inputValue, setInputValue] = useState<string>("")

  const {collection} = useAsyncListCollection<string>({
    filter: contains,
    filterText: inputValue,
    items: data ?? [],
  })

  return (
    <Combobox
      className="w-56"
      collection={collection}
      icon={isFetching ? <ProgressRing size="xs" /> : undefined}
      inputBehavior="autohighlight"
      inputValue={inputValue}
      label="Users"
      onInputValueChange={(details) => setInputValue(details.inputValue)}
      placeholder="Search for a username"
      virtual
    />
  )
}
