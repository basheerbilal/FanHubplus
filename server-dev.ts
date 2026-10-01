import express from "express";
import { createServer as createViteServer } from "vite";

async function createServer() {
  process.env.IS_DEV_SERVER = "true";
  const { default: app } = await import("./server.ts");
  
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      watch: {
        ignored: (filePath: string) => {
          const normalized = filePath.replace(/\\/g, '/');
          return (
            normalized.includes('/data/') ||
            normalized.includes('/public/uploads/') ||
            normalized.includes('/uploads/') ||
            normalized.endsWith('/database.json') ||
            normalized.includes('/dist/') ||
            normalized.includes('/.git/')
          );
        }
      }
    },
    appType: "spa",
  });

  const server = express();
  
  // Mount the API app first so API routes handle requests before Vite
  server.use(app);
  
  // Use vite's connect instance as middleware for frontend/SPA
  server.use(vite.middlewares);

  server.listen(3000, () => {
    console.log("Dev server running at http://localhost:3000");
  });
}

createServer();
