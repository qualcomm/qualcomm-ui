// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type CSSProperties,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {ChevronDown, ChevronRightIcon, ChevronUp} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"

import {useInspect, useTextColor} from "../hooks"
import {useJsonViewerStore, useTypeComponents} from "../stores"
import type {DataItemProps} from "../type"
import {getValueSize} from "../utils"

import {isEnum} from "./data-types"
import {
  getRefName,
  isObject,
  isReferenceArray,
  isReferenceObject,
} from "./internal"

export type DataKeyPairProps = {
  className?: string
  isRequired?: boolean
  nestedIndex?: number
  path: (string | number)[]
  prevValue?: unknown
  requiredProperties?: string[] | null
  style?: CSSProperties
  value: unknown
}

export function DataKeyPair(props: DataKeyPairProps) {
  const {nestedIndex, path, prevValue, value} = props
  const {Component, PostComponent, PreComponent} = useTypeComponents(
    value,
    path,
  )

  const depth = path.length
  const key = path[depth - 1]
  const setHover = useJsonViewerStore((store) => store.setHover)
  const root = useJsonViewerStore((store) => store.value)
  const [inspect, setInspect] = useInspect(path, value, nestedIndex)
  const keyColor = useTextColor()
  const numberKeyColor = useJsonViewerStore((store) => store.colorspace.base0C)
  const highlightColor = useJsonViewerStore((store) => store.colorspace.base0A)
  const quotesOnKeys = useJsonViewerStore((store) => store.quotesOnKeys)
  const rootName = useJsonViewerStore((store) => store.rootName)
  const displayNumberKeys = useJsonViewerStore(
    (store) => store.displayNumberKeys,
  )
  const isRoot = root === value
  const isNumberKey = Number.isInteger(Number(key))

  const highlightUpdates = useJsonViewerStore((store) => store.highlightUpdates)
  const isHighlight = useMemo(() => {
    if (!highlightUpdates || prevValue === undefined) {
      return false
    }

    // highlight if value type changed
    if (typeof value !== typeof prevValue) {
      return true
    }

    if (typeof value === "number") {
      // notice: NaN !== NaN
      if (isNaN(value) && isNaN(prevValue as number)) {
        return false
      }
      return value !== prevValue
    }

    // highlight if isArray changed
    if (Array.isArray(value) !== Array.isArray(prevValue)) {
      return true
    }

    // not highlight object/function
    // deep compare they will be slow
    if (typeof value === "object" || typeof value === "function") {
      return false
    }

    // highlight if not equal
    if (value !== prevValue) {
      return true
    }

    return false
  }, [highlightUpdates, prevValue, value])

  const highlightContainer = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (
      highlightContainer.current &&
      isHighlight &&
      "animate" in highlightContainer.current
    ) {
      highlightContainer.current.animate(
        [{backgroundColor: highlightColor}, {backgroundColor: ""}],
        {
          duration: 1000,
          easing: "ease-in",
        },
      )
    }
  }, [highlightColor, isHighlight, prevValue, value])

  const isEmptyValue = useMemo(() => getValueSize(value) === 0, [value])
  const expandable = !isEmptyValue && !!(PreComponent && PostComponent)
  const KeyRenderer = useJsonViewerStore((store) => store.keyRenderer)
  const [showDescription, setShowDescription] = useState<boolean>(false)

  const downstreamProps: DataItemProps = useMemo(() => {
    return {
      inspect,
      isRequired: props.isRequired,
      nestedIndex,
      path: [...path, "properties"],
      prevValue,
      refName: getRefName(value),
      requiredProperties:
        typeof value === "object" && value && "required" in value
          ? (value.required as string[])
          : null,
      setInspect,
      value: isReferenceObject(value)
        ? value.properties
        : isReferenceArray(value)
          ? "properties" in value.items
            ? value.items.properties
            : value.items
          : value,
    }
  }, [
    inspect,
    nestedIndex,
    path,
    prevValue,
    value,
    props.isRequired,
    setInspect,
  ])

  const onKeyClick = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      if (event.isDefaultPrevented()) {
        return
      }
      if (!isEmptyValue) {
        setInspect((state) => !state)
      }
    },
    [isEmptyValue, setInspect],
  )

  const onMouseEnter = useCallback(
    () => setHover(path, nestedIndex),
    [setHover, path, nestedIndex],
  )

  const color = useJsonViewerStore((store) => store.colorspace.base05)
  const showIndicator = useJsonViewerStore((store) => store.displayKeyIndicator)
  const description =
    typeof props.value === "object" &&
    props.value &&
    "description" in props.value
      ? (props.value.description as string)
      : undefined

  const keyWithRequiredIndicator = (
    <span>
      {key}
      {props.isRequired ? (
        <span className="key-required-indicator">*</span>
      ) : null}
    </span>
  )

  return (
    <div
      className={clsx("data-key-pair", props.className)}
      data-expandable={booleanDataAttr(expandable)}
      data-has-description={booleanDataAttr(!!description)}
      data-is-enum-type={booleanDataAttr(isEnum(props))}
      data-testid={`data-key-pair-${path.join(".")}`}
      onMouseEnter={onMouseEnter}
      style={props.style}
    >
      <div className="data-key-pair-content">
        <span
          className="data-key"
          data-expandable={booleanDataAttr(expandable)}
          onClick={onKeyClick}
          style={{color: keyColor}}
        >
          {expandable ? (
            <span className="inline-icon expand-icon">
              <Icon
                className="inline-icon"
                icon={ChevronRightIcon}
                style={{
                  color,
                  transform: inspect ? "rotate(90deg)" : "unset",
                  transition: "transform 161ms ease",
                }}
              />
            </span>
          ) : null}
          <span ref={highlightContainer}>
            {isRoot && depth === 0 ? (
              rootName !== false ? (
                quotesOnKeys ? (
                  <>&quot;{rootName}&quot;</>
                ) : (
                  <>{rootName}</>
                )
              ) : null
            ) : KeyRenderer.when(downstreamProps) ? (
              <KeyRenderer {...downstreamProps} />
            ) : (
              nestedIndex === undefined &&
              (isNumberKey ? (
                <>
                  {displayNumberKeys ? (
                    <span style={{color: numberKeyColor}}>{key}</span>
                  ) : null}
                </>
              ) : quotesOnKeys ? (
                <>&quot;{keyWithRequiredIndicator}&quot;</>
              ) : (
                <>{keyWithRequiredIndicator}</>
              ))
            )}
          </span>
          {showIndicator
            ? isRoot
              ? rootName !== false && <div className="indicator">:</div>
              : nestedIndex === undefined && <div className="indicator">:</div>
            : null}
          {PreComponent && <PreComponent {...downstreamProps} />}
        </span>

        {Component ? (
          description && !isObject(value) && !isReferenceArray(value) ? (
            <div className="data-key-description-container">
              <Component {...downstreamProps} />
              <IconButton
                className="data-key-description-expand-button"
                density="compact"
                icon={showDescription ? ChevronUp : ChevronDown}
                onClick={() => setShowDescription(!showDescription)}
                size="sm"
                variant="ghost"
              />
            </div>
          ) : (
            <Component {...downstreamProps} />
          )
        ) : (
          <span className="data-value-fallback">{`fallback: ${value as string}`}</span>
        )}

        {description && showDescription ? (
          <div className="data-key-description">{description}</div>
        ) : null}

        {PostComponent && <PostComponent {...downstreamProps} />}
      </div>
    </div>
  )
}
