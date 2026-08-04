// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FC} from "react"

import {useJsonViewerStore} from "../../stores"
import type {DataItemProps, DataType} from "../../type"
import {DataTypeLabel} from "../data-type-label"

// oxlint-disable-next-line typescript/no-unsafe-function-type
const functionBody = (func: Function) => {
  const funcString = func.toString()

  let isUsualFunction = true
  const parenthesisPos = funcString.indexOf(")")
  const arrowPos = funcString.indexOf("=>")
  if (arrowPos !== -1 && arrowPos > parenthesisPos) {
    isUsualFunction = false
  }
  if (isUsualFunction) {
    return funcString.substring(
      funcString.indexOf("{", parenthesisPos) + 1,
      funcString.lastIndexOf("}"),
    )
  }

  return funcString.substring(funcString.indexOf("=>") + 2)
}

// oxlint-disable-next-line typescript/no-unsafe-function-type
const functionName = (func: Function) => {
  const funcString = func.toString()
  const isUsualFunction = funcString.indexOf("function") !== -1
  if (isUsualFunction) {
    return funcString.substring(8, funcString.indexOf("{")).trim()
  }

  return funcString.substring(0, funcString.indexOf("=>") + 2).trim()
}

const lb = "{"
const rb = "}"

// oxlint-disable-next-line typescript/no-unsafe-function-type
const PreFunctionType: FC<DataItemProps<Function>> = (props) => {
  return (
    <>
      <DataTypeLabel dataType="function" />
      <span className="data-function-start">
        {functionName(props.value)} {lb}
      </span>
    </>
  )
}

// oxlint-disable-next-line typescript/no-unsafe-function-type
const PostFunctionType: FC<DataItemProps<Function>> = () => {
  return (
    <>
      <span className="data-function-end">{rb}</span>
    </>
  )
}

// oxlint-disable-next-line typescript/no-unsafe-function-type
const FunctionType: FC<DataItemProps<Function>> = (props) => {
  const functionColor = useJsonViewerStore((store) => store.colorspace.base05)
  return (
    <>
      <div
        className="data-function"
        style={{
          color: functionColor,
          display: props.inspect ? "block" : "inline-block",
          paddingLeft: props.inspect ? 16 : 0,
        }}
      >
        {props.inspect ? (
          functionBody(props.value)
        ) : (
          <span
            className="data-function-body"
            onClick={() => props.setInspect(true)}
          >
            …
          </span>
        )}
      </div>
    </>
  )
}

// oxlint-disable-next-line typescript/no-unsafe-function-type
export const functionType: DataType<Function> = {
  Component: FunctionType,
  is: (value) => typeof value === "function",
  PostComponent: PostFunctionType,
  PreComponent: PreFunctionType,
}
