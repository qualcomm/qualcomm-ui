import {Injectable, signal} from "@angular/core"

@Injectable()
export class RowPinningService {
  readonly keepPinnedRows = signal(false)
  readonly includeLeafRows = signal(true)
  readonly includeParentRows = signal(true)
}
