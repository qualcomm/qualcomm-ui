// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {groupMediaTypes} from "./media-content.js"

const pet = {properties: {name: {type: "string"}}, type: "object"}

describe("groupMediaTypes", () => {
  test("merges media types with the same schema", () => {
    expect(
      groupMediaTypes({
        "application/json": {schema: pet},
        "application/xml": {schema: {...pet}},
      }),
    ).toEqual([
      {mediaTypes: ["application/json", "application/xml"], schema: pet},
    ])
  })

  test("ignores XML serialization hints when comparing", () => {
    const xmlPet = {...pet, xml: {name: "pet"}}
    expect(
      groupMediaTypes({
        "application/json": {schema: pet},
        "application/xml": {schema: xmlPet},
      }),
    ).toEqual([
      {mediaTypes: ["application/json", "application/xml"], schema: pet},
    ])
  })

  test("keeps properties named xml when comparing", () => {
    const json = {properties: {xml: {type: "string"}}, type: "object"}
    const xml = {properties: {xml: {type: "integer"}}, type: "object"}
    expect(
      groupMediaTypes({
        "application/json": {schema: json},
        "application/xml": {schema: xml},
      }),
    ).toHaveLength(2)
  })

  test("keeps different schemas apart, in spec order", () => {
    const file = {format: "binary", type: "string"}
    expect(
      groupMediaTypes({
        "application/json": {schema: pet},
        "application/octet-stream": {schema: file},
        "application/xml": {schema: pet},
      }),
    ).toEqual([
      {mediaTypes: ["application/json", "application/xml"], schema: pet},
      {mediaTypes: ["application/octet-stream"], schema: file},
    ])
  })

  test("groups media types without a schema together", () => {
    expect(groupMediaTypes({"text/html": {}, "text/plain": {}})).toEqual([
      {mediaTypes: ["text/html", "text/plain"], schema: undefined},
    ])
  })

  test("returns nothing for missing content", () => {
    expect(groupMediaTypes(undefined)).toEqual([])
  })
})
