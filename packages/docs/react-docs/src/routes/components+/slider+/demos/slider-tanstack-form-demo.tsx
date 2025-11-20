import type {ReactElement} from "react"

import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {Slider} from "@qualcomm-ui/react/slider"

interface FormData {
  minMaxNumber: number
  minRange: [number, number]
}

const defaultFormData: FormData = {
  minMaxNumber: 30,
  minRange: [30, 70],
}

const minmaxErrorMessage = "Value must be between 20 and 80"
const minRangeErrorMessage = "Range must be at least 30"

export function SliderTanstackFormDemo(): ReactElement {
  const form = useForm({
    defaultValues: defaultFormData,
    onSubmit: (data) => console.log(data.value),
  })

  const isInRange = (value: number) => value >= 20 && value <= 80
  const isRangeAtLeast30 = (value: [number, number]) =>
    Math.abs(value[0] - value[1]) >= 30

  return (
    <form
      className="flex flex-col gap-10 sm:w-80"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="minMaxNumber"
        validators={{
          onChange: ({value}) =>
            isInRange(value) ? undefined : minmaxErrorMessage,
          onSubmit: ({value}) =>
            isInRange(value) ? undefined : minmaxErrorMessage,
        }}
      >
        {({handleChange, name, state}) => {
          const fieldError =
            state.meta.errorMap["onChange"] || state.meta.errorMap["onSubmit"]
          return (
            <Slider
              errorText={fieldError}
              hint="Between 20 and 80"
              invalid={!!fieldError}
              label="Select a value"
              name={name}
              onValueChange={({value}) => handleChange(value[0])}
              value={[state.value]}
            />
          )
        }}
      </form.Field>
      <form.Field
        name="minRange"
        validators={{
          onChange: ({value}) =>
            isRangeAtLeast30(value) ? undefined : minRangeErrorMessage,
          onSubmit: ({value}) =>
            isRangeAtLeast30(value) ? undefined : minRangeErrorMessage,
        }}
      >
        {({handleChange, name, state}) => {
          const fieldError =
            state.meta.errorMap["onChange"] || state.meta.errorMap["onSubmit"]
          return (
            <Slider
              errorText={fieldError}
              hint="At least 30"
              invalid={!!fieldError}
              label="Select a range"
              name={name}
              onValueChange={({value}) =>
                handleChange(value as [number, number])
              }
              value={state.value}
            />
          )
        }}
      </form.Field>
      <Button
        className="mt-1"
        emphasis="primary"
        size="sm"
        type="submit"
        variant="fill"
      >
        Submit
      </Button>
    </form>
  )
}
