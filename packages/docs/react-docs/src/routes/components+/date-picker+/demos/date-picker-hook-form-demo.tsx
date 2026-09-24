import type {ReactElement} from "react"

import {type} from "arktype"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"

import type {DateValue} from "@qualcomm-ui/core/date-picker"
import {Button} from "@qualcomm-ui/react/button"
import {DatePicker} from "@qualcomm-ui/react/date-picker"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const valueSchema = type({
  departureDate: type("unknown[] > 0").configure({
    message: "A departure date is required",
  }),
})

type ValueSchema = typeof valueSchema.infer

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function DatePickerHookFormDemo(): ReactElement {
  const {
    control,
    formState: {isSubmitting},
    handleSubmit,
    setError,
  } = useForm<ValueSchema>({
    defaultValues: {
      departureDate: [],
    },
  })

  const handleFormSubmit: SubmitHandler<ValueSchema> = (data) => {
    const validation = valueSchema(data)

    if (validation instanceof type.errors) {
      for (const error of validation) {
        const field = error.path?.[0] as keyof ValueSchema
        if (field) {
          setError(field, {
            message: error.message,
          })
        }
      }
      return
    }

    toaster.create({
      label: "Form submitted",
      type: "success",
    })
  }

  return (
    <>
      <Toaster toaster={toaster} />
      <form
        className="flex w-64 flex-col gap-4"
        noValidate
        onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
      >
        <Controller
          control={control}
          name="departureDate"
          render={({
            field: {onChange, value, ...fieldProps},
            fieldState: {error},
          }) => (
            <DatePicker
              errorText={error?.message}
              hint="Choose a date in mm/dd/yyyy format"
              invalid={!!error}
              label="Departure date"
              onValueChange={(details) => onChange(details.value)}
              required
              value={value as DateValue[]}
              {...fieldProps}
            />
          )}
        />
        <div className="flex w-full justify-end">
          <Button
            disabled={isSubmitting}
            emphasis="primary"
            type="submit"
            variant="fill"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  )
}
