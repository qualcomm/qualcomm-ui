import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {TagApi} from "@qualcomm-ui/core/tag"

@Injectable()
export class TagContextService extends BaseApiContextService<TagApi> {}

export const [
  TAG_CONTEXT,
  useTagContext,
  provideTagContext,
]: ApiContext<TagApi> = createApiContext<TagApi>(
  "TagContext",
  TagContextService,
)
