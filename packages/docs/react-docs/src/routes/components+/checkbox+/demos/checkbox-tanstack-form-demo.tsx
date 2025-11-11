import type {ReactElement} from "react"

import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {Checkbox} from "@qualcomm-ui/react/checkbox"

interface FormData {
  acceptTerms: boolean
  newsletter: boolean
}

const defaultFormData: FormData = {
  acceptTerms: false,
  newsletter: true,
}

const errorMessage = "Please accept the Terms of Service to continue"

export default function CheckboxTanstackFormDemo(): ReactElement {
  const form = useForm({
    defaultValues: defaultFormData,
    onSubmit: async ({value}) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <form
      className="flex w-56 flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field name="newsletter">
        {({handleChange, name, state}) => {
          return (
            <Checkbox
              checked={state.value}
              label="Subscribe to our Newsletter"
              name={name}
              onCheckedChange={handleChange}
            />
          )
        }}
      </form.Field>

      <form.Field
        name="acceptTerms"
        validators={{
          onChange: (field) => (field.value ? undefined : errorMessage),
          onSubmit: (field) => (field.value ? undefined : errorMessage),
        }}
      >
        {({handleChange, name, state}) => {
          const fieldError =
            state.meta.errorMap["onChange"] || state.meta.errorMap["onSubmit"]
          return (
            <Checkbox
              checked={state.value}
              errorText={fieldError}
              invalid={!!fieldError}
              label="Accept Terms"
              name={name}
              onCheckedChange={handleChange}
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
