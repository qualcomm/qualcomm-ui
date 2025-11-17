import type {HTMLAttributes} from "react"

import {page} from "vitest/browser"

import {Slider, type SliderRootProps} from "@qualcomm-ui/react/slider"

export const testIds = {
  focusTarget: "focus-target",
  sliderControl: "slider-control",
  sliderErrorText: "slider-error-text",
  sliderHint: "slider-hint",
  sliderInput0: "slider-input-0",
  sliderInput1: "slider-input-1",
  sliderLabel: "slider-label",
  sliderMarker: "slider-marker",
  sliderMarkerGroup: "slider-marker-group",
  sliderMax: "slider-max",
  sliderMin: "slider-min",
  sliderRoot: "slider-root",
  sliderThumb0: "slider-thumb-0",
  sliderThumb1: "slider-thumb-1",
  sliderValueText: "slider-value-text",
} as const

interface TestSliderProps {
  errorText?: string
  hint?: string
  label?: string
  markers?: number[]
  sideMarkers?: boolean
  thumbName?: [string?, string?]
  withThumbs?: boolean
}

export function clickFocusTarget() {
  return page.getByText("Focus target").click()
}

export function SimpleSlider(props: SliderRootProps & TestSliderProps) {
  const {
    errorText,
    hint,
    label,
    markers,
    sideMarkers,
    thumbName,
    ...sliderProps
  } = props

  const derivedName = thumbName?.filter((n): n is string => n !== undefined)

  return (
    <div>
      <button type="button">Focus target</button>
      <Slider
        {...sliderProps}
        controlProps={
          {
            "data-test-id": testIds.sliderControl,
          } as HTMLAttributes<HTMLDivElement>
        }
        data-test-id={testIds.sliderRoot}
        errorText={errorText}
        errorTextProps={
          {
            "data-test-id": testIds.sliderErrorText,
          } as HTMLAttributes<HTMLSpanElement>
        }
        hint={hint}
        hintProps={
          {
            "data-test-id": testIds.sliderHint,
          } as HTMLAttributes<HTMLSpanElement>
        }
        label={label}
        labelProps={
          {
            "data-test-id": testIds.sliderLabel,
          } as HTMLAttributes<HTMLLabelElement>
        }
        markerGroupProps={
          {
            "data-test-id": testIds.sliderMarkerGroup,
          } as HTMLAttributes<HTMLDivElement>
        }
        marks={markers}
        maxProps={
          {
            "data-test-id": testIds.sliderMax,
          } as HTMLAttributes<HTMLDivElement>
        }
        minProps={
          {
            "data-test-id": testIds.sliderMin,
          } as HTMLAttributes<HTMLDivElement>
        }
        {...(derivedName && !sliderProps.name ? {name: derivedName} : {})}
        sideMarkers={sideMarkers}
        thumbProps={
          {
            "data-test-id": testIds.sliderThumb0,
          } as HTMLAttributes<HTMLDivElement>
        }
        valueTextProps={
          {
            "data-test-id": testIds.sliderValueText,
          } as HTMLAttributes<HTMLOutputElement>
        }
      />
    </div>
  )
}

export function CompositeSlider(props: SliderRootProps & TestSliderProps) {
  const {
    errorText,
    hint,
    label,
    markers,
    sideMarkers,
    thumbName,
    ...sliderProps
  } = props

  return (
    <div>
      <button type="button">Focus target</button>
      <Slider.Root {...sliderProps} data-test-id={testIds.sliderRoot}>
        {label && (
          <Slider.Label data-test-id={testIds.sliderLabel}>
            {label}
          </Slider.Label>
        )}
        <Slider.ValueText data-test-id={testIds.sliderValueText} />
        <Slider.Control data-test-id={testIds.sliderControl}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          {markers && (
            <Slider.MarkerGroup data-test-id={testIds.sliderMarkerGroup}>
              {markers.map((value) => (
                <Slider.Marker
                  key={value}
                  data-test-id={`${testIds.sliderMarker}-${value}`}
                  value={value}
                >
                  {value}
                </Slider.Marker>
              ))}
            </Slider.MarkerGroup>
          )}
          <Slider.Thumb
            data-test-id={testIds.sliderThumb0}
            index={0}
            {...(thumbName?.[0] ? {name: thumbName[0]} : {})}
          >
            <Slider.HiddenInput data-test-id={testIds.sliderInput0} />
          </Slider.Thumb>
          {(sliderProps.value?.length === 2 ||
            sliderProps.defaultValue?.length === 2) && (
            <Slider.Thumb
              data-test-id={testIds.sliderThumb1}
              index={1}
              {...(thumbName?.[1] ? {name: thumbName[1]} : {})}
            >
              <Slider.HiddenInput data-test-id={testIds.sliderInput1} />
            </Slider.Thumb>
          )}
        </Slider.Control>
        {sideMarkers && (
          <>
            <Slider.Min data-test-id={testIds.sliderMin} />
            <Slider.Max data-test-id={testIds.sliderMax} />
          </>
        )}
        {hint && (
          <Slider.Hint data-test-id={testIds.sliderHint}>{hint}</Slider.Hint>
        )}
        {errorText && (
          <Slider.ErrorText data-test-id={testIds.sliderErrorText}>
            {errorText}
          </Slider.ErrorText>
        )}
      </Slider.Root>
    </div>
  )
}

export function TestSlider(props: SliderRootProps & TestSliderProps) {
  return <CompositeSlider {...props} />
}
