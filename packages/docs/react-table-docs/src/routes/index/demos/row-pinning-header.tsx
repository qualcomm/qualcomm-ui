import {type ReactNode, useContext} from "react"

import {Settings2} from "lucide-react"

import {Menu} from "@qualcomm-ui/react/menu"
import {Table} from "@qualcomm-ui/react/table"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {RowPinningContext} from "./row-pinning-context"

export function RowPinningHeader(): ReactNode {
  const {
    includeLeafRows,
    includeParentRows,
    keepPinnedRows,
    setIncludeLeafRows,
    setIncludeParentRows,
    setKeepPinnedRows,
  } = useContext(RowPinningContext)

  return (
    <div className="flex items-center gap-2">
      <span>Pin</span>
      <Menu.Root size="sm">
        <Menu.Trigger>
          <Table.ColumnHeaderAction
            aria-label="Row pinning settings"
            icon={Settings2}
          />
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.CheckboxItem
                checked={includeParentRows}
                onCheckedChange={(checked) => setIncludeParentRows(checked)}
                value="include-parent-rows"
              >
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>
                  Include Parent Rows When Pinning Child
                </Menu.ItemLabel>
              </Menu.CheckboxItem>

              <Menu.CheckboxItem
                checked={includeLeafRows}
                onCheckedChange={(checked) => setIncludeLeafRows(checked)}
                value="include-leaf-rows"
              >
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>
                  Include Leaf Rows When Pinning Parent
                </Menu.ItemLabel>
              </Menu.CheckboxItem>

              <Menu.CheckboxItem
                checked={keepPinnedRows}
                onCheckedChange={(checked) => setKeepPinnedRows(checked)}
                value="keep-pinned-rows"
              >
                <Menu.CheckboxItemControl />
                <Menu.ItemLabel>
                  Persist Pinned Rows across Pagination and Filtering
                </Menu.ItemLabel>
              </Menu.CheckboxItem>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}
