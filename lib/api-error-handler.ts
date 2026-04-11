/**
 * Wraps a Next.js API route handler with automatic error logging.
 * Catches unhandled exceptions (500) and also intercepts 4xx/5xx responses.
 */
import { NextRequest, NextResponse } from "next/server";
import { logError, extractRequestContext } from "./error-logger";

type RouteHandler = (
  req: NextRequest,
  ctx?: unknown
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap an API route handler to auto-log 4xx/5xx errors.
 * Usage:
 *   export const POST = withErrorLogging(async (req) => { ... });
 */
export function withErrorLogging(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, ctx?: unknown) => {
    const reqCtx = extractRequestContext(req);

    try {
      const response = await handler(req, ctx);

      // Log 4xx and 5xx responses
      if (response.status >= 400) {
        // Try to extract error message from response body
        let errorMessage = `HTTP ${response.status}`;
        try {
          const cloned = response.clone();
          const body = await cloned.json();
          if (body?.error) errorMessage = String(body.error).slice(0, 500);
        } catch {
          // Body isn't JSON or can't be read
        }

        // Get user ID from auth if available
        let userId: string | null = null;
        try {
          const { createClient } = await import("./supabase/server");
          const supabase = await createClient();
          const { data } = await supabase.auth.getUser();
          userId = data?.user?.id || null;
        } catch {
          // Auth not available
        }

        logError({
          statusCode: response.status,
          ...reqCtx,
          errorMessage,
          userId,
        });
      }

      return response;
    } catch (err) {
      // Unhandled exception → 500
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`[API_ERROR] ${reqCtx.method} ${reqCtx.path}:`, err);

      logError({
        statusCode: 500,
        ...reqCtx,
        errorMessage,
        userId: null,
      });

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
