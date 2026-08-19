import {Link} from "react-router"

const components = [
  "accordion",
  "avatar",
  "breadcrumbs",
  "button",
  "button-group",
  "checkbox",
  "collapsible",
  "combobox",
  "dialog",
  "divider",
  "drawer",
  "file-input",
  "header-bar",
  "icon",
  "icon-button",
  "inline-icon-button",
  "inline-notification",
  "link",
  "listbox",
  "menu",
  "number-input",
  "pagination",
  "password-input",
  "popover",
  "progress",
  "progress-ring",
  "radio",
  "segmented-control",
  "select",
  "side-nav",
  "slider",
  "stepper",
  "switch",
  "tabs",
  "tag",
  "text-input",
  "toast",
  "tooltip",
  "tree",
]

const tableFeatures = [
  "basic",
  "column-dnd",
  "column-grouping",
  "column-pinning",
  "column-sizing",
  "column-visibility",
  "editable-data",
  "filters-client-side",
  "filters-server-side",
  "grouping",
  "pagination-client-side",
  "pagination-server-side",
  "row-dnd",
  "row-expansion",
  "row-expansion-customization",
  "row-pinning",
  "row-selection",
  "sorting",
  "virtualized-rows",
]

function kebabToTitle(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function HomePage() {
  return (
    <div className="page">
      <p className="text-neutral-secondary mb-4">
        Click any item to view its demos. On each page, click individual demo
        titles to view them in isolation.
      </p>
      <div className="grid grid-cols-2 gap-8">
        <div className="section">
          <h1 className="section-title">Component Demos</h1>
          <ul className="space-y-2">
            {components.map((component) => (
              <li key={component}>
                <Link
                  className="text-primary hover:underline"
                  to={`/components/${component}`}
                >
                  {kebabToTitle(component)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h1 className="section-title">Table Demos</h1>
          <ul className="space-y-2">
            {tableFeatures.map((feature) => (
              <li key={feature}>
                <Link
                  className="text-primary hover:underline"
                  to={`/table/features/${feature}`}
                >
                  {kebabToTitle(feature)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
