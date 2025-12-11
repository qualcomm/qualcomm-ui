import {type ReactNode, useMemo, useState} from "react"

import {InfinityIcon} from "lucide-react"

import {Icon} from "@qualcomm-ui/react/icon"

import {useIsCycleReference, useTextColor} from "../../hooks"
import {useJsonViewerStore} from "../../stores"
import type {DataItemProps, DataType} from "../../type"
import {getValueSize, segmentArray} from "../../utils"
import {DataKeyPair} from "../data-key-pair"
import {RefName} from "../internal"

const objectLb = "{"
const arrayLb = "["
const objectRb = "}"
const arrayRb = "]"

function inspectMetadata(value: object) {
  const length = getValueSize(value)

  let name = ""
  if (value instanceof Map || value instanceof Set) {
    name = value[Symbol.toStringTag]
  }
  if (Object.prototype.hasOwnProperty.call(value, Symbol.toStringTag)) {
    name = (value as any)[Symbol.toStringTag]
  }
  return `${length} Items${name ? ` (${name})` : ""}`
}

function PreObjectType(props: DataItemProps<any>): ReactNode {
  const metadataColor = useJsonViewerStore((store) => store.colorspace.base04)
  const isArray = useMemo(
    () => props.arrayOverride || Array.isArray(props.value),
    [props.arrayOverride, props.value],
  )
  const isEmptyValue = useMemo(
    () => getValueSize(props.value) === 0,
    [props.value],
  )
  const sizeOfValue = useMemo(() => inspectMetadata(props.value), [props.value])
  const displaySize = useJsonViewerStore((store) => store.displaySize)
  const shouldDisplaySize = useMemo(
    () =>
      typeof displaySize === "function"
        ? displaySize(props.path, props.value)
        : displaySize,
    [displaySize, props.path, props.value],
  )
  const color = useJsonViewerStore((store) => store.colorspace.base05)
  const isTrap = useIsCycleReference(props.path, props.value)

  const refName = props.refName

  return (
    <span className="data-object-start" style={{color}}>
      {isArray ? arrayLb : objectLb}
      {refName ? <RefName inspect={props.inspect} refName={refName} /> : null}
      {!refName && shouldDisplaySize && props.inspect && !isEmptyValue && (
        <span className="data-size-label" style={{color: metadataColor}}>
          {sizeOfValue}
        </span>
      )}

      {isTrap && !props.inspect && (
        <>
          <Icon className="inline-icon" icon={InfinityIcon} style={{color}} />
          {isTrap}
        </>
      )}
    </span>
  )
}

function PostObjectType(props: DataItemProps<object>): ReactNode {
  const metadataColor = useJsonViewerStore((store) => store.colorspace.base04)

  const isArray = useMemo(() => Array.isArray(props.value), [props.value])
  const isEmptyValue = useMemo(
    () => getValueSize(props.value) === 0,
    [props.value],
  )
  const sizeOfValue = useMemo(() => inspectMetadata(props.value), [props.value])
  const displaySize = useJsonViewerStore((store) => store.displaySize)
  const shouldDisplaySize = useMemo(
    () =>
      typeof displaySize === "function"
        ? displaySize(props.path, props.value)
        : displaySize,
    [displaySize, props.path, props.value],
  )

  const color = useJsonViewerStore((store) => store.colorspace.base06)

  const refName = props.refName

  return (
    <span className="data-object-end" style={{color}}>
      {isArray ? arrayRb : objectRb}
      {!refName && shouldDisplaySize && (isEmptyValue || !props.inspect) ? (
        <span className="data-size-label" style={{color: metadataColor}}>
          {sizeOfValue}
        </span>
      ) : null}
    </span>
  )
}

