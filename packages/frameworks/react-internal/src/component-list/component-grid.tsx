// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Link} from "react-router"

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import {componentList} from "./component-list"

/**
 * To consume this grid, the site must have images at `/public/images/components/*`
 *
 * Refer to the @qualcomm-ui/react-docs package for these.
 */
export function ComponentGrid(): ReactElement {
  return (
    <div className="qui-component-grid__root">
      {componentList.map((component) => {
        return (
          <Link
            key={component.name}
            className="qui-component-grid__item"
            data-planned={booleanDataAttr(component.planned)}
            to={component.url}
          >
            {component.planned ? (
              <div className="qui-component-grid__planned-text">
                Coming soon
              </div>
            ) : null}
            {component.fileName ? (
              <img
                alt={component.name}
                className="qui-component-grid__image"
                src={`/images/components/${component.fileName}`}
              />
            ) : (
              <div className="qui-component-grid__image"></div>
            )}
            <div className="qui-component-grid__item-description">
              <h3 className="font-heading-sm text-neutral-primary">
                {component.name}
              </h3>
              <p className="font-body-sm text-neutral-secondary">
                {component.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
