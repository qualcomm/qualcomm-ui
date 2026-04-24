import {useMemo} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import type {Column, ColumnFiltersState} from "@qualcomm-ui/core/table"
import {InputLabel} from "@qualcomm-ui/react/input"
import {NumberInput} from "@qualcomm-ui/react/number-input"
import {Select} from "@qualcomm-ui/react/select"
import {TextInput} from "@qualcomm-ui/react/text-input"

import type {User, UserColumnMeta} from "./use-data"

function getFilterValue(columnFilters: ColumnFiltersState, columnId: string) {
  return columnFilters.find((f) => f.id === columnId)?.value
}

function setFilterValue(
  columnFilters: ColumnFiltersState,
  columnId: string,
  value: unknown,
): ColumnFiltersState {
  const existing = columnFilters.find((f) => f.id === columnId)

  // Remove filter if value is empty
  if (
    value === undefined ||
    value === "" ||
    (Array.isArray(value) &&
      value.every(
        (v) =>
          v === undefined || v === 0 || (typeof v === "number" && isNaN(v)),
      ))
  ) {
    return columnFilters.filter((f) => f.id !== columnId)
  }

  if (existing) {
    return columnFilters.map((f) => (f.id === columnId ? {...f, value} : f))
  }

  return [...columnFilters, {id: columnId, value}]
}

interface TableColumnFilterProps {
  availableFilters?: Record<string, string[]>
  column: Column<User, any, UserColumnMeta>
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: (filters: ColumnFiltersState) => void
}

export function TableColumnFilter({
  availableFilters,
  column,
  columnFilters,
  onColumnFiltersChange,
}: TableColumnFilterProps) {
  const isNumericColumn = column.id === "visitCount"
  const filterOptions = availableFilters?.[column.id]

  const collection = useMemo(
    () => (filterOptions ? selectCollection({items: filterOptions}) : null),
    [filterOptions],
  )

  if (isNumericColumn) {
    return (
      <MinMaxNumberFilter
        column={column}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
      />
    )
  }

  if (collection) {
    const filterValue = getFilterValue(columnFilters, column.id) as string
    return (
      <Select
        className="w-32"
        collection={collection}
        controlProps={{"aria-label": `Filter ${column.id}`}}
        label={column.columnDef.meta?.filterLabel}
        onValueChange={(details) =>
          onColumnFiltersChange(
            setFilterValue(columnFilters, column.id, details[0] ?? ""),
          )
        }
        placeholder="All"
        portalProps={{disabled: true}}
        size="sm"
        value={filterValue ? [filterValue] : []}
      />
    )
  }

  return (
    <TextInput
      className="w-32"
      label={column.columnDef.meta?.filterLabel}
      onValueChange={(value) =>
        onColumnFiltersChange(setFilterValue(columnFilters, column.id, value))
      }
      placeholder="Search..."
      size="sm"
      value={(getFilterValue(columnFilters, column.id) as string) ?? ""}
    />
  )
}

export function MinMaxNumberFilter({
  column,
  columnFilters,
  onColumnFiltersChange,
}: TableColumnFilterProps) {
  const filterValue = getFilterValue(columnFilters, column.id) as
    | [number, number]
    | undefined

  const [min, max] = filterValue ?? [0, 0]

  const filterLabel = column.columnDef.meta?.filterLabel

  return (
    <div className="flex flex-col gap-1">
      {filterLabel ? <InputLabel>{filterLabel}</InputLabel> : null}
      <div className="flex w-32 gap-2">
        <NumberInput
          aria-label={filterLabel ? `${filterLabel} min range` : "Min range"}
          controlProps={{hidden: true}}
          inputProps={{
            "aria-label": filterLabel
              ? `${filterLabel} min range`
              : "Min range",
          }}
          min={0}
          onValueChange={({valueAsNumber}) =>
            onColumnFiltersChange(
              setFilterValue(columnFilters, column.id, [
                valueAsNumber,
                filterValue?.[1],
              ]),
            )
          }
          placeholder="Min"
          size="sm"
          value={min ? `${min}` : ""}
        />
        <NumberInput
          aria-label={filterLabel ? `${filterLabel} max range` : "Max range"}
          controlProps={{hidden: true}}
          inputProps={{
            "aria-label": filterLabel
              ? `${filterLabel} max range`
              : "Max range",
          }}
          max={999}
          onValueChange={({valueAsNumber}) =>
            onColumnFiltersChange(
              setFilterValue(columnFilters, column.id, [
                filterValue?.[0],
                valueAsNumber,
              ]),
            )
          }
          placeholder="Max"
          size="sm"
          value={max ? `${max}` : ""}
        />
      </div>
    </div>
  )
}