export function ObjectType(props: DataItemProps<any>): ReactNode {
  const keyColor = useTextColor()
  const borderColor = useJsonViewerStore((store) => store.colorspace.base02)
  const groupArraysAfterLength = useJsonViewerStore(
    (store) => store.groupArraysAfterLength,
  )
  const isTrap = useIsCycleReference(props.path, props.value)
  const [displayLength, setDisplayLength] = useState(
    useJsonViewerStore((store) => store.maxDisplayLength),
  )
  const objectSortKeys = useJsonViewerStore((store) => store.objectSortKeys)

  const elements = useMemo(() => {
    if (!props.inspect) {
      return null
    }
    const value: unknown[] | any = props.value

    if (Array.isArray(value)) {
      // unknown[]
      if (value.length <= groupArraysAfterLength) {
        const elements = value.slice(0, displayLength).map((value, _index) => {
          const index = props.nestedIndex
            ? props.nestedIndex * groupArraysAfterLength + _index
            : _index
          const path = [...props.path, index]
          return (
            <DataKeyPair
              key={index}
              path={path}
              prevValue={
                Array.isArray(props.prevValue)
                  ? props.prevValue[index]
                  : undefined
              }
              value={value}
            />
          )
        })
        if (value.length > displayLength) {
          const rest = value.length - displayLength
          elements.push(
            <div
              key="last"
              className="rest-spread"
              onClick={() => setDisplayLength((length: number) => length * 2)}
              style={{color: keyColor}}
            >
              hidden {rest} items…
            </div>,
          )
        }
        return elements
      }

      const elements: unknown[][] = segmentArray(value, groupArraysAfterLength)
      const prevElements = Array.isArray(props.prevValue)
        ? segmentArray(props.prevValue, groupArraysAfterLength)
        : undefined

      return elements.map((list, index) => {
        return (
          <DataKeyPair
            key={index}
            nestedIndex={index}
            path={props.path}
            prevValue={prevElements?.[index]}
            value={list}
          />
        )
      })
    }

    if (!value) {
      return <></>
    }

    if (value.type === "object" && value.properties) {
      return (
        <DataKeyPair
          path={[]}
          prevValue={props.prevValue}
          value={value.properties}
        />
      )
    }
    // object
    let entries: [key: string, value: unknown][] = Object.entries(value).filter(
      ([key]) => key !== "$$ref",
    )
    if (objectSortKeys) {
      entries =
        objectSortKeys === true
          ? entries.sort(([a], [b]) => a.localeCompare(b))
          : entries.sort(([a], [b]) => objectSortKeys(a, b))
    }
    const elements = entries.slice(0, displayLength).map(([key, value]) => {
      const path = [...props.path, key]
      return (
        <DataKeyPair
          key={key}
          path={path}
          prevValue={props.prevValue?.[key]}
          value={value}
        />
      )
    })
    if (entries.length > displayLength) {
      const rest = entries.length - displayLength
      elements.push(
        <div
          key="last"
          className="rest-spread no-select"
          onClick={() => setDisplayLength((length: number) => length * 2)}
          style={{color: keyColor}}
        >
          hidden {rest} items…
        </div>,
      )
    }
    return elements
  }, [props, objectSortKeys, displayLength, groupArraysAfterLength, keyColor])
  const marginLeft = props.inspect ? 0.8 : 0
  const width = useJsonViewerStore((store) => store.indentWidth)
  const indentWidth = props.inspect ? width - marginLeft : width
  const isEmptyValue = useMemo(
    () => getValueSize(props.value) === 0,
    [props.value],
  )
  if (isEmptyValue) {
    return null
  }

  return (
    <div
      className="data-object"
      style={{
        borderLeft: props.inspect ? `1px solid ${borderColor}` : "none",
        color: keyColor,
        display: props.inspect ? "block" : "inline-block",
        marginLeft: marginLeft * 8,
        paddingLeft: props.inspect ? (indentWidth - 0.6) * 8 : 0,
      }}
    >
      {props.inspect
        ? elements
        : !isTrap &&
          !props.refName && (
            <span
              className="data-object-body"
              onClick={() => props.setInspect(true)}
            >
              …
            </span>
          )}
    </div>
  )
}

export const objectType: DataType<object> = {
  Component: ObjectType,
  is: (value) => typeof value === "object",
  PostComponent: PostObjectType,
  PreComponent: PreObjectType,
}
