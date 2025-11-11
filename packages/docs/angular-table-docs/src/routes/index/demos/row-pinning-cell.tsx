import {type ReactNode, useContext} from "react"

import {ArrowDown, ArrowUp, X} from "lucide-react"

import type {CellContext} from "@qualcomm-ui/core/table"
import {Table} from "@qualcomm-ui/react/table"

import type {User} from "../../../utils/data"

import {RowPinningContext} from "./row-pinning-context"

interface Props {
  context: CellContext<User, any>
}

export function RowPinningCell({context}: Props): ReactNode {
  const row = context.row

  const {includeLeafRows, includeParentRows} = useContext(RowPinningContext)

  return (
    <>
      {row.getIsPinned() ? (
        <Table.CellAction
          aria-label="Unpin Row"
          icon={X}
          onClick={() => row.pin(false, includeLeafRows, includeParentRows)}
        />
      ) : (
        <div className="flex gap-1">
          <Table.CellAction
            aria-label="Pin row to top"
            icon={ArrowUp}
            onClick={() => row.pin("top", includeLeafRows, includeParentRows)}
          />
          <Table.CellAction
            aria-label="Pin row to bottom"
            icon={ArrowDown}
            onClick={() =>
              row.pin("bottom", includeLeafRows, includeParentRows)
            }
          />
        </div>
      )}
    </>
  )
}
