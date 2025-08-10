import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { cache } from "./Cache";
import { getServer } from "./server";

/** Express application instance */
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
    allowedHeaders: ["Content-Type", "mcp-session-id"],
  }),
);

/**
 * POST /mcp - Main MCP endpoint for handling stateless requests
 * Creates a new server instance for each request
 */
app.post("/mcp", async (req, res) => {
  try {
    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableDnsRebindingProtection: true,
      });
    const server = getServer();
    res.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

/**
 * GET /mcp - SSE notifications endpoint (not supported in stateless mode)
 * Returns 405 Method Not Allowed
 */
app.get("/mcp", async (_, res) => {
  console.log("Received GET MCP request");
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    }),
  );
});

/**
 * DELETE /mcp - Session termination endpoint (not needed in stateless mode)
 * Returns 405 Method Not Allowed
 */
app.delete("/mcp", async (_, res) => {
  console.log("Received DELETE MCP request");
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    }),
  );
});

/**
 * Starts the HTTP server and initializes Redis connection
 * Server continues to operate even if Redis connection fails
 */
async function startServer() {
  try {
    await cache.connect();
    console.log("Connected to Redis cache");
  } catch (error) {
    console.warn("Failed to connect to Redis cache, will operate without caching:", error);
  }

  app.listen(3000, (error) => {
    if (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
    console.log(`MCP Stateless Streamable HTTP Server listening on port ${3000}`);
  });
}

startServer();

/**
 * Graceful shutdown handler for SIGINT signal
 */
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await cache.disconnect();
  process.exit(0);
});

/**
 * Graceful shutdown handler for SIGTERM signal
 */
process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await cache.disconnect();
  process.exit(0);
});
