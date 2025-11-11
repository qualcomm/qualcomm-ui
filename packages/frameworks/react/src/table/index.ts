import {TableActionBar, type TableActionBarProps} from "./table-action-bar"
import {TableBody, type TableBodyProps} from "./table-body"
import {TableCell, type TableCellProps} from "./table-cell"
import {TableCellAction, type TableCellActionProps} from "./table-cell-action"
import {
  TableColumnDragHandle,
  type TableColumnDragHandleProps,
} from "./table-column-drag-handle"
import {
  TableColumnDragPreview,
  type TableColumnDragPreviewProps,
} from "./table-column-drag-preview"
import {
  TableColumnDropIndicator,
  type TableColumnDropIndicatorProps,
} from "./table-column-drop-indicator"
import {
  TableColumnFilterAction,
  type TableColumnFilterActionProps,
} from "./table-column-filter-action"
import {
  TableColumnHeaderAction,
  type TableColumnHeaderActionProps,
} from "./table-column-header-action"
import {TableColumnResizeHandle} from "./table-column-resize-handle"
import {
  TableColumnSortAction,
  type TableColumnSortActionProps,
} from "./table-column-sort-action"
import {TableFooter, type TableFooterProps} from "./table-footer"
import {TableHeader, type TableHeaderProps} from "./table-header"
import {TableHeaderCell, type TableHeaderCellProps} from "./table-header-cell"
import {TablePagination, type TablePaginationProps} from "./table-pagination"
import {TableRoot, type TableRootProps} from "./table-root"
import {TableRow, type TableRowProps} from "./table-row"
import {
  TableRowDragHandle,
  type TableRowDragHandleProps,
} from "./table-row-drag-handle"
import {
  TableRowDragPreview,
  type TableRowDragPreviewProps,
} from "./table-row-drag-preview"
import {
  TableRowDropIndicator,
  type TableRowDropIndicatorProps,
} from "./table-row-drop-indicator"
import {
  TableRowExpandButton,
  type TableRowExpandButtonProps,
} from "./table-row-expand-button"
import {
  TableScrollContainer,
  type TableScrollContainerProps,
} from "./table-scroll-container"
import {TableTable, type TableTableProps} from "./table-table"
import {TableTitleBar, type TableTitleBarProps} from "./table-title-bar"

export * from "./dynamic-render"
export * from "./qds-table-context"
export * from "./use-react-table"
export * from "./use-table-pagination"

export type {
  TableActionBarProps,
  TableBodyProps,
  TableCellActionProps,
  TableCellProps,
  TableColumnDragHandleProps,
  TableColumnDragPreviewProps,
  TableColumnDropIndicatorProps,
  TableColumnFilterActionProps,
  TableColumnHeaderActionProps,
  TableColumnSortActionProps,
  TableFooterProps,
  TableHeaderCellProps,
  TableHeaderProps,
  TablePaginationProps,
  TableRootProps,
  TableRowDragHandleProps,
  TableRowDragPreviewProps,
  TableRowDropIndicatorProps,
  TableRowExpandButtonProps,
  TableRowProps,
  TableScrollContainerProps,
  TableTableProps,
  TableTitleBarProps,
}

