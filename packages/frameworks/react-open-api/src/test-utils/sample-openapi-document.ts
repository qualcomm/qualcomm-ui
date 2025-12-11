import type {OpenAPIV3_1} from "../types"

/**
 * Sample OpenAPI document for visual testing.
 */
export const sampleOpenApiDocument: OpenAPIV3_1.Document = {
  openapi: "3.1.0",
  info: {
    title: "Pet Store API",
    version: "1.0.0",
    description:
      "A sample API that uses a petstore as an example to demonstrate features in the OpenAPI specification.",
    contact: {
      name: "API Support",
      email: "support@example.com",
      url: "https://example.com/support",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "https://api.example.com/v1",
      description: "Production server",
    },
    {
      url: "https://staging-api.example.com/v1",
      description: "Staging server",
    },
  ],
  tags: [
    {
      name: "pets",
      description: "Operations related to pets",
    },
    {
      name: "store",
      description: "Access to Petstore orders",
    },
  ],
  paths: {
    "/pets": {
      get: {
        operationId: "listPets",
        summary: "List all pets",
        description: "Returns a list of all pets in the store.",
        tags: ["pets"],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Maximum number of pets to return",
            required: false,
            schema: {
              type: "integer",
              format: "int32",
              default: 20,
              maximum: 100,
            },
          },
          {
            name: "status",
            in: "query",
            description: "Filter by pet status",
            schema: {
              type: "string",
              enum: ["available", "pending", "sold"],
            },
          },
        ],
        responses: {
          "200": {
            description: "A list of pets",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Pet",
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request",
          },
        },
      },
      post: {
        operationId: "createPet",
        summary: "Create a pet",
        description: "Creates a new pet in the store.",
        tags: ["pets"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewPet",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Pet created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
          },
          "400": {
            description: "Invalid input",
          },
        },
      },
    },
    "/pets/{petId}": {
      get: {
        operationId: "getPetById",
        summary: "Get a pet by ID",
        description: "Returns a single pet by its ID.",
        tags: ["pets"],
        parameters: [
          {
            name: "petId",
            in: "path",
            description: "The ID of the pet to retrieve",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "A pet",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
          },
          "404": {
            description: "Pet not found",
          },
        },
      },
      put: {
        operationId: "updatePet",
        summary: "Update a pet",
        description: "Updates an existing pet.",
        tags: ["pets"],
        deprecated: true,
        parameters: [
          {
            name: "petId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewPet",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Pet updated",
          },
        },
      },
      delete: {
        operationId: "deletePet",
        summary: "Delete a pet",
        tags: ["pets"],
        parameters: [
          {
            name: "petId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "204": {
            description: "Pet deleted",
          },
        },
      },
    },
    "/store/orders": {
      post: {
        operationId: "placeOrder",
        summary: "Place an order",
        description: "Place a new order in the store.",
        tags: ["store"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Order",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Order placed",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pet: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique identifier for the pet",
          },
          name: {
            type: "string",
            description: "Name of the pet",
            example: "Fluffy",
          },
          status: {
            type: "string",
            enum: ["available", "pending", "sold"],
            description: "Pet status in the store",
          },
          category: {
            $ref: "#/components/schemas/Category",
          },
          tags: {
            type: "array",
            items: {
              type: "string",
            },
            description: "Tags associated with the pet",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "When the pet was added to the store",
          },
        },
      },
      NewPet: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
          },
          status: {
            type: "string",
            enum: ["available", "pending", "sold"],
            default: "available",
          },
          category: {
            $ref: "#/components/schemas/Category",
          },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
          },
          name: {
            type: "string",
          },
        },
      },
      Order: {
        type: "object",
        required: ["petId", "quantity"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          petId: {
            type: "string",
            format: "uuid",
          },
          quantity: {
            type: "integer",
            format: "int32",
            minimum: 1,
          },
          shipDate: {
            type: "string",
            format: "date-time",
          },
          status: {
            type: "string",
            enum: ["placed", "approved", "delivered"],
          },
          complete: {
            type: "boolean",
            default: false,
          },
        },
      },
    },
  },
}
