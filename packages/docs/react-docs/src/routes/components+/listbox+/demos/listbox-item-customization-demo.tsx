import type {ReactElement} from "react"

import {AppWindow, Braces, Terminal} from "lucide-react"

import {listboxCollection} from "@qualcomm-ui/core/listbox"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {Listbox} from "@qualcomm-ui/react/listbox"

interface Project {
  description: string
  icon: LucideIconOrElement
  label: string
  technologyArea: string
  value: string
}

const projects: Project[] = [
  {
    description: "Backend",
    icon: Braces,
    label: "API Gateway",
    technologyArea: "API",
    value: "api-gateway",
  },
  {
    description: "React application",
    icon: AppWindow,
    label: "Web Portal",
    technologyArea: "Client",
    value: "web-portal",
  },
  {
    description: "CLI",
    icon: Terminal,
    label: "Command Line Interface",
    technologyArea: "Client",
    value: "cli",
  },
]

const collection = listboxCollection({items: projects})

export function ListboxItemCustomizationDemo(): ReactElement {
  return (
    <Listbox.Root className="w-84" collection={collection}>
      {/* preview */}
      <Listbox.Label>Projects</Listbox.Label>
      <Listbox.Content>
        {collection.items.map((project) => (
          <Listbox.Item key={project.value} item={project}>
            <Listbox.ItemStartIcon icon={project.icon} />
            <Listbox.ItemLabel>{project.label}</Listbox.ItemLabel>
            <Listbox.ItemDescription>
              {project.description}
            </Listbox.ItemDescription>
            <Listbox.ItemSecondaryText>
              {project.technologyArea}
            </Listbox.ItemSecondaryText>
          </Listbox.Item>
        ))}
      </Listbox.Content>
      {/* preview */}
    </Listbox.Root>
  )
}
