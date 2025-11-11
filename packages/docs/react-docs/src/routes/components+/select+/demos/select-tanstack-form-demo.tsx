import type {ReactElement} from "react"

import {useForm} from "@tanstack/react-form"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Button} from "@qualcomm-ui/react/button"
import {Select} from "@qualcomm-ui/react/select"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"

const cityCollection = selectCollection({
  items: [
    "San Diego",
    "Nashville",
    "Denver",
    "Miami",
    "Las Vegas",
    "New York City",
    "San Francisco",
  ],
})

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export default function Demo(): ReactElement {
  const form = useForm({
    defaultValues: {
      city: [] as string[],
    },
    onSubmit: async () => {
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
        className="w-48"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="city"
          validators={{
            onChange: ({value}) =>
              value.length === 0
                ? "At least one city must be selected"
                : undefined,
          }}
        >
          {(field) => (
            <Select
              className="w-full"
              collection={cityCollection}
              errorText={field.state.meta.errors[0]}
              invalid={field.state.meta.errors.length > 0}
              label="City"
              onValueChange={field.handleChange}
              placeholder="Select a city"
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
