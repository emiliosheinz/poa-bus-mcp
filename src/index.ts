import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { cache } from "./Cache";
import { getServer } from "./server";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
    allowedHeaders: ["Content-Type", "mcp-session-id"],
  }),
);

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

// SSE notifications not supported in stateless mode
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

// Session termination not needed in stateless mode
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

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await cache.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await cache.disconnect();
  process.exit(0);
});
