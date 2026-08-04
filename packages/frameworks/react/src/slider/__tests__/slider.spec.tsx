import {type FormEvent, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import type {MultiComponentTestCase} from "@qualcomm-ui/react-test-utils"
import {Slider} from "@qualcomm-ui/react/slider"

import {
  clickFocusTarget,
  CompositeSlider,
  SimpleSlider,
  testIds,
  TestSlider,
} from "./test-slider"

const thumbIndicatorTestId = "slider-thumb-indicator"

async function focusSliderThumb(index = 0) {
  await clickFocusTarget()
  for (let i = 0; i <= index; i++) {
    await userEvent.tab()
  }

  const thumb = page.getByRole("slider").nth(index)
  await expect.element(thumb).toHaveFocus()
  return thumb
}

const tests: MultiComponentTestCase[] = [
  {
    composite: () => <CompositeSlider defaultValue={[50]} />,
    simple: () => <SimpleSlider defaultValue={[50]} />,
    testCase(component) {
      test(`default value — ${component.name}`, async () => {
        await render(component())
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("50")
      })
    },
  },
  {
    composite: () => <CompositeSlider value={[75]} />,
    simple: () => <SimpleSlider value={[75]} />,
    testCase(component) {
      test(`controlled value — ${component.name}`, async () => {
        await render(component())
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("75")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[25, 75]} />,
    simple: () => <SimpleSlider defaultValue={[25, 75]} />,
    testCase(component) {
      test(`range — ${component.name}`, async () => {
        await render(component())
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("25 - 75")

        const sliders = page.getByRole("slider")
        await expect
          .element(sliders.nth(0))
          .toHaveAttribute("aria-valuenow", "25")
        await expect
          .element(sliders.nth(1))
          .toHaveAttribute("aria-valuenow", "75")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} max={80} min={20} />,
    simple: () => <SimpleSlider defaultValue={[50]} max={80} min={20} />,
    testCase(component) {
      test(`aria-value[min|max|now] — ${component.name}`, async () => {
        await render(component())

        const thumb = page.getByTestId(testIds.sliderThumb0)
        await expect.element(thumb).toHaveAttribute("aria-valuemin", "20")
        await expect.element(thumb).toHaveAttribute("aria-valuemax", "80")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} disabled />,
    simple: () => <SimpleSlider defaultValue={[50]} disabled />,
    testCase(component) {
      test(`disabled state — ${component.name}`, async () => {
        await render(component())

        const thumb = page.getByTestId(testIds.sliderThumb0)
        await expect.element(thumb).toHaveAttribute("aria-disabled", "true")
        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("data-disabled")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} invalid />,
    simple: () => <SimpleSlider defaultValue={[50]} invalid />,
    testCase(component) {
      test(`invalid state — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("data-invalid")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} />,
    simple: () => <SimpleSlider defaultValue={[50]} />,
    testCase(component) {
      test(`keyboard navigation - right/left arrow keys — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("51")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "51")

        await userEvent.keyboard("{ArrowLeft}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} />,
    simple: () => <SimpleSlider defaultValue={[50]} />,
    testCase(component) {
      test(`keyboard navigation - PageUp/PageDown keys — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{PageUp}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("60")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "60")

        await userEvent.keyboard("{PageDown}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} max={90} min={10} />,
    simple: () => <SimpleSlider defaultValue={[50]} max={90} min={10} />,
    testCase(component) {
      test(`keyboard navigation - home/end keys — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{End}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("90")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "90")

        await userEvent.keyboard("{Home}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("10")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "10")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[10]} />,
    simple: () => <SimpleSlider defaultValue={[10]} />,
    testCase(component) {
      test(`respects min — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        for (let i = 0; i < 15; i++) {
          await userEvent.keyboard("{ArrowLeft}")
        }

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "0")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[90]} />,
    simple: () => <SimpleSlider defaultValue={[90]} />,
    testCase(component) {
      test(`respects max — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        for (let i = 0; i < 15; i++) {
          await userEvent.keyboard("{ArrowRight}")
        }

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} step={5} />,
    simple: () => <SimpleSlider defaultValue={[50]} step={5} />,
    testCase(component) {
      test(`respects step — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("55")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "55")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[50, 70]} minStepsBetweenThumbs={10} />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[50, 70]} minStepsBetweenThumbs={10} />
    ),
    testCase(component) {
      test(`range slider respects minStepsBetweenThumbs — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        await userEvent.tab()
        const firstThumb = page.getByRole("slider").first()
        await expect.element(firstThumb).toHaveFocus()

        for (let i = 0; i < 15; i++) {
          await userEvent.keyboard("{ArrowRight}")
        }

        await expect.element(firstThumb).toHaveAttribute("aria-valuenow", "60")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[50]} orientation="vertical" />
    ),
    simple: () => <SimpleSlider defaultValue={[50]} orientation="vertical" />,
    testCase(component) {
      test(`aria-orientation — ${component.name}`, async () => {
        await render(component())

        const thumb = page.getByTestId(testIds.sliderThumb0)
        await expect
          .element(thumb)
          .toHaveAttribute("aria-orientation", "vertical")
        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("data-orientation", "vertical")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[50]} orientation="vertical" />
    ),
    simple: () => <SimpleSlider defaultValue={[50]} orientation="vertical" />,
    testCase(component) {
      test(`vertical keyboard navigation uses up/down arrows — ${component.name}`, async () => {
        await render(component())

        const thumb = await focusSliderThumb()

        await userEvent.keyboard("{ArrowRight}")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")

        await userEvent.keyboard("{ArrowUp}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("51")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "51")

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} />,
    simple: () => <SimpleSlider defaultValue={[50]} />,
    testCase(component) {
      test(`horizontal keyboard navigation ignores up/down arrows — ${component.name}`, async () => {
        await render(component())

        const thumb = await focusSliderThumb()

        await userEvent.keyboard("{ArrowUp}")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")

        await userEvent.keyboard("{ArrowDown}")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider aria-label="Volume control" defaultValue={[50]} />
    ),
    simple: () => (
      <SimpleSlider aria-label="Volume control" defaultValue={[50]} />
    ),
    testCase(component) {
      test(`aria-label — ${component.name}`, async () => {
        await render(component())

        const thumb = page.getByTestId(testIds.sliderThumb0)
        await expect
          .element(thumb)
          .toHaveAttribute("aria-label", "Volume control")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider
        aria-label={["Minimum volume", "Maximum volume"]}
        defaultValue={[25, 75]}
      />
    ),
    simple: () => (
      <SimpleSlider
        aria-label={["Minimum volume", "Maximum volume"]}
        defaultValue={[25, 75]}
      />
    ),
    testCase(component) {
      test(`supports separate accessible names for each thumb — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByRole("slider", {name: "Minimum volume"}))
          .toHaveAttribute("aria-valuenow", "25")
        await expect
          .element(page.getByRole("slider", {name: "Maximum volume"}))
          .toHaveAttribute("aria-valuenow", "75")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} />,
    simple: () => <SimpleSlider defaultValue={[50]} />,
    testCase(component) {
      test(`focus state — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await expect.element(thumb).toHaveAttribute("data-focus")
        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("data-focus")
      })
    },
  },
  {
    composite: ({onFocusChange}) => (
      <CompositeSlider defaultValue={[50]} onFocusChange={onFocusChange} />
    ),
    simple: ({onFocusChange}) => (
      <SimpleSlider defaultValue={[50]} onFocusChange={onFocusChange} />
    ),
    testCase(component) {
      test(`calls onFocusChange with the focused thumb and clears it on blur — ${component.name}`, async () => {
        const onFocusChange = vi.fn()

        await render(component({onFocusChange}))

        await focusSliderThumb()
        await expect
          .poll(() => onFocusChange.mock.calls.map(([details]) => details))
          .toEqual([{focusedIndex: 0, value: [50]}])

        await clickFocusTarget()
        await expect
          .poll(() => onFocusChange.mock.calls.map(([details]) => details))
          .toEqual([
            {focusedIndex: 0, value: [50]},
            {focusedIndex: -1, value: [50]},
          ])
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} readOnly />,
    simple: () => <SimpleSlider defaultValue={[50]} readOnly />,
    testCase(component) {
      test(`prevents value changes when readOnly — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("50")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeSlider
        defaultValue={[50]}
        onValueChange={onValueChange}
        readOnly
      />
    ),
    simple: ({onValueChange}) => (
      <SimpleSlider
        defaultValue={[50]}
        onValueChange={onValueChange}
        readOnly
      />
    ),
    testCase(component) {
      test(`does not call onValueChange for readOnly keyboard input — ${component.name}`, async () => {
        const onValueChange = vi.fn()

        await render(component({onValueChange}))

        await focusSliderThumb()
        await userEvent.keyboard("{ArrowRight}")

        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeSlider defaultValue={[50]} onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleSlider defaultValue={[50]} onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`inherits disabled state from a disabled fieldset — ${component.name}`, async () => {
        const onValueChange = vi.fn()

        await render(
          <fieldset disabled>
            {component({onValueChange})}
            <button type="button">After slider</button>
          </fieldset>,
        )

        const thumb = page.getByRole("slider").first()
        await expect.element(thumb).toHaveAttribute("aria-disabled", "true")

        await userEvent.tab()
        await expect.element(thumb).not.toHaveFocus()
        await userEvent.keyboard("{ArrowRight}")

        await expect.element(thumb).toHaveAttribute("aria-valuenow", "50")
        expect(onValueChange).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[0]} />,
    simple: () => <SimpleSlider defaultValue={[0]} />,
    testCase(component) {
      test(`handles value at minimum boundary — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("0")
        await expect
          .element(page.getByTestId(testIds.sliderThumb0))
          .toHaveAttribute("aria-valuenow", "0")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[100]} />,
    simple: () => <SimpleSlider defaultValue={[100]} />,
    testCase(component) {
      test(`handles value at maximum boundary — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("100")
        await expect
          .element(page.getByTestId(testIds.sliderThumb0))
          .toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[40, 60]} minStepsBetweenThumbs={5} />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[40, 60]} minStepsBetweenThumbs={5} />
    ),
    testCase(component) {
      test(`prevents thumbs from crossing in range slider — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        await userEvent.tab()
        const firstThumb = page.getByRole("slider").first()
        await expect.element(firstThumb).toHaveFocus()

        for (let i = 0; i < 20; i++) {
          await userEvent.keyboard("{ArrowRight}")
        }

        const firstValue = Number(
          firstThumb.element().getAttribute("aria-valuenow"),
        )
        expect(firstValue).toBeLessThanOrEqual(55)
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[30, 50]} minStepsBetweenThumbs={10} />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[30, 50]} minStepsBetweenThumbs={10} />
    ),
    testCase(component) {
      test(`range slider constrains the second thumb against the first thumb — ${component.name}`, async () => {
        await render(component())

        const secondThumb = await focusSliderThumb(1)

        for (let i = 0; i < 20; i++) {
          await userEvent.keyboard("{ArrowLeft}")
        }

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("30 - 40")
        await expect.element(secondThumb).toHaveAttribute("aria-valuemin", "40")
        await expect.element(secondThumb).toHaveAttribute("aria-valuenow", "40")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[-10]} />,
    simple: () => <SimpleSlider defaultValue={[-10]} />,
    testCase(component) {
      test(`clamps out of range defaultValue to min — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderThumb0))
          .toHaveAttribute("aria-valuenow", "0")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[150]} />,
    simple: () => <SimpleSlider defaultValue={[150]} />,
    testCase(component) {
      test(`clamps out of range defaultValue to max — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderThumb0))
          .toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[5.0]} max={10} min={0} step={0.1} />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[5.0]} max={10} min={0} step={0.1} />
    ),
    testCase(component) {
      test(`step of 0.1 for decimal values — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "5.1")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} step={25} />,
    simple: () => <SimpleSlider defaultValue={[50]} step={25} />,
    testCase(component) {
      test(`large step value — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("75")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} dir="rtl" />,
    simple: () => <SimpleSlider defaultValue={[50]} dir="rtl" />,
    testCase(component) {
      test(`applies RTL direction to slider — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderRoot))
          .toHaveAttribute("dir", "rtl")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} dir="rtl" />,
    simple: () => <SimpleSlider defaultValue={[50]} dir="rtl" />,
    testCase(component) {
      test(`arrow key behavior is reversed in RTL mode — ${component.name}`, async () => {
        await render(component())

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowLeft}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("51")
      })
    },
  },
  {
    composite: ({onValueChange, value}) => (
      <CompositeSlider onValueChange={onValueChange} value={value} />
    ),
    simple: ({onValueChange, value}) => (
      <SimpleSlider onValueChange={onValueChange} value={value} />
    ),
    testCase(component) {
      test(`controlled slider updates when onValueChange commits the next value — ${component.name}`, async () => {
        const onValueChange = vi.fn()

        function ControlledSlider() {
          const [value, setValue] = useState([40])

          return (
            <>
              {component({
                onValueChange(details: {value: number[]}) {
                  onValueChange(details)
                  setValue(details.value)
                },
                value,
              })}
            </>
          )
        }

        await render(<ControlledSlider />)

        const thumb = await focusSliderThumb()
        await userEvent.keyboard("{ArrowRight}")

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("41")
        await expect.element(thumb).toHaveAttribute("aria-valuenow", "41")
        expect(onValueChange).toHaveBeenCalledWith({value: [41]})
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeSlider defaultValue={[50]} onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleSlider defaultValue={[50]} onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`calls onValueChange when value changes via keyboard — ${component.name}`, async () => {
        const onValueChange = vi.fn()

        await render(component({onValueChange}))

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")

        expect(onValueChange).toHaveBeenCalledWith({value: [51]})
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeSlider defaultValue={[25, 75]} onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleSlider defaultValue={[25, 75]} onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`calls onValueChange with both values in range slider — ${component.name}`, async () => {
        const onValueChange = vi.fn()

        await render(component({onValueChange}))

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")

        expect(onValueChange).toHaveBeenCalledWith({value: [26, 75]})
      })
    },
  },
  {
    composite: ({onValueChange}) => (
      <CompositeSlider defaultValue={[50]} onValueChange={onValueChange} />
    ),
    simple: ({onValueChange}) => (
      <SimpleSlider defaultValue={[50]} onValueChange={onValueChange} />
    ),
    testCase(component) {
      test(`calls onValueChange multiple times for multiple changes — ${component.name}`, async () => {
        const onValueChange = vi.fn()

        await render(component({onValueChange}))

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")
        await userEvent.keyboard("{ArrowRight}")

        expect(onValueChange).toHaveBeenCalledTimes(2)
        expect(onValueChange).toHaveBeenNthCalledWith(1, {value: [51]})
        expect(onValueChange).toHaveBeenNthCalledWith(2, {value: [52]})
      })
    },
  },
  {
    composite: ({onValueChangeEnd}) => (
      <CompositeSlider
        defaultValue={[50]}
        onValueChangeEnd={onValueChangeEnd}
      />
    ),
    simple: ({onValueChangeEnd}) => (
      <SimpleSlider defaultValue={[50]} onValueChangeEnd={onValueChangeEnd} />
    ),
    testCase(component) {
      test(`calls onValueChangeEnd when keyboard interaction completes — ${component.name}`, async () => {
        const onValueChangeEnd = vi.fn()

        await render(component({onValueChangeEnd}))

        await clickFocusTarget()
        const thumb = page.getByTestId(testIds.sliderThumb0)
        await userEvent.tab()
        await expect.element(thumb).toHaveFocus()

        await userEvent.keyboard("{ArrowRight}")
        await userEvent.keyboard("{ArrowRight}")

        await clickFocusTarget()

        expect(onValueChangeEnd).toHaveBeenCalledWith({value: [52]})
      })
    },
  },
  {
    composite: ({getAriaValueText}) => (
      <CompositeSlider
        defaultValue={[50]}
        getAriaValueText={getAriaValueText}
      />
    ),
    simple: ({getAriaValueText}) => (
      <SimpleSlider defaultValue={[50]} getAriaValueText={getAriaValueText} />
    ),
    testCase(component) {
      test(`customizes aria-valuetext for thumb — ${component.name}`, async () => {
        const getAriaValueText = (details: {value: number}) =>
          `${details.value} percent`

        await render(component({getAriaValueText}))

        await expect
          .element(page.getByTestId(testIds.sliderThumb0))
          .toHaveAttribute("aria-valuetext", "50 percent")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider
        defaultValue={[25, 75]}
        getAriaValueText={({index, value}) =>
          `${index === 0 ? "Minimum" : "Maximum"} ${value} percent`
        }
      />
    ),
    simple: () => (
      <SimpleSlider
        defaultValue={[25, 75]}
        getAriaValueText={({index, value}) =>
          `${index === 0 ? "Minimum" : "Maximum"} ${value} percent`
        }
      />
    ),
    testCase(component) {
      test(`customizes aria-valuetext for each range thumb — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByRole("slider").nth(0))
          .toHaveAttribute("aria-valuetext", "Minimum 25 percent")
        await expect
          .element(page.getByRole("slider").nth(1))
          .toHaveAttribute("aria-valuetext", "Maximum 75 percent")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} label="Volume" />,
    simple: () => <SimpleSlider defaultValue={[50]} label="Volume" />,
    testCase(component) {
      test(`renders label — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderLabel))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.sliderLabel))
          .toHaveTextContent("Volume")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} label="Volume" />,
    simple: () => <SimpleSlider defaultValue={[50]} label="Volume" />,
    testCase(component) {
      test(`associates label with thumbs via aria-labelledby — ${component.name}`, async () => {
        await render(component())

        const labelId = page
          .getByTestId(testIds.sliderLabel)
          .element()
          .getAttribute("id")
        const thumb = page.getByRole("slider").first()

        await expect.element(thumb).toHaveAttribute("aria-labelledby", labelId!)
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[50]} hint="Adjust volume from 0 to 100" />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[50]} hint="Adjust volume from 0 to 100" />
    ),
    testCase(component) {
      test(`renders hint text — ${component.name}`, async () => {
        await render(component())

        await expect.element(page.getByTestId(testIds.sliderHint)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.sliderHint))
          .toHaveTextContent("Adjust volume from 0 to 100")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider
        defaultValue={[50]}
        hint="Adjust volume from 0 to 100"
        invalid
      />
    ),
    simple: () => (
      <SimpleSlider
        defaultValue={[50]}
        hint="Adjust volume from 0 to 100"
        invalid
      />
    ),
    testCase(component) {
      test(`hint is hidden when invalid — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderHint))
          .not.toBeVisible()
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider
        defaultValue={[50]}
        errorText="Value must be between 20 and 80"
        invalid
      />
    ),
    simple: () => (
      <SimpleSlider
        defaultValue={[50]}
        errorText="Value must be between 20 and 80"
        invalid
      />
    ),
    testCase(component) {
      test(`renders error text when invalid — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderErrorText))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.sliderErrorText))
          .toHaveTextContent("Value must be between 20 and 80")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider
        defaultValue={[50]}
        errorText="Value must be between 20 and 80"
      />
    ),
    simple: () => (
      <SimpleSlider
        defaultValue={[50]}
        errorText="Value must be between 20 and 80"
      />
    ),
    testCase(component) {
      test(`error text is hidden when not invalid — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderErrorText))
          .not.toBeVisible()
      })
    },
  },
  {
    composite: () => (
      <Slider.Root defaultValue={[50]}>
        <Slider.ValueText data-test-id={testIds.sliderValueText} />
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.HiddenInput />
          </Slider.Thumb>
        </Slider.Control>
        <Slider.Markers
          markerGroupProps={{"data-test-id": testIds.sliderMarkerGroup}}
        />
      </Slider.Root>
    ),
    simple: () => <SimpleSlider defaultValue={[50]} />,
    testCase(component) {
      test(`renders generated marker labels when marks are omitted — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderMarkerGroup))
          .toHaveTextContent("0102030405060708090100")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[50]} markers={[0, 25, 50, 75, 100]} />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[50]} markers={[0, 25, 50, 75, 100]} />
    ),
    testCase(component) {
      test(`renders markers at specified values — ${component.name}`, async () => {
        await render(component())

        const markerGroup = page.getByTestId(testIds.sliderMarkerGroup)
        await expect.element(markerGroup).toBeVisible()
        await expect.element(markerGroup).toHaveTextContent("0255075100")
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[50]} sideMarkers />,
    simple: () => <SimpleSlider defaultValue={[50]} sideMarkers />,
    testCase(component) {
      test(`renders min and max markers with default range — ${component.name}`, async () => {
        await render(component())

        await expect.element(page.getByTestId(testIds.sliderMin)).toBeVisible()
        await expect.element(page.getByTestId(testIds.sliderMax)).toBeVisible()

        await expect
          .element(page.getByTestId(testIds.sliderMin))
          .toHaveTextContent("0")
        await expect
          .element(page.getByTestId(testIds.sliderMax))
          .toHaveTextContent("100")
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[30]} max={50} min={10} sideMarkers />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[30]} max={50} min={10} sideMarkers />
    ),
    testCase(component) {
      test(`renders min and max markers with custom range — ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderMin))
          .toHaveTextContent("10")
        await expect
          .element(page.getByTestId(testIds.sliderMax))
          .toHaveTextContent("50")
      })
    },
  },
]

const thumbIndicatorTests: MultiComponentTestCase[] = [
  {
    simple: () => <Slider defaultValue={[41]} label="Volume" tooltip />,
    testCase(component) {
      test(`keeps the current value on the slider when tooltip is enabled - ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByRole("slider", {name: "Volume"}))
          .toHaveAttribute("aria-valuenow", "41")
      })
    },
  },
  {
    composite: () => (
      <div>
        <button type="button">Focus target</button>
        <Slider.Root defaultValue={[25]}>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
              <Slider.ThumbIndicator
                data-test-id={thumbIndicatorTestId}
                display={(value) => `${value}% selected`}
              />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
      </div>
    ),
    testCase(component) {
      test(`formats thumb tooltip content with a display function - ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(thumbIndicatorTestId))
          .toHaveTextContent("25% selected")

        await clickFocusTarget()
        await userEvent.tab()
        await userEvent.keyboard("{ArrowRight}")

        await expect
          .element(page.getByTestId(thumbIndicatorTestId))
          .toHaveTextContent("26% selected")
      })
    },
  },
  {
    composite: () => (
      <Slider.Root defaultValue={[25]}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.HiddenInput />
            <Slider.ThumbIndicator data-test-id={thumbIndicatorTestId}>
              Current volume
            </Slider.ThumbIndicator>
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    ),
    testCase(component) {
      test(`renders thumb tooltip children instead of the numeric value - ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(thumbIndicatorTestId))
          .toHaveTextContent("Current volume")
      })
    },
  },
  {
    composite: () => <TestSlider defaultValue={[50]} />,
    testCase(component) {
      test(`renders a baseline slider value - ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("50")
      })
    },
  },
]

const directApiTests: MultiComponentTestCase[] = [
  {
    composite: () => (
      <Slider.Root defaultValue={[25, 75]}>
        <Slider.ValueText
          data-test-id={testIds.sliderValueText}
          display={(value) => `Selected ${value[0]} through ${value[1]}`}
        />
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0}>
            <Slider.HiddenInput />
          </Slider.Thumb>
          <Slider.Thumb index={1}>
            <Slider.HiddenInput />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    ),
    simple: () => (
      <Slider
        data-test-id={testIds.sliderRoot}
        defaultValue={[25, 75]}
        display={(value) => `Selected ${value[0]} through ${value[1]}`}
        valueTextProps={{"data-test-id": testIds.sliderValueText}}
      />
    ),
    testCase(component) {
      test(`formats value text through the public display API - ${component.name}`, async () => {
        await render(component())

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("Selected 25 through 75")
      })
    },
  },
  {
    composite: ({onValueChangeEnd}) => (
      <Slider.Root
        defaultValue={[0]}
        max={100}
        onValueChangeEnd={onValueChangeEnd}
      >
        <Slider.ValueText data-test-id={testIds.sliderValueText} />
        <Slider.Control
          data-test-id={testIds.sliderControl}
          style={{height: 20, width: 200}}
        >
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} style={{height: 10, width: 10}}>
            <Slider.HiddenInput />
          </Slider.Thumb>
        </Slider.Control>
      </Slider.Root>
    ),
    simple: ({onValueChangeEnd}) => (
      <Slider
        controlProps={{
          "data-test-id": testIds.sliderControl,
          style: {height: 20, width: 200},
        }}
        defaultValue={[0]}
        max={100}
        onValueChangeEnd={onValueChangeEnd}
        thumbProps={{style: {height: 10, width: 10}}}
        valueTextProps={{"data-test-id": testIds.sliderValueText}}
      />
    ),
    testCase(component) {
      test(`sets the closest slider value from a track click - ${component.name}`, async () => {
        const onValueChangeEnd = vi.fn()

        await render(component({onValueChangeEnd}))

        await page
          .getByTestId(testIds.sliderControl)
          .click({position: {x: 150, y: 10}})

        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("75")
        await expect
          .element(page.getByRole("slider").first())
          .toHaveAttribute("aria-valuenow", "75")
        await expect
          .poll(() => onValueChangeEnd.mock.calls.at(-1)?.[0])
          .toEqual({value: [75]})
      })
    },
  },
]

let formSubmittedData: Record<string, string> = {}

function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  formSubmittedData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >
}

const formTests: MultiComponentTestCase[] = [
  {
    composite: () => <CompositeSlider defaultValue={[50]} name="volume" />,
    simple: () => <SimpleSlider defaultValue={[50]} name="volume" />,
    testCase(component) {
      test(`form: single name single thumb — ${component.name}`, async () => {
        await render(
          <form data-test-id="form" onSubmit={handleFormSubmit}>
            {component()}
            <button type="submit">Submit</button>
          </form>,
        )

        await page.getByText("Submit").click()
        expect(formSubmittedData).toEqual({volume: "50"})
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[25, 75]} name="range" />,
    simple: () => <SimpleSlider defaultValue={[25, 75]} name="range" />,
    testCase(component) {
      test(`form: single name two thumbs — ${component.name}`, async () => {
        await render(
          <form data-test-id="form" onSubmit={handleFormSubmit}>
            {component()}
            <button type="submit">Submit</button>
          </form>,
        )

        await page.getByText("Submit").click()
        expect(formSubmittedData).toEqual({range0: "25", range1: "75"})
      })
    },
  },
  {
    composite: () => (
      <CompositeSlider defaultValue={[25, 75]} thumbName={["min", "max"]} />
    ),
    simple: () => (
      <SimpleSlider defaultValue={[25, 75]} thumbName={["min", "max"]} />
    ),
    testCase(component) {
      test(`form: two names two thumbs — ${component.name}`, async () => {
        await render(
          <form data-test-id="form" onSubmit={handleFormSubmit}>
            {component()}
            <button type="submit">Submit</button>
          </form>,
        )

        await page.getByText("Submit").click()
        expect(formSubmittedData).toEqual({max: "75", min: "25"})
      })
    },
  },
  {
    composite: () => <CompositeSlider defaultValue={[60]} name="volume" />,
    simple: () => <SimpleSlider defaultValue={[60]} name="volume" />,
    testCase(component) {
      test(`form: reset restores the initial slider value — ${component.name}`, async () => {
        await render(
          <form data-test-id="form" onSubmit={handleFormSubmit}>
            {component()}
            <button type="reset">Reset</button>
            <button type="submit">Submit</button>
          </form>,
        )

        await focusSliderThumb()
        await userEvent.keyboard("{ArrowRight}")
        await userEvent.keyboard("{ArrowRight}")
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("62")

        await page.getByText("Reset").click()
        await expect
          .element(page.getByTestId(testIds.sliderValueText))
          .toHaveTextContent("60")

        await page.getByText("Submit").click()
        expect(formSubmittedData).toEqual({volume: "60"})
      })
    },
  },
]

describe("Slider", () => {
  for (const {composite, simple, testCase} of tests) {
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }

  for (const {composite, simple, testCase} of thumbIndicatorTests) {
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }

  for (const {composite, simple, testCase} of directApiTests) {
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }

  for (const {composite, simple, testCase} of formTests) {
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }
})
