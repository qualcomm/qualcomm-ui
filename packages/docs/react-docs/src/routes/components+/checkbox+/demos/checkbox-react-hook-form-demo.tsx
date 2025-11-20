import type {ReactElement} from "react"

import {arktypeResolver} from "@hookform/resolvers/arktype"
import {type} from "arktype"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {Checkbox} from "@qualcomm-ui/react/checkbox"

interface FormData {
  acceptTerms: boolean
  newsletter: boolean
}

const acceptTermsSchema = type("boolean")
  .narrow((value: boolean) => value === true)
  .configure({
    message: "Please accept the Terms of Service to continue",
  })
const FormSchema = type({
  // must be true
  acceptTerms: acceptTermsSchema,
  // can be true or false
  newsletter: "boolean",
})

export function CheckboxReactHookFormDemo(): ReactElement {
  const {control, handleSubmit} = useForm<FormData>({
    defaultValues: {
      acceptTerms: false,
      newsletter: true,
    },
    resolver: arktypeResolver(FormSchema),
  })

  return (
    <form
      className="flex w-56 flex-col gap-2"
      onSubmit={(e) => {
        void handleSubmit((data) => console.log(data))(e)
      }}
    >
      <Controller
        control={control}
        name="newsletter"
        render={({field: {name, onChange, value, ...fieldProps}}) => {
          return (
            <Checkbox.Root
              checked={value}
              name={name}
              onCheckedChange={onChange}
              {...fieldProps}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Subscribe to our Newsletter</Checkbox.Label>
            </Checkbox.Root>
          )
        }}
      />

      <Controller
        control={control}
        name="acceptTerms"
        render={({
          field: {onChange, value, ...fieldProps},
          fieldState: {error},
        }) => {
          return (
            <Checkbox.Root
              checked={value}
              invalid={!!error?.message}
              onCheckedChange={onChange}
              {...fieldProps}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Accept Terms of Service</Checkbox.Label>
              <Checkbox.ErrorText>{error?.message}</Checkbox.ErrorText>
            </Checkbox.Root>
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
