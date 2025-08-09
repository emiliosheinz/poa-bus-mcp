import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
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
      description: "Lists every available bus stop in Porto Alegre",
    },
    async () => {
      const data = await PoaTransporte.getStops();
      return { content: [{ type: "text", text: data }] };
    },
  );

  server.registerTool(
    "routes-fetcher",
    {
      title: "Routes Fetcher",
      description: "Lists every available bus route in Porto Alegre",
    },
    async () => {
      const data = await PoaTransporte.getRoutes();
      return { content: [{ type: "text", text: data }] };
    },
  );

  server.registerTool(
    "route-details-fetcher",
    {
      title: "Route Details Fetcher",
      description: "Lists the details of a given bus route in Porto Alegre",
      inputSchema: {
        // @ts-ignore
        routeId: z.string().describe("The ID of a specific bus route"),
      },
    },
    async ({ routeId }) => {
      const data = await PoaTransporte.getRouteDetails(routeId);
      return { content: [{ type: "text", text: data }] };
    },
  );

  return server;
};
