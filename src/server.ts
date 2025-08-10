import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { InvalidCursorError, paginateData } from "./Pagination";
import { PoaTransporteService } from "./PoaTransporte";
import {
  transformRouteDetails,
  transformRoutes,
  transformStops,
} from "./transformers";

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
      outputSchema: {
        data: z.array(
          z.object({
            code: z.string(),
            latitude: z.string(),
            longitude: z.string(),
            terminal: z.string(),
            routes: z.array(
              z.object({
                id: z.string(),
                code: z.string(),
                name: z.string(),
              }),
            ),
          }),
        ),
        nextCursor: z.string().optional(),
      },
    },
    async ({ cursor }) => {
      try {
        const apiData = await PoaTransporteService.getStops();
        const transformedData = transformStops(apiData);
        const pagination = paginateData(transformedData, cursor);
        return {
          content: [{ type: "text", text: JSON.stringify(pagination, null, 2) }],
          structuredContent: pagination,
        };
      } catch (error) {
        if (error instanceof InvalidCursorError) {
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
      outputSchema: {
        data: z.array(
          z.object({
            id: z.string(),
            code: z.string(),
            name: z.string(),
          }),
        ),
        nextCursor: z.string().optional(),
      },
    },
    async ({ cursor }) => {
      try {
        const apiData = await PoaTransporteService.getRoutes();
        const transformedData = transformRoutes(apiData);
        const pagination = paginateData(transformedData, cursor);
        return {
          content: [{ type: "text", text: JSON.stringify(pagination, null, 2) }],
          structuredContent: pagination,
        };
      } catch (error) {
        if (error instanceof InvalidCursorError) {
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
      outputSchema: {
        id: z.string(),
        code: z.string(),
        name: z.string(),
        coordinates: z.array(
          z.object({
            latitude: z.string(),
            longitude: z.string(),
          })
        ),
      },
    },
    async ({ routeId }) => {
      const apiData = await PoaTransporteService.getRouteDetails(routeId);
      const transformedData = transformRouteDetails(apiData);
      return {
        content: [{ type: "text", text: JSON.stringify(transformedData, null, 2) }],
        structuredContent: transformedData,
      };
    },
  );

  return server;
};
