import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {PasswordInputApi} from "@qualcomm-ui/core/password-input"

@Injectable()
export class PasswordInputContextService extends BaseApiContextService<PasswordInputApi> {}

export const [
  PASSWORD_INPUT_CONTEXT,
  usePasswordInputContext,
  providePasswordInputContext,
]: ApiContext<PasswordInputApi> = createApiContext<PasswordInputApi>(
  "PasswordInputContext",
  PasswordInputContextService,
)
