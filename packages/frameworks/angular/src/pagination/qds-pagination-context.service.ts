import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {QdsPaginationApi} from "@qualcomm-ui/qds-core/pagination"

@Injectable()
export class QdsPaginationContextService extends BaseApiContextService<QdsPaginationApi> {}

export const [
  QDS_PAGINATION_CONTEXT,
  useQdsPaginationContext,
  provideQdsPaginationContext,
]: ApiContext<QdsPaginationApi> = createApiContext<QdsPaginationApi>(
  "QdsPaginationContext",
  QdsPaginationContextService,
)
