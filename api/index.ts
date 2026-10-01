import app from "../server.ts";

export default function handler(req: any, res: any) {
  // If Vercel rewrote the URL, use the original matched path
  const matchedPath = req.headers["x-matched-path"];
  if (matchedPath && typeof matchedPath === "string") {
    req.url = matchedPath;
  }

  // If the path does not start with /api, prepend /api so Express routes match
  if (req.url && !req.url.startsWith("/api") && !req.url.startsWith("/?")) {
    req.url = "/api" + req.url;
  }

  return app(req, res);
}
