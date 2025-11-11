import type {ReactElement} from "react"

import {Link} from "react-router"

import {componentList} from "./component-list"

export function ComponentGrid(): ReactElement {
  return (
    <div className="qui-component-grid">
      {componentList.map((component) => (
        <Link
          key={component.name}
          className="qui-component-grid-item"
          to={component.url}
        >
          <img
            alt={component.name}
            height={150}
            src={`/images/components/${component.fileName}`}
            width={200}
          />
          <div className="qui-component-grid-item-description">
            <h3 className="font-heading-xxs">{component.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
