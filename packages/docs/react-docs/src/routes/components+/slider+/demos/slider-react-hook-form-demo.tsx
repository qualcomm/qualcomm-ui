import type {ReactElement} from "react"

import {arktypeResolver} from "@hookform/resolvers/arktype"
import {type} from "arktype"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {Slider} from "@qualcomm-ui/react/slider"

interface FormData {
  minMaxNumber: number
  minRange: [number, number]
}

const minMaxNumber = type("20 <= number <= 80").configure({
  message: "Value must be between 20 and 80",
})

const minRange = type("number[]")
  .narrow((values: number[]) => Math.abs(values[0] - values[1]) >= 30)
  .configure({
    message: "Range must be at least 30",
  })

const FormSchema = type({
  minMaxNumber,
  minRange,
})

export default function SliderReactHookFormDemo(): ReactElement {
  const {control, handleSubmit} = useForm<FormData>({
    defaultValues: {
      minMaxNumber: 30,
      minRange: [30, 70],
    },
    mode: "onChange",
    resolver: arktypeResolver(FormSchema),
  })

  return (
    <form
      className="flex flex-col gap-10 sm:w-80"
      onSubmit={(e) => {
        void handleSubmit((data) => console.log(data))(e)
      }}
    >
      <Controller
        control={control}
        name="minMaxNumber"
        render={({
          field: {onChange, value, ...fieldProps},
          fieldState: {error},
        }) => {
          return (
            <Slider
              errorText={error?.message}
              hint="Between 20 and 80"
              invalid={!!error?.message}
              label="Select a value"
              onValueChange={({value}: {value: number[]}) => {
                return onChange(value[0])
              }}
              value={[value]}
              {...fieldProps}
            />
          )
        }}
      />
      <Controller
        control={control}
        name="minRange"
        render={({
          field: {onChange, value, ...fieldProps},
          fieldState: {error},
        }) => {
          return (
            <Slider
              errorText={error?.message}
              hint="At least 30"
              invalid={!!error?.message}
              label="Select a range"
              onValueChange={({value}: {value: number[]}) => {
                return onChange(value)
              }}
              value={value}
              {...fieldProps}
            />
          )
        }}
      />
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
