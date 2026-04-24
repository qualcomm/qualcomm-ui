import type {ReactElement} from "react"

import {type} from "arktype"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {Stepper} from "@qualcomm-ui/react/stepper"
import {TextInput} from "@qualcomm-ui/react/text-input"

const PROMO_STEP = 1

const steps = [
  {title: "Shipping", value: "shipping"},
  {title: "Promo Code", value: "promo"},
  {title: "Payment", value: "payment"},
]

const shippingSchema = type({address: "string > 0"})
const paymentSchema = type({card: "string > 0"})

type FormData = typeof shippingSchema.infer & {card: string; promo: string}

const stepSchemas: Record<number, (data: FormData) => type.errors | undefined> =
  {
    0: (data) => {
      const result = shippingSchema(data)
      return result instanceof type.errors ? result : undefined
    },
    2: (data) => {
      const result = paymentSchema(data)
      return result instanceof type.errors ? result : undefined
    },
  }

export function StepperSkippableStepsDemo(): ReactElement {
  const {clearErrors, control, getValues, setError} = useForm<FormData>({
    defaultValues: {address: "", card: "", promo: ""},
    mode: "onChange",
  })

  function validateStep(index: number): boolean {
    const validate = stepSchemas[index]
    if (!validate) {
      return true
    }
    return !validate(getValues())
  }

  function computeStepErrors(index: number) {
    clearErrors()

    const validate = stepSchemas[index]
    if (!validate) {
      return
    }

    const errors = validate(getValues())
    if (!errors) {
      return
    }

    for (const error of errors) {
      const field = error.path?.[0] as keyof FormData | undefined
      if (field) {
        setError(field, {message: error.message})
      }
    }
  }

  return (
    <Stepper.Root
      canGoToStep={({current, target}) => {
        if (target <= current) {
          // default to the built-in validation logic
          return undefined
        }
        return validateStep(current)
      }}
      count={steps.length}
      // this will bypass canGoToStep for PROMO_STEP only
      isStepSkippable={(index) => index === PROMO_STEP}
      onStepInvalid={({step: invalidStep}) => computeStepErrors(invalidStep)}
    >
      <Stepper.List>
        {steps.map((s, index) => (
          <Stepper.Item key={s.value} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Label>
                {s.title}
                {index === PROMO_STEP && (
                  <Stepper.Hint>(optional)</Stepper.Hint>
                )}
              </Stepper.Label>
            </Stepper.Trigger>
            <Stepper.Separator />
          </Stepper.Item>
        ))}
      </Stepper.List>

      <Stepper.Content index={0}>
        <Controller
          control={control}
          name="address"
          render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
            <TextInput
              className="max-w-56"
              errorText={error?.message}
              invalid={!!error}
              label="Shipping address"
              onValueChange={onChange}
              placeholder="123 Main St"
              required
              {...fieldProps}
            />
          )}
        />
      </Stepper.Content>

      <Stepper.Content index={1}>
        <Controller
          control={control}
          name="promo"
          render={({field: {onChange, ...fieldProps}}) => (
            <TextInput
              className="max-w-56"
              label="Promo code"
              onValueChange={onChange}
              placeholder="SAVE20"
              {...fieldProps}
            />
          )}
        />
      </Stepper.Content>

      <Stepper.Content index={2}>
        <Controller
          control={control}
          name="card"
          render={({field: {onChange, ...fieldProps}, fieldState: {error}}) => (
            <TextInput
              className="max-w-56"
              errorText={error?.message}
              invalid={!!error}
              label="Card number"
              onValueChange={onChange}
              placeholder="4242 4242 4242 4242"
              required
              {...fieldProps}
            />
          )}
        />
      </Stepper.Content>

      <Stepper.CompletedContent>
        Order confirmed. Thank you for your purchase!
      </Stepper.CompletedContent>

      <div className="mt-6 flex justify-between">
        <Stepper.PrevTrigger>
          <Button size="sm" startIcon={ChevronLeft} variant="outline">
            Back
          </Button>
        </Stepper.PrevTrigger>
        <Stepper.NextTrigger>
          <Button endIcon={ChevronRight} size="sm" variant="outline">
            Next
          </Button>
        </Stepper.NextTrigger>
      </div>
    </Stepper.Root>
  )
}
