import {type ReactElement, useState} from "react"

import {type} from "arktype"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"
import {TextInput} from "@qualcomm-ui/react/text-input"

const items = [
  {
    label: "Age range",
    name: "age" as const,
    placeholder: "25-34",
    title: "Demographics",
  },
  {
    label: "Preferred contact method",
    name: "contact" as const,
    placeholder: "Email",
    title: "Preferences",
  },
  {
    label: "Comments",
    name: "comments" as const,
    placeholder: "Tell us what you think",
    title: "Feedback",
  },
]

const schema = type({
  age: "string > 0",
  comments: "string > 0",
  contact: "string > 0",
})

type FormData = typeof schema.infer

export function StepperNonlinearFormDemo(): ReactElement {
  const [completed, setCompleted] = useState<Record<number, boolean>>({})
  const {clearErrors, control, getValues, setError} = useForm<FormData>({
    defaultValues: {age: "", comments: "", contact: ""},
    mode: "onChange",
    reValidateMode: "onChange",
  })
  const [invalid, setInvalid] = useState<Record<string, boolean>>({})

  function saveStep(index: number) {
    const field = items[index]?.name
    if (!field) {
      console.debug("no field")
      return
    }

    const result = schema(getValues())
    if (result instanceof type.errors) {
      const fieldError = result.find((e) => e.path?.[0] === field)
      if (fieldError) {
        setError(field, {message: fieldError.message})
        setInvalid((prev) => ({...prev, [index]: true}))
        setCompleted((prev) => ({...prev, [index]: false}))
        return
      }
    }

    clearErrors(field)
    setInvalid((prev) => ({...prev, [index]: false}))
    setCompleted((prev) => ({...prev, [index]: true}))
  }

  const allCompleted = items.every((_, i) => completed[i])

  return (
    <Stepper.Root
      completed={completed}
      count={items.length}
      invalid={invalid}
      linear={false}
    >
      <Stepper.List>
        {items.map((item, index) => (
          <Stepper.Item key={item.name} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Label>{item.title}</Stepper.Label>
            </Stepper.Trigger>
            <Stepper.Separator />
          </Stepper.Item>
        ))}
      </Stepper.List>

      {items.map((item, index) => (
        <Stepper.Content key={item.name} index={index}>
          <div className="flex">
            <Controller
              control={control}
              name={item.name}
              render={({
                field: {onChange, ref, ...fieldProps},
                fieldState: {error},
              }) => (
                <TextInput
                  className="max-w-56"
                  errorText={error?.message}
                  inputProps={{ref}}
                  invalid={!!error}
                  label={item.label}
                  onValueChange={onChange}
                  placeholder={item.placeholder}
                  required
                  {...fieldProps}
                />
              )}
            />
          </div>
        </Stepper.Content>
      ))}

      <Stepper.CompletedContent>
        Survey submitted. Thank you for your feedback!
      </Stepper.CompletedContent>

      <Stepper.Context>
        {(api) => (
          <div className="mt-6 flex justify-between">
            <Stepper.PrevTrigger>
              <Button
                onClick={() => saveStep(api.step)}
                size="sm"
                startIcon={ChevronLeft}
                variant="outline"
              >
                Back
              </Button>
            </Stepper.PrevTrigger>

            {allCompleted ? (
              <Button
                endIcon={ChevronRight}
                onClick={() => {
                  saveStep(api.step)
                  api.goToNextStep()
                }}
                size="sm"
              >
                Submit
              </Button>
            ) : (
              <Stepper.NextTrigger>
                <Button
                  disabled={
                    !api.hasNextStep ||
                    (api.step === items.length - 1 && !allCompleted)
                  }
                  endIcon={ChevronRight}
                  onClick={() => {
                    saveStep(api.step)
                  }}
                  size="sm"
                >
                  Next
                </Button>
              </Stepper.NextTrigger>
            )}
          </div>
        )}
      </Stepper.Context>
    </Stepper.Root>
  )
}
