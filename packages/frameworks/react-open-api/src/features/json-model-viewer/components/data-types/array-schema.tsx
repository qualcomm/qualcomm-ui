import type {ReactNode} from "react"

import {useJsonViewerStore} from "../../stores"
import type {DataItemProps, DataType} from "../../type"
import {getArrayType, isReferenceArray, RefName} from "../internal"

import {ObjectType} from "./object"

function PreArrayType(props: DataItemProps<any>): ReactNode {
  const refName = props.refName

  const color = useJsonViewerStore((store) => store.colorspace.base06)

  const simpleType = getArrayType(props.value)

  return (
    <span className="data-object-start" style={{color}}>
      <div className="indicator">{simpleType ? "" : `[{`}</div>
      {refName ? (
        <RefName inspect={props.inspect} isArray refName={refName} />
      ) : null}
    </span>
  )
}

function PostArrayType(props: DataItemProps<any>): ReactNode {
  const color = useJsonViewerStore((store) => store.colorspace.base06)

  const simpleType = getArrayType(props.value)

  return (
    <span className="data-object-end" style={{color}}>
      <div className="indicator">{simpleType ? "" : `}]`}</div>
    </span>
  )
}

function ArrayType(props: DataItemProps<any>) {
  const simpleType = getArrayType(props.value)
  const color = useJsonViewerStore((store) => store.colorspace.base09)

  if (simpleType) {
    return <span style={{color}}>{simpleType}[]</span>
  }

  return <ObjectType {...props} />
}

export const arraySchemaType: DataType<object> = {
  Component: ArrayType,
  is: (value) => isReferenceArray(value),
  PostComponent: PostArrayType,
  PreComponent: PreArrayType,
}
