/**
 * DubSync public API — OpenAPI 3.1 specification.
 *
 * Kept as a hand-written TypeScript constant (instead of auto-generated
 * from zod schemas) because the API surface is small enough that the
 * overhead of a schema-inference layer isn't worth it, and hand-written
 * docs give us precise control over descriptions, examples, and error
 * shapes — which is what API consumers actually care about.
 *
 * Served as JSON at `/v1/openapi.json` and rendered via Swagger UI at
 * `/docs/api`. Update both this constant and the route handlers in
 * lock-step when adding or changing endpoints.
 */

export const openapiSpec = {
  openapi: "3.1.0",
  info: {
    title: "DubSync API",
    version: "1.0.0",
    description:
      "Public REST API for DubSync — AI video dubbing with voice cloning and lip sync in 30+ languages.\n\n" +
      "**Authentication**: Every request must include `Authorization: Bearer <API_KEY>`. " +
      "Generate keys from your dashboard at https://dubsync.app/api-keys. " +
      "API access requires a Pro or Business plan.\n\n" +
      "**Rate limits**: 60 req/min (Pro) or 300 req/min (Business). " +
      "Every response includes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.\n\n" +
      "**Errors**: Responses follow the shape `{ \"error\": { \"code\": \"...\", \"message\": \"...\" } }`.",
    contact: {
      name: "DubSync support",
      url: "https://dubsync.app/contact",
    },
  },
  servers: [{ url: "https://dubsync.app", description: "Production" }],
  security: [{ BearerAuth: [] }],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "API Key",
        description: "Prefix with `sk-dub-live_`",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string", example: "insufficient_credits" },
              message: { type: "string", example: "Need 15 credits, have 3." },
            },
          },
        },
      },
      Language: {
        type: "object",
        properties: {
          code: { type: "string", example: "es" },
          name: { type: "string", example: "Spanish" },
          region: { type: "string", example: "Europe" },
        },
      },
      Project: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          status: {
            type: "string",
            enum: ["uploading", "transcribing", "ready", "dubbing", "done", "error"],
          },
          original_language: { type: "string", example: "en" },
          duration_seconds: { type: "integer", nullable: true, example: 125 },
          transcript: {
            type: "array",
            nullable: true,
            items: {
              type: "object",
              properties: {
                start: { type: "number", format: "float" },
                end: { type: "number", format: "float" },
                text: { type: "string" },
              },
            },
          },
          error_message: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Dub: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          target_language: { type: "string", example: "es" },
          status: {
            type: "string",
            enum: [
              "pending",
              "translating",
              "generating_voice",
              "audio_ready",
              "lip_syncing",
              "merging",
              "done",
              "error",
            ],
          },
          progress: { type: "integer", minimum: 0, maximum: 100 },
          error_message: { type: "string", nullable: true },
          video_url: {
            type: "string",
            nullable: true,
            description:
              "Signed URL to the final MP4 (lip-synced). Null until status=done. TTL 1h.",
          },
          audio_url: {
            type: "string",
            nullable: true,
            description:
              "Signed URL to the dubbed WAV audio. Available as soon as Stage 1 finishes. TTL 1h.",
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/v1/languages": {
      get: {
        operationId: "listLanguages",
        summary: "List supported languages",
        description: "Returns every target language DubSync can dub video into.",
        responses: {
          "200": {
            description: "Language list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    languages: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Language" },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "429": { $ref: "#/components/responses/RateLimited" },
        },
      },
    },
    "/v1/projects": {
      post: {
        operationId: "createProject",
        summary: "Create a project by uploading a video",
        description:
          "Uploads a video file, transcribes it, and returns the project metadata. " +
          "Synchronous — wait up to 5 minutes. For very long videos, handle 504 and poll `GET /v1/projects/{id}`.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["video", "title"],
                properties: {
                  video: {
                    type: "string",
                    format: "binary",
                    description: "MP4, MOV, AVI, WebM, or MKV file.",
                  },
                  title: {
                    type: "string",
                    description: "Human-readable project name (unique per user).",
                  },
                  source_language: {
                    type: "string",
                    description:
                      "ISO 639-1 code of the spoken language, or 'auto' (default) to detect.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Project created and transcribed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "402": { $ref: "#/components/responses/PaymentRequired" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "409": { $ref: "#/components/responses/Conflict" },
          "413": { $ref: "#/components/responses/PayloadTooLarge" },
          "429": { $ref: "#/components/responses/RateLimited" },
        },
      },
    },
    "/v1/projects/{id}": {
      get: {
        operationId: "getProject",
        summary: "Get project metadata",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Project",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "429": { $ref: "#/components/responses/RateLimited" },
        },
      },
    },
    "/v1/projects/{id}/dub": {
      post: {
        operationId: "startDubbing",
        summary: "Start dubbing a project into target languages",
        description:
          "Kicks off dubbing jobs for one or more languages. Credits are deducted immediately " +
          "(plan credits first, then top-up). Stage 1 (audio) runs synchronously; Stage 2 (lip sync) " +
          "runs asynchronously — poll `GET /v1/projects/{id}/dubs` until each dub reports `status=done`.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["languages"],
                properties: {
                  languages: {
                    type: "array",
                    items: { type: "string" },
                    example: ["es", "fr", "ja"],
                  },
                },
              },
            },
          },
        },
        responses: {
          "202": {
            description: "Dub jobs created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    dubs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Dub" },
                    },
                    credits_charged: { type: "integer" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "402": { $ref: "#/components/responses/PaymentRequired" },
          "403": { $ref: "#/components/responses/Forbidden" },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": { $ref: "#/components/responses/Conflict" },
          "429": { $ref: "#/components/responses/RateLimited" },
        },
      },
    },
    "/v1/projects/{id}/dubs": {
      get: {
        operationId: "listDubs",
        summary: "List dubs for a project with signed download URLs",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Dub list with 1h-TTL signed URLs.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    dubs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Dub" },
                    },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
          "404": { $ref: "#/components/responses/NotFound" },
          "429": { $ref: "#/components/responses/RateLimited" },
        },
      },
    },
  },
} as const;

// Inject shared error responses into components. Kept separate so the
// paths block above stays readable.
(openapiSpec.components as unknown as { responses: Record<string, unknown> }).responses = {
  BadRequest: {
    description: "Invalid request body or parameters.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  Unauthorized: {
    description: "Missing or invalid API key.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  PaymentRequired: {
    description: "Insufficient credits.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  Forbidden: {
    description: "Your plan doesn't allow this action.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  NotFound: {
    description: "Resource not found.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  Conflict: {
    description: "Resource already exists or is in a conflicting state.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  PayloadTooLarge: {
    description: "File size or duration exceeds your plan's limits.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  RateLimited: {
    description: "Too many requests. Check `Retry-After` header.",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
};
