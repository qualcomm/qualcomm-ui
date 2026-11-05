import type {ReactElement} from "react"

import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {DatePicker, type DateValue} from "@qualcomm-ui/react/date-picker"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function DatePickerTanstackFormDemo(): ReactElement {
  const form = useForm({
    defaultValues: {
      departureDate: [] as (DateValue | null)[],
    },
    onSubmit: () => {
      toaster.create({
        label: "Form submitted",
        type: "success",
      })
    },
  })

  return (
    <>
      <Toaster toaster={toaster} />
      <form
        className="w-64"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field
          name="departureDate"
          validators={{
            onChange: ({value}) =>
              value.length === 0 ? "A departure date is required" : undefined,
          }}
        >
          {(field) => (
            <DatePicker
              className="w-full"
              errorText={field.state.meta.errors[0]}
              hint="Choose a date in mm/dd/yyyy format"
              invalid={field.state.meta.errors.length > 0}
              label="Departure date"
              onValueChange={(details) => field.handleChange(details.value)}
              required
              value={field.state.value}
            />
          )}
        </form.Field>
        <div className="mt-2 flex w-full justify-end">
          <Button
            disabled={form.state.isSubmitting}
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