type TableComponent = {
  /**
   * Container for action buttons, filters, and other controls displayed at the top
   * of the table. Renders a `<div>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Root>
   *   <Table.ActionBar>
   *     ...
   *   </Table.ActionBar>
   *   <Table.ScrollContainer>
   *     <Table.Table>...</Table.Table>
   *   </Table.ScrollContainer>
   * </Table.Root>
   * ```
   */
  ActionBar: typeof TableActionBar
  /**
   * The table body section containing data rows. Renders a `<tbody>` element by
   * default.
   *
   * @example
   * ```tsx
   * <Table.Table>
   *   <Table.Body>
   *     <Table.Row>
   *       <Table.Cell>
   *       </Table.Cell>
   *     </Table.Row>
   *   </Table.Body>
   * </Table.Table>
   * ```
   */
  Body: typeof TableBody
  /**
   * A data cell within a table row. Renders a `<td>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Body>
   *   <Table.Row>
   *     <Table.Cell>...</Table.Cell>
   *   </Table.Row>
   * </Table.Body>
   * ```
   */
  Cell: typeof TableCell
  /**
   * An action button displayed within a table cell. Renders a `<button>` element by
   * default.
   */
  CellAction: typeof TableCellAction
  /**
   * A drag handle button for reordering columns via drag-and-drop. Renders a
   * `<button>` element by default.
   */
  ColumnDragHandle: typeof TableColumnDragHandle
  /**
   * Preview element displayed when dragging a column. Renders content in a portal.
   */
  ColumnDragPreview: typeof TableColumnDragPreview
  /**
   * Visual indicator displayed when a column is being dragged over a drop zone.
   * Renders a `<div>` element by default.
   */
  ColumnDropIndicator: typeof TableColumnDropIndicator
  /**
   * An action button for opening a column filter menu or interface. Renders a
   * `<button>` element by default.
   */
  ColumnFilterAction: typeof TableColumnFilterAction
  /**
   * A general-purpose action button within a column header. Renders a `<button>`
   * element by default.
   */
  ColumnHeaderAction: typeof TableColumnHeaderAction
  /**
   * A handle button for resizing columns. Renders a `<button>` element by default.
   */
  ColumnResizeHandle: typeof TableColumnResizeHandle
  /**
   * An action button for sorting a column. Automatically displays the appropriate
   * sort icon based on the column's sort state. Renders a `<button>` element by
   * default.
   */
  ColumnSortAction: typeof TableColumnSortAction
  /**
   * The table footer section. Renders a `<tfoot>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Table>
   *   <Table.Header>...</Table.Header>
   *   <Table.Body>...</Table.Body>
   *   <Table.Footer>
   *     <Table.Row>
   *       <Table.Cell>...</Table.Cell>
   *     </Table.Row>
   *   </Table.Footer>
   * </Table.Table>
   * ```
   */
  Footer: typeof TableFooter
  /**
   * The table header section containing column headers. Renders a `<thead>` element
   * by default.
   *
   * @example
   * ```tsx
   * <Table.Table>
   *   <Table.Header>
   *     <Table.Row>
   *       <Table.HeaderCell>
   *         ...
   *       </Table.HeaderCell>
   *     </Table.Row>
   *   </Table.Header>
   * </Table.Table>
   * ```
   */
  Header: typeof TableHeader
  /**
   * A header cell within the header row. Renders a `<th>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Header>
   *   <Table.Row>
   *     {headerGroup.headers.map((header) => (
   *       <Table.HeaderCell key={header.id}>
   *         {flexRender(header.column.columnDef.header, header.getContext())}
   *       </Table.HeaderCell>
   *     ))}
   *   </Table.Row>
   * </Table.Header>
   * ```
   */
  HeaderCell: typeof TableHeaderCell
  /**
   * Wrapper for pagination controls. This is a convenience component that wraps
   * `Pagination.Root` with table-specific styling and bindings.
   *
   * @example
   * ```tsx
   * import {Pagination} from "@qualcomm-ui/react/pagination"
   * import {useTablePagination, Table} from "@qualcomm-ui/react/table"
   *
   * const paginationProps = useTablePagination(table)
   *
   * <Table.Root>
   *   <Table.ScrollContainer>...</Table.ScrollContainer>
   *   <Table.Pagination {...paginationProps}>
   *     <Pagination.PageMetadata>
   *       {({pageStart, pageEnd, count}) => `${pageStart}-${pageEnd} of ${count}`}
   *     </Pagination.PageMetadata>
   *     <Pagination.PageButtons />
   *   </Table.Pagination>
   * </Table.Root>
   * ```
   */
  Pagination: typeof TablePagination
  /**
   * The root element that wraps the table. Renders a `<div>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Root>
   *   <Table.ActionBar>...</Table.ActionBar>
   *   <Table.ScrollContainer>
   *     <Table.Table>...</Table.Table>
   *   </Table.ScrollContainer>
   *   <Table.Pagination {...paginationProps}>
   *     // pagination controls
   *   </Table.Pagination>
   * </Table.Root>
   * ```
   */
  Root: typeof TableRoot
  /**
   * A table row. Renders a `<tr>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Body>
   *   {table.getRowModel().rows.map((row) => (
   *     <Table.Row key={row.id} isSelected={row.getIsSelected()}>
   *       {row.getVisibleCells().map((cell) => (
   *         <Table.Cell key={cell.id}>...</Table.Cell>
   *       ))}
   *     </Table.Row>
   *   ))}
   * </Table.Body>
   * ```
   */
  Row: typeof TableRow
  /**
   * A drag handle button for reordering rows via drag-and-drop. Renders a `<button>`
   * element by default.
   */
  RowDragHandle: typeof TableRowDragHandle
  /**
   * Preview element displayed when dragging a row. Renders content in a portal.
   */
  RowDragPreview: typeof TableRowDragPreview
  /**
   * Visual indicator displayed when a row is being dragged over a drop zone. Renders
   * a `<div>` element by default.
   */
  RowDropIndicator: typeof TableRowDropIndicator
  /**
   * A button for expanding and collapsing nested rows. Automatically displays the
   * appropriate icon based on the row's expansion state. Renders a `<button>`
   * element by default.
   */
  RowExpandButton: typeof TableRowExpandButton
  /**
   * A scrollable container that wraps the table element. Renders a `<div>` element
   * by default.
   *
   * @example
   * ```tsx
   * <Table.Root>
   *   <Table.ScrollContainer>
   *     <Table.Table>
   *       <Table.Header>...</Table.Header>
   *       <Table.Body>...</Table.Body>
   *     </Table.Table>
   *   </Table.ScrollContainer>
   * </Table.Root>
   * ```
   */
  ScrollContainer: typeof TableScrollContainer
  /**
   * The actual table element. Renders a `<table>` element by default.
   *
   * @example
   * ```tsx
   * <Table.Root>
   *   <Table.ScrollContainer>
   *     <Table.Table>
   *       <Table.Header>...</Table.Header>
   *       <Table.Body>...</Table.Body>
   *       <Table.Footer>...</Table.Footer>
   *     </Table.Table>
   *   </Table.ScrollContainer>
   * </Table.Root>
   * ```
   */
  Table: typeof TableTable
  /**
   * A title bar displayed at the top of the table. Renders a `<div>` element by
   * default.
   *
   * @example
   * ```tsx
   * <Table.Root>
   *   <Table.TitleBar>
   *     <h2>Users</h2>
   *   </Table.TitleBar>
   *   <Table.ScrollContainer>
   *     <Table.Table>...</Table.Table>
   *   </Table.ScrollContainer>
   * </Table.Root>
   * ```
   */
  TitleBar: typeof TableTitleBar
}

export const Table: TableComponent = {
  ActionBar: TableActionBar,
  Body: TableBody,
  Cell: TableCell,
  CellAction: TableCellAction,
  ColumnDragHandle: TableColumnDragHandle,
  ColumnDragPreview: TableColumnDragPreview,
  ColumnDropIndicator: TableColumnDropIndicator,
  ColumnFilterAction: TableColumnFilterAction,
  ColumnHeaderAction: TableColumnHeaderAction,
  ColumnResizeHandle: TableColumnResizeHandle,
  ColumnSortAction: TableColumnSortAction,
  Footer: TableFooter,
  Header: TableHeader,
  HeaderCell: TableHeaderCell,
  Pagination: TablePagination,
  Root: TableRoot,
  Row: TableRow,
  RowDragHandle: TableRowDragHandle,
  RowDragPreview: TableRowDragPreview,
  RowDropIndicator: TableRowDropIndicator,
  RowExpandButton: TableRowExpandButton,
  ScrollContainer: TableScrollContainer,
  Table: TableTable,
  TitleBar: TableTitleBar,
}
