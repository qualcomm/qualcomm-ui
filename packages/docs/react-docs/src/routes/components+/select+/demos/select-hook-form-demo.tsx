import type {ReactElement} from "react"

import {type} from "arktype"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"

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

const valueSchema = type({
  city: type("string[] > 0").configure({
    message: "At least one city must be selected",
  }),
})

type ValueSchema = typeof valueSchema.infer

const toaster = createToaster({
  overlap: true,
  placement: "bottom-end",
})

export function SelectHookFormDemo(): ReactElement {
  const {
    control,
    formState: {isSubmitting},
    handleSubmit,
    setError,
  } = useForm<ValueSchema>({
    defaultValues: {
      city: [],
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
          name="city"
          render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
            <Select
              className="w-full"
              collection={cityCollection}
              errorText={error?.message}
              invalid={!!error}
              label="City"
              onValueChange={(valueStrings) => onChange(valueStrings)}
              placeholder="Select a city"
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
