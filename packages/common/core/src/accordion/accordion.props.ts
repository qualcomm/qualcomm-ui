// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {AccordionApiProps} from "./accordion.types"

const accordionProps: (keyof AccordionApiProps)[] =
  createProps<AccordionApiProps>()(
    "dir",
    "multiple",
    "collapsible",
    "disabled",
    "value",
    "defaultValue",
    "onFocusChange",
    "onValueChange",
  )

export const splitAccordionProps: <Props extends AccordionApiProps>(
  props: Props,
) => [AccordionApiProps, Omit<Props, keyof AccordionApiProps>] =
  createSplitProps<AccordionApiProps>(accordionProps)
