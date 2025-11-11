import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {ToastApi} from "@qualcomm-ui/core/toast"

@Injectable()
export class ToastContextService extends BaseApiContextService<ToastApi> {}

export const [
  TOAST_CONTEXT,
  useToastContext,
  provideToastContext,
]: ApiContext<ToastApi> = createApiContext<ToastApi>(
  "ToastContext",
  ToastContextService,
)
