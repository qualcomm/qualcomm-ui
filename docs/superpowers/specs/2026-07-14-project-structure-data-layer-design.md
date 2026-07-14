# Project structure data-layer ownership

## Goal

Update the React project-structure concept page so it establishes the data layer as the single owner of all external data contracts and operations.

## Scope

Revise `packages/docs/react-docs/src/routes/patterns+/project-structure.mdx` wherever it assigns external data responsibilities. Preserve the existing Feature-Sliced Design overview, diagrams, layer ordering, dependency table, and slice-isolation guidance.

## Ownership model

- The data layer owns external interfaces, schemas, API methods, queries, and mutations.
- Features consume the data layer to implement user-facing workflows and business actions.
- Entities represent domain concepts and may contain domain types, presentation models, local business logic, and UI.
- Shared may contain generic transport infrastructure, such as an HTTP client and framework-independent request utilities.
- Pages and widgets compose lower layers into application screens and reusable UI blocks.

## Documentation changes

Apply the ownership model consistently to the Layers, Segments, Features, Entities, Data, and Shared sections. State the exclusive ownership rule once in the Data section. Describe the other layers by their positive responsibilities instead of repeating that they do not own API calls. Remove examples and notes that place CRUD operations or API segments in features or entities, and clarify that features and entities consume data-layer exports through the existing unidirectional dependency rules.

Keep the page as a concept page. Do not add implementation-specific library guidance or a new folder tree because the requested correction concerns ownership boundaries, not a prescribed client or query library.

## Validation

- Search the page for every reference to APIs, external data, CRUD, queries, mutations, interfaces, and schemas, and confirm each reference follows the ownership model.
- Apply the QUI Docs author self-check and reviewer rejection gates.
- Run the React docs package validation available through a root package alias after checking whether the configured docs port is occupied.
