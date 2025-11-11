// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {accordionClasses} from "./accordion.classes"
import type {QdsAccordionApiProps, QdsAccordionProps} from "./accordion.types"

export function getQdsAccordionBindings(
  props: QdsAccordionApiProps,
  normalize: PropNormalizer,
): QdsAccordionProps {
  return normalize.element({
    className: accordionClasses.root,
    "data-size": props.size || "md",
    "data-uncontained": booleanDataAttr(props.uncontained),
  })
}
