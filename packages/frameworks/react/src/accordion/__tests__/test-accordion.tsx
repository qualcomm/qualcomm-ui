import {Accordion, type AccordionRootProps} from "@qualcomm-ui/react/accordion"

const LoremIpsum =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor"

export const items = [
  {
    content: LoremIpsum,
    secondary: "Secondary text",
    title: "Accordion Header 1",
    value: "a",
  },
  {
    content: LoremIpsum,
    secondary: "Secondary text",
    title: "Accordion Header 2",
    value: "b",
  },
  {
    content: LoremIpsum,
    secondary: "Secondary text",
    title: "Accordion Header 3",
    value: "c",
  },
]

export const testIds = {
  accordionContent: "accordion-content-",
  accordionItem: "accordion-item-",
  accordionRoot: "accordion-root",
  accordionTrigger: "accordion-trigger-",
} as const

export function TestAccordion(props: AccordionRootProps) {
  return (
    <Accordion.Root {...props}>
      {items.map((item) => (
        <Accordion.ItemRoot
          key={item.value}
          data-test-id={`${testIds.accordionItem}${item.value}`}
          value={item.value}
        >
          <h3>
            <Accordion.ItemTrigger
              data-test-id={testIds.accordionTrigger + item.value}
            >
              <Accordion.ItemText>{item.title}</Accordion.ItemText>
            </Accordion.ItemTrigger>
          </h3>
          <Accordion.ItemContent
            data-test-id={testIds.accordionContent + item.value}
          >
            {item.content}
          </Accordion.ItemContent>
        </Accordion.ItemRoot>
      ))}
    </Accordion.Root>
  )
}
