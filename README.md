# Porto Alegre Bus MCP Server

MCP server for Porto Alegre's public transportation data. Access bus stops, routes, and real-time information through Claude Desktop or any MCP-compatible client.

## Features

- 🚌 List all bus stops in Porto Alegre
- 🛣️ Browse available bus routes
- 📍 Get detailed route information (stops, schedule, path)
- ⚡ Redis caching for improved performance
- 🌐 HTTP streaming server with stateless architecture

## Quick Start

### Environment Variables

For local development, create a `.env` file:

```env
REDIS_URL=redis://localhost:6379 
```
### Using Docker (Recommended)

The command below will start the MCP server along with a Redis instance:

```bash
docker-compose up -d
```

### Other useful commands

```bash
pnpm test        # Run MCP Inspector
pnpm check       # Lint & format check
pnpm check:fix   # Auto-fix issues
```

## Claude Desktop Integration

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "poa-bus": {
      "command": "npx",
      "args": ["mcp-remote", "http:localhost:3000/mcp"]
    }
  }
}
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `stops-fetcher` | List all bus stops | None |
| `routes-fetcher` | List all bus routes | None |
| `route-details-fetcher` | Get route details | `routeId` (string) |

### Architecture

- **HTTP Server**: Express with CORS support on port 3000
- **MCP Protocol**: Streamable HTTP transport
- **Caching**: Redis integration for API response caching
- **Data Source**: Porto Alegre Transport API (`poatransporte.com.br`)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Run `pnpm check` before committing
4. Open a Pull Request

## License

MIT - See [LICENSE](LICENSE)

## Author

[@emiliosheinz](https://github.com/emiliosheinz)
