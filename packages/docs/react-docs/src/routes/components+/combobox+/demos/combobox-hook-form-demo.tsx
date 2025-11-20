import type {ReactElement} from "react"

import {type} from "arktype"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"

import type {ComboboxInputValueChangeDetails} from "@qualcomm-ui/core/combobox"
import {Button} from "@qualcomm-ui/react/button"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {createToaster, Toaster} from "@qualcomm-ui/react/toast"
import {useListCollection} from "@qualcomm-ui/react-core/collection"
import {useFilter} from "@qualcomm-ui/react-core/locale"

import {countries} from "./country-list"

const valueSchema = type({
  country: type("string[] > 0").configure({
    message: "At least one country must be selected",
  }),
})

type ValueSchema = typeof valueSchema.infer

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function ComboboxHookFormDemo(): ReactElement {
  const {contains} = useFilter({sensitivity: "base"})

  const {collection, filter} = useListCollection({
    filter: contains,
    initialItems: countries,
  })

  function handleInputChange(details: ComboboxInputValueChangeDetails) {
    filter(details.inputValue)
  }

  const {
    control,
    formState: {isSubmitting},
    handleSubmit,
    setError,
  } = useForm<ValueSchema>({
    defaultValues: {
      country: [],
    },
  })

  const handleFormSubmit: SubmitHandler<ValueSchema> = async (data) => {
    const validation = valueSchema(data)

    if (validation instanceof type.errors) {
      validation.forEach((error) => {
        const field = error.path?.[0] as keyof ValueSchema
        if (field) {
          setError(field, {
            message: error.message,
          })
        }
      })
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
        className="w-48"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Controller
          control={control}
          name="country"
          render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
            <Combobox
              className="w-full"
              collection={collection}
              errorText={error?.message}
              invalid={!!error}
              label="Country"
              onInputValueChange={handleInputChange}
              onValueChange={(details) => onChange(details.value)}
              placeholder="Select a country"
              required
              {...fieldProps}
            />
          )}
        />
        <div className="mt-2 flex w-full justify-end">
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
