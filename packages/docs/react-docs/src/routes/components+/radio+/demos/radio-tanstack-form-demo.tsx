import type {ReactElement} from "react"

import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"

interface FormData {
  framework: string | null
  language: string | null
}

const defaultFormData: FormData = {
  framework: "",
  language: "",
}

const requiredMessage = "Please select an option"

export function RadioTanstackFormDemo(): ReactElement {
  const form = useForm({
    defaultValues: defaultFormData,
    onSubmit: async ({value}) => {
      console.log(value)
    },
  })

  return (
    <form
      className="flex w-56 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <form.Field
        name="language"
        validators={{
          onChange: (field) => (field.value ? undefined : requiredMessage),
          onSubmit: (field) => (field.value ? undefined : requiredMessage),
        }}
      >
        {({handleChange, name, state}) => {
          const fieldError =
            state.meta.errorMap["onChange"] || state.meta.errorMap["onSubmit"]
          return (
            <RadioGroup.Root
              invalid={!!fieldError}
              name={name}
              onValueChange={handleChange}
              value={state.value}
            >
              <RadioGroup.Label>Programming Language</RadioGroup.Label>
              <RadioGroup.Items>
                <Radio label="JavaScript" value="javascript" />
                <Radio label="TypeScript" value="typescript" />
                <Radio label="Python" value="python" />
              </RadioGroup.Items>
              <RadioGroup.ErrorText>{fieldError}</RadioGroup.ErrorText>
            </RadioGroup.Root>
          )
        }}
      </form.Field>

      <form.Field
        name="framework"
        validators={{
          onChange: (field) => (field.value ? undefined : requiredMessage),
          onSubmit: (field) => (field.value ? undefined : requiredMessage),
        }}
      >
        {({handleChange, name, state}) => {
          const fieldError =
            state.meta.errorMap["onChange"] || state.meta.errorMap["onSubmit"]
          return (
            <RadioGroup.Root
              invalid={!!fieldError}
              name={name}
              onValueChange={handleChange}
              value={state.value}
            >
              <RadioGroup.Label>Framework</RadioGroup.Label>
              <RadioGroup.Items>
                <Radio label="React" value="react" />
                <Radio label="Vue" value="vue" />
                <Radio label="Angular" value="angular" />
              </RadioGroup.Items>
              <RadioGroup.ErrorText>{fieldError}</RadioGroup.ErrorText>
            </RadioGroup.Root>
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
