// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {CSSProperties, ReactNode} from "react"

import {Plus} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

/**
 * The diagram is rendered at 3x, so every on-screen offset below is the
 * token value multiplied by this factor.
 */
const SCALE = 3

/**
 * Values for the md button in the Qualcomm brand. The homepage is always
 * rendered with `data-brand="qualcomm"`, so these are hardcoded instead of
 * measured on the client.
 */
const HEIGHT = 40
const PADDING = 16
const ICON = 16
const GAP = 8
const RADIUS = 4

/**
 * The button has a transparent border inside its border-box, so its content
 * starts this far in from the outer edge.
 */
const BORDER = 1

const specs: {label: string; token: string; value: string}[] = [
  {label: "Height", token: "--sizing-140", value: `${HEIGHT}px`},
  {label: "Padding inline", token: "--spacing-100", value: `${PADDING}px`},
  {label: "Gap", token: "--spacing-70", value: `${GAP}px`},
  {label: "Icon", token: "--sizing-70", value: `${ICON}px`},
  {
    label: "Border radius",
    token: "--border-radius-md",
    value: `${RADIUS}px`,
  },
  {
    label: "Font",
    token: "--font-static-body-sm-bold",
    value: "14px/20px - 500",
  },
]

function Annotation({
  children,
  style,
}: {
  children: ReactNode
  style: CSSProperties
}): ReactNode {
  return (
    <span
      className="font-code-xs-bold text-persistent-white bg-category-magenta-strong absolute -translate-x-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 whitespace-nowrap"
      style={style}
    >
      {children}
    </span>
  )
}

/**
 * A horizontal dimension line with end ticks, positioned relative to the
 * scaled button's top-left corner.
 */
function HorizontalDimension({
  left,
  top,
  width,
}: {
  left: number
  top: number
  width: number
}): ReactNode {
  return (
    <span
      className="absolute box-border flex h-2.5 -translate-y-1/2 items-center border-x"
      style={{left, top, width}}
    >
      <span className="w-full border-t" />
    </span>
  )
}

function VerticalDimension({
  height,
  left,
  top,
}: {
  height: number
  left: number
  top: number
}): ReactNode {
  return (
    <span
      className="absolute box-border flex w-2.5 -translate-x-1/2 justify-center border-y"
      style={{height, left, top}}
    >
      <span className="h-full border-l" />
    </span>
  )
}

function ButtonDiagram(): ReactNode {
  const height = HEIGHT * SCALE
  const padding = PADDING * SCALE
  const icon = ICON * SCALE
  const gap = GAP * SCALE
  const radius = RADIUS * SCALE
  const border = BORDER * SCALE
  const iconLeft = border + padding
  const iconTop = (height - icon) / 2

  return (
    <div className="spec-grid-bg relative flex min-h-80 items-center justify-center overflow-hidden px-6 py-16">
      <div className="relative max-sm:scale-75">
        <div className="flex" inert style={{zoom: SCALE}}>
          <Button emphasis="primary" size="md" startIcon={Plus} variant="fill">
            Label
          </Button>
        </div>

        <div
          aria-hidden
          className="text-category-magenta-strong pointer-events-none absolute inset-0"
        >
          <VerticalDimension height={height} left={-28} top={0} />
          <Annotation style={{left: -56, top: height / 2}}>{HEIGHT}</Annotation>

          <span
            className="absolute box-border border border-dashed"
            style={{height: icon, left: iconLeft, top: iconTop, width: icon}}
          />
          <HorizontalDimension left={iconLeft} top={-26} width={icon} />
          <Annotation style={{left: iconLeft + icon / 2, top: -50}}>
            {ICON}
          </Annotation>

          <HorizontalDimension
            left={border}
            top={height + 26}
            width={padding}
          />
          <Annotation style={{left: border + padding / 2, top: height + 50}}>
            {PADDING}
          </Annotation>

          <HorizontalDimension
            left={iconLeft + icon}
            top={height + 26}
            width={gap}
          />
          <Annotation
            style={{left: iconLeft + icon + gap / 2, top: height + 50}}
          >
            {GAP}
          </Annotation>

          <span
            className="absolute box-border border-t border-r border-dashed"
            style={{
              height: radius + 10,
              right: -10,
              top: -10,
              width: radius + 10,
            }}
          />
          <span className="absolute -top-2.5 -right-2.5">
            <Annotation style={{left: 20, top: 0}}>r {RADIUS}</Annotation>
          </span>
        </div>
      </div>

      <span className="font-code-xs text-neutral-secondary absolute bottom-4 left-4">
        Shown at {SCALE}x
      </span>
    </div>
  )
}

export function ButtonSpecPanel(): ReactNode {
  return (
    <div className="shadow-medium border-neutral-01 grid w-full grid-cols-1 overflow-hidden rounded-xl border lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div>
        <ButtonDiagram />
      </div>
      <dl className="border-neutral-01 m-0 border-t lg:border-t-0 lg:border-l">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="border-neutral-01 grid grid-cols-[8rem_minmax(0,1fr)] gap-x-4 border-t px-6 py-4 first:border-t-0"
          >
            <dt className="font-body-sm-compact text-neutral-secondary">
              {spec.label}
            </dt>
            <dd className="m-0 flex min-w-0 flex-col gap-1">
              <span className="font-code-sm-bold">{spec.value}</span>
              <code className="font-code-xs text-neutral-secondary wrap-anywhere">
                {spec.token}
              </code>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
