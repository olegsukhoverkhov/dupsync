import { NextResponse } from "next/server";
import { openapiSpec } from "@/lib/openapi-spec";

export const dynamic = "force-static";

/**
 * GET /v1/openapi.json — DubSync public API specification.
 *
 * Static JSON, no authentication required — this is how integrators
 * discover the API surface, generate SDK clients, and import into
 * Postman/Insomnia. Served from the edge cache since the spec only
 * changes on deploy.
 */
export function GET() {
  return NextResponse.json(openapiSpec, {
    headers: {
      // Allow CORS so Swagger UI and other doc portals can fetch.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
