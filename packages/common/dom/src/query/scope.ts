// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Scope} from "@qualcomm-ui/utils/machine"

import {getActiveElement, getDocument} from "./node"

export function createScope<T>(
  props: Pick<Scope, "getRootNode"> & T,
): Scope & T {
  const getRootNode = () =>
    (props.getRootNode?.() as Document | ShadowRoot | undefined) ?? document
  const getDoc = () => getDocument(getRootNode())
  const getWin = () => getDoc().defaultView ?? window
  const getActiveElementFn = () => getActiveElement(getRootNode())
  const isActiveElement = (elem: HTMLElement | null) =>
    elem === getActiveElementFn()
  const getById = <T extends Element = HTMLElement>(id: string) =>
    getRootNode().getElementById(id) as T | null

  const dom = {
    getActiveElement: getActiveElementFn,
    getById,
    getDoc,
    getRootNode,
    getWin,
    isActiveElement,
  }

  return {...props, ...dom}
}
