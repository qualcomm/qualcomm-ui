import {useCallback, useMemo} from "react"

import type {
  SelectApiProps,
  SelectValueChangeDetails,
} from "@qualcomm-ui/core/select"
import type {QdsBrand} from "@qualcomm-ui/react/qds-theme"
import {ListCollection} from "@qualcomm-ui/utils/collection"

interface ThemeOpt {
  id: QdsBrand
  label: string
}

export interface UseQdsDemoThemeProps {
  qdsBrand: QdsBrand
  setQdsBrand: (brand: QdsBrand) => void
}

export interface UseQdsDemoThemeReturn {
  onChange: SelectApiProps["onValueChange"]
  value: string
}

export const themeOptCollection: ListCollection<ThemeOpt> =
  new ListCollection<ThemeOpt>({
    itemLabel: (item) => item.label,
    items: [
      {id: "qualcomm", label: "Qualcomm"},
      {id: "snapdragon", label: "Snapdragon"},
      {id: "dragonwing", label: "Dragonwing"},
    ],
    itemValue: (item) => item.id,
  })

export function useQdsDemoTheme({
  qdsBrand,
  setQdsBrand,
}: UseQdsDemoThemeProps): UseQdsDemoThemeReturn {
  const themeValue = useMemo(
    () => themeOptCollection.find(qdsBrand) ?? themeOptCollection.at(0)!,
    [qdsBrand],
  )

  const onChange: SelectApiProps["onValueChange"] = useCallback(
    (valueStrings: string[], details: SelectValueChangeDetails<ThemeOpt>) => {
      setQdsBrand(details.items[0]?.id ?? "qualcomm")
    },
    [setQdsBrand],
  )

  return {onChange, value: themeValue.id}
}
