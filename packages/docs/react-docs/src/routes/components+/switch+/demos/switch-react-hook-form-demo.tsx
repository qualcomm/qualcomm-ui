import type {ReactElement} from "react"

import {arktypeResolver} from "@hookform/resolvers/arktype"
import {type} from "arktype"
import {Controller, type Resolver, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {Switch} from "@qualcomm-ui/react/switch"

interface FormData {
  acceptTerms: boolean
  newsletter: boolean
}

const acceptTermsSchema = type.true.configure({
  message: "Please accept the Terms of Service to continue",
})
const FormSchema = type({
  // must be true
  acceptTerms: acceptTermsSchema,
  // can be true or false
  newsletter: "boolean",
})

export default function SwitchReactHookFormDemo(): ReactElement {
  const {control, handleSubmit} = useForm<FormData>({
    defaultValues: {
      acceptTerms: false,
      newsletter: true,
    },
    resolver: arktypeResolver(FormSchema) as Resolver<FormData>,
  })

  return (
    <form
      className="flex w-56 flex-col gap-2"
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <Controller
        control={control}
        name="newsletter"
        render={({field: {name, onChange, value, ...fieldProps}}) => {
          return (
            <Switch.Root
              checked={value}
              name={name}
              onCheckedChange={onChange}
              {...fieldProps}
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Subscribe to our Newsletter</Switch.Label>
            </Switch.Root>
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
            <Switch.Root
              checked={value}
              invalid={!!error?.message}
              onCheckedChange={onChange}
              {...fieldProps}
            >
              <Switch.HiddenInput />
              <Switch.Control />
              <Switch.Label>Accept Terms of Service</Switch.Label>
              <Switch.ErrorText>{error?.message}</Switch.ErrorText>
            </Switch.Root>
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
