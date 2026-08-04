import {
  type ColumnDef,
  createColumnHelper,
  createTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type TableInstance,
  type TableOptions,
  type TableState,
  type Updater,
} from "../"

export type TestPerson = {
  age: number | undefined
  createdAt: Date
  firstName: string
  lastName: string
  progress: number
  rank: number
  status: "single" | "relationship" | "complicated"
  subRows?: TestPerson[]
  tags: string[]
  visits: number
}

const baseTestData: TestPerson[] = [
  {
    age: 31,
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    firstName: "Ada",
    lastName: "Lovelace",
    progress: 80,
    rank: 2,
    status: "single",
    tags: ["math", "systems"],
    visits: 12,
  },
  {
    age: 42,
    createdAt: new Date("2024-02-01T00:00:00.000Z"),
    firstName: "Grace",
    lastName: "Hopper",
    progress: 95,
    rank: 1,
    status: "relationship",
    subRows: [
      {
        age: 18,
        createdAt: new Date("2024-02-02T00:00:00.000Z"),
        firstName: "Katherine",
        lastName: "Johnson",
        progress: 70,
        rank: 4,
        status: "single",
        tags: ["math"],
        visits: 5,
      },
      {
        age: 28,
        createdAt: new Date("2024-02-03T00:00:00.000Z"),
        firstName: "Dorothy",
        lastName: "Vaughan",
        progress: 75,
        rank: 3,
        status: "complicated",
        tags: ["systems"],
        visits: 7,
      },
    ],
    tags: ["compiler", "systems"],
    visits: 20,
  },
  {
    age: undefined,
    createdAt: new Date("2024-03-01T00:00:00.000Z"),
    firstName: "Mary",
    lastName: "Jackson",
    progress: 65,
    rank: 5,
    status: "complicated",
    tags: ["aero"],
    visits: 15,
  },
  {
    age: 35,
    createdAt: new Date("2024-04-01T00:00:00.000Z"),
    firstName: "Margaret",
    lastName: "Hamilton",
    progress: 100,
    rank: 6,
    status: "single",
    tags: ["systems", "flight"],
    visits: 25,
  },
]

const columnHelper = createColumnHelper<TestPerson>()

function cloneTestPerson(person: TestPerson): TestPerson {
  return {
    ...person,
    createdAt: new Date(person.createdAt.getTime()),
    subRows: person.subRows?.map(cloneTestPerson),
    tags: [...person.tags],
  }
}

export function makeTestData(): TestPerson[] {
  return baseTestData.map(cloneTestPerson)
}

export const testData: TestPerson[] = makeTestData()

export function makeTestColumns(): ColumnDef<TestPerson, any>[] {
  return [
    columnHelper.accessor("firstName", {
      enableHiding: false,
      header: "First Name",
      id: "firstName",
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
      id: "lastName",
    }),
    columnHelper.accessor("age", {
      aggregationFn: "mean",
      header: "Age",
      id: "age",
      sortUndefined: 1,
    }),
    columnHelper.accessor("visits", {
      aggregationFn: "sum",
      header: "Visits",
      id: "visits",
      maxSize: 300,
      minSize: 50,
      size: 80,
    }),
    columnHelper.accessor("rank", {
      header: "Rank",
      id: "rank",
      invertSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      id: "status",
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      id: "createdAt",
    }),
    columnHelper.accessor((row) => row.tags, {
      filterFn: "arrIncludes",
      getUniqueValues: (row) => row.tags,
      header: "Tags",
      id: "tags",
    }),
  ]
}

export function makeGroupedColumns(): ColumnDef<TestPerson, any>[] {
  return [
    columnHelper.group({
      columns: [
        columnHelper.accessor("firstName", {
          enableHiding: false,
          header: "First Name",
          id: "firstName",
        }),
        columnHelper.accessor("lastName", {
          header: "Last Name",
          id: "lastName",
        }),
      ],
      header: "Name",
      id: "name",
    }),
    columnHelper.group({
      columns: [
        columnHelper.accessor("age", {
          aggregationFn: "mean",
          header: "Age",
          id: "age",
          sortUndefined: 1,
        }),
        columnHelper.accessor("visits", {
          aggregationFn: "sum",
          header: "Visits",
          id: "visits",
          maxSize: 300,
          minSize: 50,
          size: 80,
        }),
      ],
      header: "Metrics",
      id: "metrics",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      id: "status",
    }),
  ]
}

export const testColumns: ColumnDef<TestPerson, any>[] = makeTestColumns()

export const groupedColumns: ColumnDef<TestPerson, any>[] = makeGroupedColumns()

export function defaultTableState(): TableState {
  return {
    columnFilters: [],
    columnOrder: [],
    columnPinning: {
      left: [],
      right: [],
    },
    columnSizing: {},
    columnSizingInfo: {
      columnSizingStart: [],
      deltaOffset: null,
      deltaPercentage: null,
      isResizingColumn: false,
      startOffset: null,
      startSize: null,
    },
    columnVisibility: {},
    expanded: {},
    globalFilter: undefined,
    grouping: [],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    rowPinning: {
      bottom: [],
      includeLeafRows: false,
      includeParentRows: false,
      top: [],
    },
    rowSelection: {},
    sorting: [],
  }
}

export type TableHarnessOptions = {
  columns?: ColumnDef<TestPerson, any>[]
  data?: TestPerson[]
  initialState?: Partial<TableState>
  state?: Partial<TableState>
  tableOptions?: Omit<
    Partial<TableOptions<TestPerson>>,
    | "columns"
    | "data"
    | "getCoreRowModel"
    | "getExpandedRowModel"
    | "getFilteredRowModel"
    | "getGroupedRowModel"
    | "getPaginationRowModel"
    | "getSortedRowModel"
    | "getSubRows"
    | "initialState"
    | "onStateChange"
    | "renderFallbackValue"
    | "state"
  >
}

export type TableHarness = {
  getState: () => TableState
  setState: (state: Partial<TableState>) => void
  table: TableInstance<TestPerson>
}

export function createTableHarness(
  options: TableHarnessOptions = {},
): TableHarness {
  let state = {
    ...defaultTableState(),
    ...options.initialState,
    ...options.state,
  } as TableState

  const table = createTable<TestPerson>({
    columns: options.columns ?? makeTestColumns(),
    data: options.data ?? makeTestData(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row) => row.subRows,
    initialState: {
      ...defaultTableState(),
      ...options.initialState,
    },
    onStateChange(updater: Updater<TableState>) {
      state = typeof updater === "function" ? updater(state) : updater
      table.updateOptions({state})
    },
    renderFallbackValue: "",
    state,
    ...options.tableOptions,
  })

  return {
    getState: () => state,
    setState: (nextState) => {
      state = {
        ...defaultTableState(),
        ...options.initialState,
        ...nextState,
      } as TableState
      table.updateOptions({state})
    },
    table,
  }
}
