import type {ReactElement} from "react"

import {useForm} from "@tanstack/react-form"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Button} from "@qualcomm-ui/react/button"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function ComboboxTanstackFormDemo(): ReactElement {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: countries,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  const form = useForm({
    defaultValues: {
      country: [] as string[],
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
          name="country"
          validators={{
            onChange: ({value}) =>
              value.length === 0
                ? "At least one country must be selected"
                : undefined,
          }}
        >
          {(field) => (
            <Combobox
              className="w-full"
              collection={collection}
              errorText={field.state.meta.errors[0]}
              invalid={field.state.meta.errors.length > 0}
              label="Country"
              onInputValueChange={handleInputChange}
              onValueChange={(details) => field.handleChange(details.value)}
              placeholder="Select a country"
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
