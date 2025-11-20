import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {TextInput} from "@qualcomm-ui/react/text-input"

interface AddressFormData {
  city: string
  state: string
  streetAddress: string
  zipCode: string
}

export function TextInputTanstackFormDemo() {
  const form = useForm({
    defaultValues: {
      city: "",
      state: "CA",
      streetAddress: "",
      zipCode: "",
    } satisfies AddressFormData,
    onSubmit: ({value}) => {
      // Handle successful submission
      console.log("Form submitted:", value)
    },
  })

  return (
    <form
      className="mx-auto flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="streetAddress"
        validators={{
          onChange: ({value}) => {
            if (!value || value.trim().length === 0) {
              return "Street address is required"
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <TextInput
            className="w-full"
            errorText={field.state.meta.errors?.[0]}
            invalid={field.state.meta.errors.length > 0}
            label="Street Address"
            name={field.name}
            onBlur={field.handleBlur}
            onValueChange={field.handleChange}
            placeholder="123 Main St"
            value={field.state.value}
          />
        )}
      </form.Field>

      <form.Field
        name="city"
        validators={{
          onChange: ({value}) => {
            if (!value || value.trim().length === 0) {
              return "City is required"
            }
            return undefined
          },
        }}
      >
        {(field) => (
          <TextInput
            className="w-full"
            errorText={field.state.meta.errors?.[0]}
            invalid={field.state.meta.errors.length > 0}
            label="City"
            name={field.name}
            onBlur={field.handleBlur}
            onValueChange={field.handleChange}
            placeholder="San Diego"
            value={field.state.value}
          />
        )}
      </form.Field>

      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="state"
          validators={{
            onChange: ({value}) => {
              if (!value || value.length !== 2) {
                return "State must be exactly 2 characters"
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <TextInput
              className="w-full"
              errorText={field.state.meta.errors?.[0]}
              invalid={field.state.meta.errors.length > 0}
              label="State"
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
              placeholder="CA"
              value={field.state.value}
            />
          )}
        </form.Field>

        <form.Field
          name="zipCode"
          validators={{
            onChange: ({value}) => {
              if (!value || value.length < 5) {
                return "Zip code must be at least 5 characters"
              }
              return undefined
            },
          }}
        >
          {(field) => (
            <TextInput
              className="w-full"
              errorText={field.state.meta.errors?.[0]}
              invalid={field.state.meta.errors.length > 0}
              label="Zip Code"
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
              placeholder="10001"
              value={field.state.value}
            />
          )}
        </form.Field>
      </div>

      <div className="mt-2 flex w-full justify-end">
        <Button
          disabled={form.state.isSubmitting}
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
