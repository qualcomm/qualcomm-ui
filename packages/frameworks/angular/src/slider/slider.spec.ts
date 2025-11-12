import {Component, input, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {page, userEvent} from "@vitest/browser/context"
import {describe, expect, test, vi} from "vitest"

import {SliderModule} from "@qualcomm-ui/angular/slider"

import {type MultiComponentTest, runTests} from "~test-utils"

async function clickFocusTarget() {
  return page.getByText("Focus target").click()
}

const testIds = {
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

@Component({
  imports: [SliderModule],
  template: `
    <button type="button" [attr.data-test-id]="testIds.focusTarget">
      Focus target
    </button>
    <q-slider
      [aria-label]="ariaLabel()"
      [attr.data-test-id]="testIds.sliderRoot"
      [defaultValue]="defaultValue()"
      [dir]="dir()"
      [disabled]="disabled()"
      [errorText]="errorText()"
      [getAriaValueText]="getAriaValueText()"
      [hint]="hint()"
      [invalid]="invalid()"
      [label]="label()"
      [marks]="markers()"
      [max]="max()"
      [min]="min()"
      [minStepsBetweenThumbs]="minStepsBetweenThumbs()"
      [name]="name()"
      [orientation]="orientation()"
      [origin]="origin()"
      [readOnly]="readOnly()"
      [sideMarkers]="sideMarkers()"
      [step]="step()"
      (valueChanged)="valueChanged.emit($event)"
      (valueChangedEnd)="valueChangedEnd.emit($event)"
    />
  `,
})
class SimpleSliderComponent {
  readonly testIds = testIds

  readonly defaultValue = input<number[] | undefined>(undefined)
  readonly max = input<number | undefined>(undefined)
  readonly min = input<number | undefined>(undefined)
  readonly step = input<number | undefined>(undefined)
  readonly minStepsBetweenThumbs = input<number | undefined>(undefined)
  readonly orientation = input<"vertical" | "horizontal" | undefined>(undefined)
  readonly ariaLabel = input<string | undefined>(undefined)
  readonly disabled = input<boolean | undefined>(undefined)
  readonly invalid = input<boolean | undefined>(undefined)
  readonly readOnly = input<boolean | undefined>(undefined)
  readonly dir = input<string | undefined>(undefined)
  readonly label = input<string | undefined>(undefined)
  readonly hint = input<string | undefined>(undefined)
  readonly errorText = input<string | undefined>(undefined)
  readonly markers = input<number[] | undefined>(undefined)
  readonly sideMarkers = input<boolean | undefined>(undefined)
  readonly name = input<string | string[] | undefined>(undefined)
  readonly getAriaValueText = input<
    ((details: {value: number}) => string) | undefined
  >(undefined)
  readonly origin = input<"start" | "center" | "end" | undefined>(undefined)

  readonly valueChanged = output<{value: number[]}>()
  readonly valueChangedEnd = output<{value: number[]}>()
}

@Component({
  imports: [SliderModule],
  template: `
    <button type="button" [attr.data-test-id]="testIds.focusTarget">
      Focus target
    </button>
    <div
      q-slider-root
      [aria-label]="ariaLabel()"
      [attr.data-test-id]="testIds.sliderRoot"
      [defaultValue]="defaultValue()"
      [dir]="dir()"
      [disabled]="disabled()"
      [getAriaValueText]="getAriaValueText()"
      [invalid]="invalid()"
      [max]="max()"
      [min]="min()"
      [minStepsBetweenThumbs]="minStepsBetweenThumbs()"
      [name]="name()"
      [orientation]="orientation()"
      [origin]="origin()"
      [readOnly]="readOnly()"
      [step]="step()"
      (valueChanged)="valueChanged.emit($event)"
      (valueChangedEnd)="valueChangedEnd.emit($event)"
    >
      @if (label()) {
        <label q-slider-label [attr.data-test-id]="testIds.sliderLabel">
          {{ label() }}
        </label>
      }
      <div
        q-slider-value-text
        [attr.data-test-id]="testIds.sliderValueText"
      ></div>

      @if (sideMarkers()) {
        <span q-slider-min [attr.data-test-id]="testIds.sliderMin"></span>
      }

      <div q-slider-control [attr.data-test-id]="testIds.sliderControl">
        <div q-slider-track>
          <div q-slider-range></div>
        </div>

        @if (markers()) {
          <div
            q-slider-marker-group
            [attr.data-test-id]="testIds.sliderMarkerGroup"
          >
            @for (markerValue of markers(); track markerValue) {
              <span
                q-slider-marker
                [attr.data-test-id]="testIds.sliderMarker + '-' + markerValue"
                [value]="markerValue"
              >
                {{ markerValue }}
              </span>
            }
          </div>
        }

        @let thumbCount = (defaultValue() ?? []).length;
        @for (idx of [0, 1]; track idx) {
          @if (idx < thumbCount) {
            <div
              q-slider-thumb
              [attr.data-test-id]="
                idx === 0 ? testIds.sliderThumb0 : testIds.sliderThumb1
              "
              [index]="idx"
              [name]="getThumbName(idx)"
            >
              <input
                q-slider-hidden-input
                [attr.data-test-id]="
                  idx === 0 ? testIds.sliderInput0 : testIds.sliderInput1
                "
              />
            </div>
          }
        }
      </div>

      @if (sideMarkers()) {
        <span q-slider-max [attr.data-test-id]="testIds.sliderMax"></span>
      }

      @if (hint()) {
        <span q-slider-hint [attr.data-test-id]="testIds.sliderHint">
          {{ hint() }}
        </span>
      }
      @if (errorText()) {
        <span q-slider-error-text [attr.data-test-id]="testIds.sliderErrorText">
          {{ errorText() }}
        </span>
      }
    </div>
  `,
})
class CompositeSliderComponent {
  readonly testIds = testIds

  readonly defaultValue = input<number[] | undefined>(undefined)
  readonly max = input<number | undefined>(undefined)
  readonly min = input<number | undefined>(undefined)
  readonly step = input<number | undefined>(undefined)
  readonly minStepsBetweenThumbs = input<number | undefined>(undefined)
  readonly orientation = input<"vertical" | "horizontal" | undefined>(undefined)
  readonly ariaLabel = input<string | undefined>(undefined)
  readonly disabled = input<boolean | undefined>(undefined)
  readonly invalid = input<boolean | undefined>(undefined)
  readonly readOnly = input<boolean | undefined>(undefined)
  readonly dir = input<string | undefined>(undefined)
  readonly label = input<string | undefined>(undefined)
  readonly hint = input<string | undefined>(undefined)
  readonly errorText = input<string | undefined>(undefined)
  readonly markers = input<number[] | undefined>(undefined)
  readonly sideMarkers = input<boolean | undefined>(undefined)
  readonly name = input<string | string[] | undefined>(undefined)
  readonly getAriaValueText = input<
    ((details: {value: number}) => string) | undefined
  >(undefined)
  readonly origin = input<"start" | "center" | "end" | undefined>(undefined)

  readonly valueChanged = output<{value: number[]}>()
  readonly valueChangedEnd = output<{value: number[]}>()

  getThumbName(index: number): string | undefined {
    const nameValue = this.name()
    if (!nameValue) {
      return undefined
    }
    if (typeof nameValue !== "string") {
      return nameValue[index]
    }
    const thumbCount = (this.defaultValue() ?? []).length
    return thumbCount === 1 ? nameValue : `${nameValue}${index}`
  }
}

const testCases: MultiComponentTest[] = [
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`default value — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [50]},
        })

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await expect.element(valueText).toHaveTextContent("50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`range — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [25, 75]},
        })

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)
        const input0 =
          component === SimpleSliderComponent
            ? container.querySelectorAll("input")[0]
            : page.getByTestId(testIds.sliderInput0)
        const input1 =
          component === SimpleSliderComponent
            ? container.querySelectorAll("input")[1]
            : page.getByTestId(testIds.sliderInput1)

        await expect.element(valueText).toHaveTextContent("25 - 75")
        await expect.element(input0).toHaveValue("25")
        await expect.element(input1).toHaveValue("75")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`aria-value[min|max|now] — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            max: 80,
            min: 20,
          },
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(thumb).toHaveAttribute("aria-valuemin", "20")
        await expect.element(thumb).toHaveAttribute("aria-valuemax", "80")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`disabled state — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            disabled: true,
          },
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const root =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="root"]')
            : page.getByTestId(testIds.sliderRoot)

        await expect.element(thumb).toHaveAttribute("aria-disabled", "true")
        await expect.element(root).toHaveAttribute("data-disabled")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`invalid state — ${component.name}`, async () => {
        await render(component, {
          inputs: {
            defaultValue: [50],
            invalid: true,
          },
        })

        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("data-invalid")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`keyboard navigation - right/left arrow keys — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [50]},
        })

        await clickFocusTarget()
        await userEvent.tab()

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")
        await expect.element(valueText).toHaveTextContent("51")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "51")

        await userEvent.keyboard("{ArrowLeft}")
        await expect.element(valueText).toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`keyboard navigation - PageUp/PageDown keys — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [50]},
        })

        await clickFocusTarget()
        await userEvent.tab()

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await userEvent.keyboard("{PageUp}")
        await expect.element(valueText).toHaveTextContent("60")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "60")

        await userEvent.keyboard("{PageDown}")
        await expect.element(valueText).toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`keyboard navigation - home/end keys — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            max: 90,
            min: 10,
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await userEvent.keyboard("{End}")
        await expect.element(valueText).toHaveTextContent("90")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "90")

        await userEvent.keyboard("{Home}")
        await expect.element(valueText).toHaveTextContent("10")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "10")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`respects min — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [10]},
        })

        await clickFocusTarget()
        await userEvent.tab()

        for (let i = 0; i < 15; i++) {
          await userEvent.keyboard("{ArrowLeft}")
        }

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "0")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`respects max — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [90]},
        })

        await clickFocusTarget()
        await userEvent.tab()

        for (let i = 0; i < 15; i++) {
          await userEvent.keyboard("{ArrowRight}")
        }

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`respects step — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [50], step: 5},
        })

        await clickFocusTarget()
        await userEvent.tab()

        await userEvent.keyboard("{ArrowRight}")

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await expect.element(valueText).toHaveTextContent("55")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "55")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`range slider respects minStepsBetweenThumbs — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50, 70],
            minStepsBetweenThumbs: 10,
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        for (let i = 0; i < 15; i++) {
          await userEvent.keyboard("{ArrowRight}")
        }

        const firstThumb =
          component === SimpleSliderComponent
            ? container.querySelectorAll('[data-part="thumb"]')[0]
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(firstThumb).toHaveAttribute("aria-valuenow", "60")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`aria-orientation — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            orientation: "vertical",
          },
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const root =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="root"]')
            : page.getByTestId(testIds.sliderRoot)

        await expect
          .element(thumb)
          .toHaveAttribute("aria-orientation", "vertical")
        await expect
          .element(root)
          .toHaveAttribute("data-orientation", "vertical")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`aria-label — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            ariaLabel: "Volume control",
            defaultValue: [50],
          },
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect
          .element(thumb)
          .toHaveAttribute("aria-label", "Volume control")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`focus state — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [50]},
        })

        await clickFocusTarget()
        await userEvent.tab()

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)
        const root =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="root"]')
            : page.getByTestId(testIds.sliderRoot)

        await expect.element(thumb).toHaveFocus()
        await expect.element(thumb).toHaveAttribute("data-focus")
        await expect.element(root).toHaveAttribute("data-focus")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`renders label — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            label: "Volume",
          },
        })

        const label =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="label"]')
            : page.getByTestId(testIds.sliderLabel)

        await expect.element(label).toBeVisible()
        await expect.element(label).toHaveTextContent("Volume")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`associates label with thumbs via aria-labelledby — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            label: "Volume",
          },
        })

        if (component === SimpleSliderComponent) {
          const label = container.querySelector('[data-part="label"]')
          const labelId = label?.getAttribute("id")
          const thumb = container.querySelector('[data-part="thumb"]')
          expect(thumb).toHaveAttribute("aria-labelledby", labelId!)
        } else {
          const labelId = page
            .getByTestId(testIds.sliderLabel)
            .element()
            .getAttribute("id")
          const thumb = page.getByTestId(testIds.sliderThumb0)
          await expect
            .element(thumb)
            .toHaveAttribute("aria-labelledby", labelId!)
        }
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`renders hint text — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            hint: "Adjust volume from 0 to 100",
          },
        })

        const hint =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="hint"]')
            : page.getByTestId(testIds.sliderHint)

        await expect.element(hint).toBeVisible()
        await expect
          .element(hint)
          .toHaveTextContent("Adjust volume from 0 to 100")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`hint is hidden when invalid — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            hint: "Adjust volume from 0 to 100",
            invalid: true,
          },
        })

        const hint =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="hint"]')
            : page.getByTestId(testIds.sliderHint)

        await expect.element(hint).not.toBeVisible()
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`renders error text when invalid — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            errorText: "Value must be between 20 and 80",
            invalid: true,
          },
        })

        const errorText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="error-text"]')
            : page.getByTestId(testIds.sliderErrorText)

        await expect.element(errorText).toBeVisible()
        await expect
          .element(errorText)
          .toHaveTextContent("Value must be between 20 and 80")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`error text is hidden when not invalid — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            errorText: "Value must be between 20 and 80",
          },
        })

        const errorText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="error-text"]')
            : page.getByTestId(testIds.sliderErrorText)

        await expect.element(errorText).not.toBeVisible()
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`renders markers at specified values — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            markers: [0, 25, 50, 75, 100],
          },
        })

        if (component === SimpleSliderComponent) {
          const markers = container.querySelectorAll('[data-part="marker"]')
          expect(markers.length).toBe(5)
          const markerValues = Array.from(markers).map((m) => m.textContent)
          expect(markerValues).toEqual(["0", "25", "50", "75", "100"])
        } else {
          await expect
            .element(page.getByTestId(testIds.sliderMarkerGroup))
            .toBeVisible()

          for (const value of [0, 25, 50, 75, 100]) {
            await expect
              .element(page.getByTestId(`${testIds.sliderMarker}-${value}`))
              .toBeVisible()
            await expect
              .element(page.getByTestId(`${testIds.sliderMarker}-${value}`))
              .toHaveTextContent(String(value))
          }
        }
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`markers have correct data-state based on value — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            markers: [25, 50, 75],
          },
        })

        const marker25 =
          component === SimpleSliderComponent
            ? container.querySelectorAll('[data-part="marker"]')[0]
            : page.getByTestId(`${testIds.sliderMarker}-25`)
        const marker50 =
          component === SimpleSliderComponent
            ? container.querySelectorAll('[data-part="marker"]')[1]
            : page.getByTestId(`${testIds.sliderMarker}-50`)
        const marker75 =
          component === SimpleSliderComponent
            ? container.querySelectorAll('[data-part="marker"]')[2]
            : page.getByTestId(`${testIds.sliderMarker}-75`)

        await expect
          .element(marker25)
          .toHaveAttribute("data-state", "under-value")
        await expect.element(marker50).toHaveAttribute("data-state", "at-value")
        await expect
          .element(marker75)
          .toHaveAttribute("data-state", "over-value")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`renders min and max markers with default range — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            sideMarkers: true,
          },
        })

        const min =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="min"]')
            : page.getByTestId(testIds.sliderMin)
        const max =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="max"]')
            : page.getByTestId(testIds.sliderMax)

        await expect.element(min).toBeVisible()
        await expect.element(max).toBeVisible()
        await expect.element(min).toHaveTextContent("0")
        await expect.element(max).toHaveTextContent("100")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`renders min and max markers with custom range — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [30],
            max: 50,
            min: 10,
            sideMarkers: true,
          },
        })

        const min =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="min"]')
            : page.getByTestId(testIds.sliderMin)
        const max =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="max"]')
            : page.getByTestId(testIds.sliderMax)

        await expect.element(min).toHaveTextContent("10")
        await expect.element(max).toHaveTextContent("50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`min and max have data-value attributes — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [30],
            max: 50,
            min: 10,
            sideMarkers: true,
          },
        })

        const min =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="min"]')
            : page.getByTestId(testIds.sliderMin)
        const max =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="max"]')
            : page.getByTestId(testIds.sliderMax)

        await expect.element(min).toHaveAttribute("data-value", "10")
        await expect.element(max).toHaveAttribute("data-value", "50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`calls valueChanged when value changes via keyboard — ${component.name}`, async () => {
        const valueChangedSpy = vi.fn()
        await render(component, {
          inputs: {defaultValue: [50]},
          on: {
            valueChanged: (event) => {
              valueChangedSpy(event)
            },
          },
        })

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")

        await expect
          .poll(() => valueChangedSpy)
          .toHaveBeenCalledWith({
            value: [51],
          })
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`calls valueChanged with both values in range slider — ${component.name}`, async () => {
        const valueChangedSpy = vi.fn()
        await render(component, {
          inputs: {defaultValue: [25, 75]},
          on: {
            valueChanged: (event) => {
              valueChangedSpy(event)
            },
          },
        })

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")

        await expect
          .poll(() => valueChangedSpy)
          .toHaveBeenCalledWith({
            value: [26, 75],
          })
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`calls valueChanged multiple times for multiple changes — ${component.name}`, async () => {
        const valueChangedSpy = vi.fn()
        await render(component, {
          inputs: {defaultValue: [50]},
          on: {
            valueChanged: (event) => {
              valueChangedSpy(event)
            },
          },
        })

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")
        await userEvent.keyboard("{ArrowRight}")

        await expect.poll(() => valueChangedSpy).toHaveBeenCalledTimes(2)
        await expect
          .poll(() => valueChangedSpy)
          .toHaveBeenNthCalledWith(1, {value: [51]})
        await expect
          .poll(() => valueChangedSpy)
          .toHaveBeenNthCalledWith(2, {value: [52]})
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`calls valueChangedEnd when keyboard interaction completes — ${component.name}`, async () => {
        const valueChangedEndSpy = vi.fn()
        await render(component, {
          inputs: {defaultValue: [50]},
          on: {
            valueChangedEnd: (event) => {
              valueChangedEndSpy(event)
            },
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        if (component === SimpleSliderComponent) {
          await userEvent.keyboard("{ArrowRight}")
          await userEvent.keyboard("{ArrowRight}")

          await clickFocusTarget()

          await expect
            .poll(() => valueChangedEndSpy)
            .toHaveBeenCalledWith({
              value: [52],
            })
        } else {
          const thumb = page.getByTestId(testIds.sliderThumb0)
          await expect.element(thumb).toHaveFocus()

          await userEvent.keyboard("{ArrowRight}")
          await userEvent.keyboard("{ArrowRight}")

          await clickFocusTarget()

          await expect
            .poll(() => valueChangedEndSpy)
            .toHaveBeenCalledWith({
              value: [52],
            })
        }
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`applies RTL direction to slider — ${component.name}`, async () => {
        await render(component, {inputs: {defaultValue: [50], dir: "rtl"}})

        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("dir", "rtl")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`arrow key behavior is reversed in RTL mode — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [50], dir: "rtl"},
        })

        await clickFocusTarget()
        await userEvent.tab()

        await userEvent.keyboard("{ArrowLeft}")

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await expect.element(valueText).toHaveTextContent("51")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`step of 0.1 for decimal values — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [5.0],
            max: 10,
            min: 0,
            step: 0.1,
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        await userEvent.keyboard("{ArrowRight}")

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "5.1")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`large step value — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            step: 25,
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        await userEvent.keyboard("{ArrowRight}")

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)

        await expect.element(valueText).toHaveTextContent("75")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`prevents value changes when readOnly — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            readOnly: true,
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        await userEvent.keyboard("{ArrowRight}")

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)
        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(valueText).toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`handles value at minimum boundary — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [0]},
        })

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)
        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(valueText).toHaveTextContent("0")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "0")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`handles value at maximum boundary — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [100]},
        })

        const valueText =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="value-text"]')
            : page.getByTestId(testIds.sliderValueText)
        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(valueText).toHaveTextContent("100")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`prevents thumbs from crossing in range slider — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [40, 60],
            minStepsBetweenThumbs: 5,
          },
        })

        await clickFocusTarget()
        await userEvent.tab()

        for (let i = 0; i < 20; i++) {
          await userEvent.keyboard("{ArrowRight}")
        }

        if (component === SimpleSliderComponent) {
          const thumbs = container.querySelectorAll('[data-part="thumb"]')
          const firstValue = Number(thumbs[0]?.getAttribute("aria-valuenow"))
          expect(firstValue).toBeLessThanOrEqual(55)
        } else {
          const firstThumb = page.getByTestId(testIds.sliderThumb0)
          await expect.element(firstThumb).toHaveFocus()
          const firstValue = Number(
            firstThumb.element().getAttribute("aria-valuenow"),
          )
          expect(firstValue).toBeLessThanOrEqual(55)
        }
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`clamps out of range defaultValue to min — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [-10]},
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "0")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`clamps out of range defaultValue to max — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {defaultValue: [150]},
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`customizes aria-valuetext for thumb — ${component.name}`, async () => {
        const getAriaValueText = (details: {value: number}) =>
          `${details.value} percent`

        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            getAriaValueText,
          },
        })

        const thumb =
          component === SimpleSliderComponent
            ? container.querySelector('[data-part="thumb"]')
            : page.getByTestId(testIds.sliderThumb0)

        await expect
          .element(thumb)
          .toHaveAttribute("aria-valuetext", "50 percent")
      })
    },
  },
]

const formTests: MultiComponentTest[] = [
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`form: single name single thumb — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [50],
            name: "volume",
          },
        })

        const input =
          component === SimpleSliderComponent
            ? container.querySelector("input")
            : page.getByTestId(testIds.sliderInput0)

        await expect.element(input).toHaveValue("50")
        await expect.element(input).toHaveAttribute("name", "volume")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`form: single name two thumbs — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [25, 75],
            name: "range",
          },
        })

        const input0 =
          component === SimpleSliderComponent
            ? container.querySelectorAll("input")[0]
            : page.getByTestId(testIds.sliderInput0)
        const input1 =
          component === SimpleSliderComponent
            ? container.querySelectorAll("input")[1]
            : page.getByTestId(testIds.sliderInput1)

        await expect.element(input0).toHaveValue("25")
        await expect.element(input0).toHaveAttribute("name", "range0")
        await expect.element(input1).toHaveValue("75")
        await expect.element(input1).toHaveAttribute("name", "range1")
      })
    },
  },
  {
    composite: () => CompositeSliderComponent,
    simple: () => SimpleSliderComponent,
    testCase(component) {
      test(`form: two names two thumbs — ${component.name}`, async () => {
        const {container} = await render(component, {
          inputs: {
            defaultValue: [25, 75],
            name: ["min", "max"],
          },
        })

        const input0 =
          component === SimpleSliderComponent
            ? container.querySelectorAll("input")[0]
            : page.getByTestId(testIds.sliderInput0)
        const input1 =
          component === SimpleSliderComponent
            ? container.querySelectorAll("input")[1]
            : page.getByTestId(testIds.sliderInput1)

        await expect.element(input0).toHaveValue("25")
        await expect.element(input0).toHaveAttribute("name", "min")
        await expect.element(input1).toHaveValue("75")
        await expect.element(input1).toHaveAttribute("name", "max")
      })
    },
  },
]

describe("Slider", () => {
  runTests(testCases)
  runTests(formTests)
})
