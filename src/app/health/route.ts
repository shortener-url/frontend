export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DependencyStatus = "ok" | "degraded" | "unavailable";

export async function GET() {
    const baseUrl = process.env.URL_BACKEND?.trim();
    let dependencyStatus: DependencyStatus = "unavailable";
    let statusCode: number | null = null;

    if (baseUrl) {
        try {            
            const healthUrl = new URL(baseUrl);
            healthUrl.pathname = "/health";
            healthUrl.search = "";
            healthUrl.hash = "";
            const response = await fetch(healthUrl, {
                method: "GET",
                cache: "no-store",
                signal: AbortSignal.timeout(4000),
            });
            statusCode = response.status;
            dependencyStatus = response.ok ? "ok" : "degraded";
        } catch {
            dependencyStatus = "unavailable";
        }
    }

    const healthy = dependencyStatus === "ok";

    return Response.json(
        {
            status: healthy ? "ok" : "error",
            timestamp: new Date().toISOString(),
            image: "/image.svg",
            dependencies: [
                { name: "shortener-url-backend", status: dependencyStatus, statusCode },
            ],
        },
        {
            status: healthy ? 200 : 500,
            headers: { "Cache-Control": "no-store, max-age=0" },
        },
    );
}
