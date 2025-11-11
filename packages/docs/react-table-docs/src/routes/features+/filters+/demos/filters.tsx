import type {Column, TableInstance} from "@qualcomm-ui/core/table"
import {NumberInput} from "@qualcomm-ui/react/number-input"
import {TextInput} from "@qualcomm-ui/react/text-input"

import type {User} from "./use-data"

interface TableColumnFilterProps {
  column: Column<User>
  table: TableInstance<User>
}

export function TableColumnFilter({column, table}: TableColumnFilterProps) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  return typeof firstValue === "number" ? (
    <MinMaxNumberFilter column={column} table={table} />
  ) : (
    <TextInput
      className="w-32"
      onValueChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      size="sm"
      value={(column.getFilterValue() as string) ?? ""}
    />
  )
}

export function MinMaxNumberFilter({column}: TableColumnFilterProps) {
  const columnFilterValue = column.getFilterValue() as [number, number]

  const [min, max] = columnFilterValue ?? [0, 0]

  return (
    <div className="flex w-32 gap-2">
      <NumberInput
        controlProps={{hidden: true}}
        min={0}
        onValueChange={({valueAsNumber}) =>
          column.setFilterValue((old: [number, number]) => [
            valueAsNumber,
            old?.[1],
          ])
        }
        placeholder="Min"
        size="sm"
        value={min ? `${min}` : ""}
      />
      <NumberInput
        controlProps={{hidden: true}}
        max={130}
        onValueChange={({valueAsNumber}) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            valueAsNumber,
          ])
        }
        placeholder="Max"
        size="sm"
        value={max ? `${max}` : ""}
      />
    </div>
  )
}
