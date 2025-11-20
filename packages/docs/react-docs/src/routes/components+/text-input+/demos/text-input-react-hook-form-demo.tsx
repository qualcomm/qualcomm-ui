import {type} from "arktype"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {TextInput} from "@qualcomm-ui/react/text-input"

const addressSchema = type({
  city: "string>0",
  state: "string==2",
  streetAddress: "string>0",
  zipCode: "string>=5",
})

type AddressFormData = typeof addressSchema.infer

export function TextInputReactHookFormDemo() {
  const {
    control,
    formState: {isSubmitting},
    handleSubmit,
    setError,
  } = useForm<AddressFormData>({
    defaultValues: {
      city: "",
      state: "CA",
      streetAddress: "",
      zipCode: "",
    },
  })

  const handleFormSubmit: SubmitHandler<AddressFormData> = async (data) => {
    const validation = addressSchema(data)

    if (validation instanceof type.errors) {
      validation.forEach((error) => {
        const field = error.path?.[0] as keyof AddressFormData
        if (field) {
          setError(field, {
            message: error.message,
          })
        }
      })
      return
    }
  }

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-3"
      noValidate
      onSubmit={(e) => {
        void handleSubmit(handleFormSubmit)(e)
      }}
    >
      <Controller
        control={control}
        name="streetAddress"
        render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
          <TextInput
            className="w-full"
            errorText={error?.message}
            invalid={!!error}
            label="Street Address"
            onValueChange={onChange}
            placeholder="123 Main St"
            required
            {...fieldProps}
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
          <TextInput
            className="w-full"
            errorText={error?.message}
            invalid={!!error}
            label="City"
            onValueChange={onChange}
            placeholder="San Diego"
            required
            {...fieldProps}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="state"
          render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
            <TextInput
              className="w-full"
              errorText={error?.message}
              invalid={!!error}
              label="State"
              onValueChange={onChange}
              placeholder="CA"
              required
              {...fieldProps}
            />
          )}
        />

        <Controller
          control={control}
          name="zipCode"
          render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
            <TextInput
              className="w-full"
              errorText={error?.message}
              invalid={!!error}
              label="Zip Code"
              onValueChange={onChange}
              placeholder="10001"
              required
              {...fieldProps}
            />
          )}
        />
      </div>

      <div className="mt-2 flex w-full justify-end">
        <Button
          disabled={isSubmitting}
          emphasis="primary"
          type="submit"
          variant="fill"
        >
          Save Address
        </Button>
      </div>
    </form>
  )
}
