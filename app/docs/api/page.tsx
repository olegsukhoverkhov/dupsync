import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference — DubSync",
  description:
    "Interactive OpenAPI reference for the DubSync API: create projects, start dubbing, list dubs, download videos.",
  alternates: { canonical: "https://dubsync.app/docs/api" },
  robots: { index: true, follow: true },
};

export const dynamic = "force-static";

/**
 * Swagger UI documentation page for the DubSync public API.
 *
 * Loaded from jsdelivr CDN to avoid pulling swagger-ui-dist into the
 * client bundle. The UI calls `/v1/openapi.json` to fetch the spec,
 * renders every endpoint, and lets integrators click "Try it out"
 * directly from their browser (they'll need to paste an API key into
 * the Authorize dialog).
 *
 * Kept as a server component that returns a minimal HTML page — the
 * Swagger bootstrap code runs purely on the client via the <script>
 * tag. No hydration, no React, no bundle impact.
 */
export default function ApiDocsPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css"
      />
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" />
      <style>{`
        body { margin: 0; background: #0F172A; }
        .swagger-ui, .swagger-ui .info, .swagger-ui .info .title,
        .swagger-ui .opblock-tag, .swagger-ui .opblock .opblock-summary-description,
        .swagger-ui .parameter__name, .swagger-ui .parameter__type,
        .swagger-ui table thead tr td, .swagger-ui table thead tr th,
        .swagger-ui .tab li, .swagger-ui .response-col_status,
        .swagger-ui .model-title, .swagger-ui .model {
          color: #e2e8f0 !important;
        }
        .swagger-ui .info .title small pre { background: #1e293b; color: #f472b6; }
        .swagger-ui .opblock-tag { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .swagger-ui .opblock { background: rgba(30,41,59,0.5); border: 1px solid rgba(255,255,255,0.08); }
        .swagger-ui .opblock .opblock-summary { border-color: rgba(255,255,255,0.08); }
        .swagger-ui select, .swagger-ui input[type=text], .swagger-ui input[type=email],
        .swagger-ui textarea {
          background: #1e293b; color: #e2e8f0; border-color: rgba(255,255,255,0.1);
        }
        .swagger-ui .btn.authorize { color: #f472b6; border-color: #f472b6; }
        .swagger-ui .btn.execute { background: #ec4899; border-color: #ec4899; }
      `}</style>
      <div id="swagger-ui" />
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener("load", function () {
              if (!window.SwaggerUIBundle) return;
              window.ui = SwaggerUIBundle({
                url: "/v1/openapi.json",
                dom_id: "#swagger-ui",
                deepLinking: true,
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
                layout: "BaseLayout",
                tryItOutEnabled: true,
                persistAuthorization: true,
              });
            });
          `,
        }}
      />
    </>
  );
}
