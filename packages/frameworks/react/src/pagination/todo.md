Create codemod:

### @qualcomm-ui/react

Adjusted props:

- `defaultRowsPerPage` -> `defaultPageSize`
- `hideNextButton` -> removed. Declaratively render the `Pagination.NextTrigger` to hide/show this element.
- `hidePageLinks` -> removed. Declaratively render the `Pagination.PageItems` to hide/show the page links.
- `hidePrevButton` -> removed. Declaratively render the `Pagination.PrevTrigger` to hide/show this element.
- `onChange` -> `onPageChange`
- `onRowsPerPageChange` -> `onPageSizeChange`
- `pageMetadataPlacement` -> removed. The placement is now determined by the location of the element in the DOM
- `renderPageMeta` -> removed. Use `Pagination.PageMetadata` to customize the page metadata.
- `rowsPerPage` -> renamed to `pageSize`
- `rowsPerPageLabel` -> removed. Use the `Pagination.PageSizeLabel` composition
- `rowsPerPageOptions` -> removed. Use the `Pagination.PageSize`.`pageSizeOptions` prop
- `rowsPerPagePlacement` -> removed. The placement is now determined by the location of the element in the DOM
- `totalRows` -> renamed to `count`

Renamed types (drop Q prefix) and migrated to `@qualcomm-ui/core`:

- QPaginationPageChangeReason
- QRowsPerPageChangeDetails
- QPageChangeDetails

### @qualcomm-ui/base

Renamed and migrated to `@qualcomm-ui/core/pagination`:

- QPaginationPageLinks -> PaginationPageItem

data structure modified from

```ts
export type QPaginationPageLink =
  | {
      active?: boolean
      label: string
      page: number
    }
  | "separator"
```

to:

```ts
export type QPaginationPageLink =
  | {
      active?: boolean
      label: string
      page: number
      type: "page"
    }
  | {
      type: "separator"
    }
```

---
