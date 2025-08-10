import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { InvalidCursorError, paginateData } from "./pagination";
import { PoaTransporte } from "./poa-transporte";

export const getServer = () => {
  const server = new McpServer({
    name: "poa-bus-server",
    version: "0.0.1",
  });

  server.registerTool(
    "stops-fetcher",
    {
      title: "Stops Fetcher",
      description:
        "Lists every available bus stop in Porto Alegre with pagination",
      inputSchema: {
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching next page"),
      },
    },
    async ({ cursor }) => {
      try {
        const data = await PoaTransporte.getStops();
        const paginated = paginateData(data, cursor);
        return { content: [{ type: "text", text: JSON.stringify(paginated) }] };
      } catch (error) {
        if (error instanceof InvalidCursorError) {
          // MCP spec: Invalid cursors should result in error code -32602 (Invalid params)
          throw new Error(`Invalid params: ${error.message}`);
        }
        throw error;
      }
    },
  );

  server.registerTool(
    "routes-fetcher",
    {
      title: "Routes Fetcher",
      description:
        "Lists every available bus route in Porto Alegre with pagination",
      inputSchema: {
        cursor: z
          .string()
          .optional()
          .describe("Pagination cursor for fetching next page"),
      },
    },
    async ({ cursor }) => {
      try {
        const data = await PoaTransporte.getRoutes();
        const paginated = paginateData(data, cursor);
        return { content: [{ type: "text", text: JSON.stringify(paginated) }] };
      } catch (error) {
        if (error instanceof InvalidCursorError) {
          // MCP spec: Invalid cursors should result in error code -32602 (Invalid params)
          throw new Error(`Invalid params: ${error.message}`);
        }
        throw error;
      }
    },
  );

  server.registerTool(
    "route-details-fetcher",
    {
      title: "Route Details Fetcher",
      description: "Lists the details of a given bus route in Porto Alegre",
      inputSchema: {
        routeId: z.string().describe("The ID of a specific bus route"),
      },
    },
    async ({ routeId }) => {
      const data = await PoaTransporte.getRouteDetails(routeId);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  );

  return server;
};
