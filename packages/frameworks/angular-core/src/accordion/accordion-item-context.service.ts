import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {AccordionItemApiProps} from "@qualcomm-ui/core/accordion"

@Injectable()
export class AccordionItemContextService extends BaseApiContextService<AccordionItemApiProps> {}

export const [
  ACCORDION_ITEM_CONTEXT,
  useAccordionItemContext,
  provideAccordionItemContext,
] = createApiContext<AccordionItemApiProps>(
  "AccordionItemContext",
  AccordionItemContextService,
)
