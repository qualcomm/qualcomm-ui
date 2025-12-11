import type {OpenAPIV3_1} from "../types"

/**
 * Sample OpenAPI document for visual testing.
 */
export const sampleOpenApiDocument: OpenAPIV3_1.Document = {
  components: {
    schemas: {
      Category: {
        properties: {
          id: {
            format: "int64",
            type: "integer",
          },
          name: {
            type: "string",
          },
        },
        type: "object",
      },
      NewPet: {
        properties: {
          category: {
            $ref: "#/components/schemas/Category",
          },
          name: {
            maxLength: 100,
            minLength: 1,
            type: "string",
          },
          status: {
            default: "available",
            enum: ["available", "pending", "sold"],
            type: "string",
          },
        },
        required: ["name"],
        type: "object",
      },
      Order: {
        properties: {
          complete: {
            default: false,
            type: "boolean",
          },
          id: {
            format: "uuid",
            type: "string",
          },
          petId: {
            format: "uuid",
            type: "string",
          },
          quantity: {
            format: "int32",
            minimum: 1,
            type: "integer",
          },
          shipDate: {
            format: "date-time",
            type: "string",
          },
          status: {
            enum: ["placed", "approved", "delivered"],
            type: "string",
          },
        },
        required: ["petId", "quantity"],
        type: "object",
      },
      Pet: {
        properties: {
          category: {
            $ref: "#/components/schemas/Category",
          },
          createdAt: {
            description: "When the pet was added to the store",
            format: "date-time",
            type: "string",
          },
          id: {
            description: "Unique identifier for the pet",
            format: "uuid",
            type: "string",
          },
          name: {
            description: "Name of the pet",
            example: "Fluffy",
            type: "string",
          },
          status: {
            description: "Pet status in the store",
            enum: ["available", "pending", "sold"],
            type: "string",
          },
          tags: {
            description: "Tags associated with the pet",
            items: {
              type: "string",
            },
            type: "array",
          },
        },
        required: ["id", "name"],
        type: "object",
      },
    },
  },
  info: {
    contact: {
      email: "support@example.com",
      name: "API Support",
      url: "https://example.com/support",
    },
    description:
      "A sample API that uses a petstore as an example to demonstrate features in the OpenAPI specification.",
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
    title: "Pet Store API",
    version: "1.0.0",
  },
  openapi: "3.1.0",
  paths: {
    "/pets": {
      get: {
        description: "Returns a list of all pets in the store.",
        operationId: "listPets",
        parameters: [
          {
            description: "Maximum number of pets to return",
            in: "query",
            name: "limit",
            required: false,
            schema: {
              default: 20,
              format: "int32",
              maximum: 100,
              type: "integer",
            },
          },
          {
            description: "Filter by pet status",
            in: "query",
            name: "status",
            schema: {
              enum: ["available", "pending", "sold"],
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  items: {
                    $ref: "#/components/schemas/Pet",
                  },
                  type: "array",
                },
              },
            },
            description: "A list of pets",
          },
          "400": {
            description: "Invalid request",
          },
        },
        summary: "List all pets",
        tags: ["pets"],
      },
      post: {
        description: "Creates a new pet in the store.",
        operationId: "createPet",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewPet",
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
            description: "Pet created successfully",
          },
          "400": {
            description: "Invalid input",
          },
        },
        summary: "Create a pet",
        tags: ["pets"],
      },
    },
    "/pets/{petId}": {
      delete: {
        operationId: "deletePet",
        parameters: [
          {
            in: "path",
            name: "petId",
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
        summary: "Delete a pet",
        tags: ["pets"],
      },
      get: {
        description: "Returns a single pet by its ID.",
        operationId: "getPetById",
        parameters: [
          {
            description: "The ID of the pet to retrieve",
            in: "path",
            name: "petId",
            required: true,
            schema: {
              format: "uuid",
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Pet",
                },
              },
            },
            description: "A pet",
          },
          "404": {
            description: "Pet not found",
          },
        },
        summary: "Get a pet by ID",
        tags: ["pets"],
      },
      put: {
        deprecated: true,
        description: "Updates an existing pet.",
        operationId: "updatePet",
        parameters: [
          {
            in: "path",
            name: "petId",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/NewPet",
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Pet updated",
          },
        },
        summary: "Update a pet",
        tags: ["pets"],
      },
    },
    "/store/orders": {
      post: {
        description: "Place a new order in the store.",
        operationId: "placeOrder",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Order",
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Order placed",
          },
        },
        summary: "Place an order",
        tags: ["store"],
      },
    },
  },
  servers: [
    {
      description: "Production server",
      url: "https://api.example.com/v1",
    },
    {
      description: "Staging server",
      url: "https://staging-api.example.com/v1",
    },
  ],
  tags: [
    {
      description: "Operations related to pets",
      name: "pets",
    },
    {
      description: "Access to Petstore orders",
      name: "store",
    },
  ],
}
