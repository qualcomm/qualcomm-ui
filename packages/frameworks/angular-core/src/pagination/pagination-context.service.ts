import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {PaginationApi} from "@qualcomm-ui/core/pagination"

@Injectable()
export class PaginationContextService extends BaseApiContextService<PaginationApi> {}

export const [
  PAGINATION_CONTEXT,
  usePaginationContext,
  providePaginationContext,
]: ApiContext<PaginationApi> = createApiContext<PaginationApi>(
  "PaginationContext",
  PaginationContextService,
)
