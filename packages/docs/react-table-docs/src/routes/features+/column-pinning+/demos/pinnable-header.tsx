import {ChevronLeft, ChevronRight, X} from "lucide-react"

import type {Header} from "@qualcomm-ui/core/table"
import {flexRender, Table} from "@qualcomm-ui/react/table"

import type {User} from "./use-data"

interface Props {
  header: Header<User, unknown>
}

export function PinnableHeader({header}: Props) {
  const pinned = header.column.getIsPinned()
  const isPinnedLeft = pinned === "left"
  const isPinnedRight = pinned === "right"

  const pinnedNode = pinned ? (
    <Table.ColumnHeaderAction
      icon={X}
      onClick={() => {
        header.column.pin(false)
      }}
    />
  ) : null

  return (
    <Table.HeaderCell
      align="center"
      colSpan={header.colSpan}
      style={{width: header.getSize()}}
    >
      {!header.isPlaceholder && header.column.getCanPin() && (
        <div className="flex items-center justify-center gap-2">
          {!isPinnedLeft ? (
            <Table.ColumnHeaderAction
              aria-label="Pin Left"
              icon={ChevronLeft}
              onClick={() => {
                header.column.pin("left")
              }}
            />
          ) : null}

          {isPinnedLeft && pinnedNode}

          {flexRender(header.column.columnDef.header, header.getContext())}

          {isPinnedRight && pinnedNode}

          {!isPinnedRight ? (
            <Table.ColumnHeaderAction
              aria-label="Pin Right"
              icon={ChevronRight}
              onClick={() => {
                header.column.pin("right")
              }}
            />
          ) : null}
        </div>
      )}
    </Table.HeaderCell>
  )
}
