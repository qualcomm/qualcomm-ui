import {Injectable, linkedSignal} from "@angular/core"

import {createUserQuery} from "./data"

@Injectable()
export class MutableDataService {
  protected readonly query = createUserQuery(5)

  readonly data = linkedSignal(() => this.query.data() ?? [])

  updateColumnValue(rowIndex: number, columnId: string, value: unknown) {
    this.data.update((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      }),
    )
  }
}
