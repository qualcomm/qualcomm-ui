import type {ReactElement} from "react"

import {arktypeResolver} from "@hookform/resolvers/arktype"
import {type} from "arktype"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

interface FormData {
  framework: string
  language: string
}

const FormSchema = type({
  framework: "string>0",
  language: "string>0",
})

export default function RadioReactHookFormDemo(): ReactElement {
  const {control, handleSubmit} = useForm<FormData>({
    defaultValues: {
      framework: "",
      language: "",
    },
    resolver: arktypeResolver(FormSchema),
  })

  return (
    <form
      className="flex w-56 flex-col gap-4"
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <Controller
        control={control}
        name="language"
        render={({
          field: {name, onChange, value, ...fieldProps},
          fieldState: {error},
        }) => {
          return (
            <RadioGroup.Root
              invalid={!!error}
              name={name}
              onValueChange={onChange}
              value={value}
              {...fieldProps}
            >
              <RadioGroup.Label>Programming Language</RadioGroup.Label>
              <RadioGroup.Items>
                <Radio label="JavaScript" value="javascript" />
                <Radio label="TypeScript" value="typescript" />
                <Radio label="Python" value="python" />
              </RadioGroup.Items>
              <RadioGroup.ErrorText>{error?.message}</RadioGroup.ErrorText>
            </RadioGroup.Root>
          )
        }}
      />

      <Controller
        control={control}
        name="framework"
        render={({
          field: {name, onChange, value, ...fieldProps},
          fieldState: {error},
        }) => {
          return (
            <RadioGroup.Root
              invalid={!!error}
              name={name}
              onValueChange={onChange}
              value={value}
              {...fieldProps}
            >
              <RadioGroup.Label>Framework</RadioGroup.Label>
              <RadioGroup.Items>
                <Radio label="React" value="react" />
                <Radio label="Vue" value="vue" />
                <Radio label="Angular" value="angular" />
              </RadioGroup.Items>
              <RadioGroup.ErrorText>{error?.message}</RadioGroup.ErrorText>
            </RadioGroup.Root>
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
