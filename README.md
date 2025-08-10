# 🚌 Porto Alegre Bus MCP Server

MCP server for Porto Alegre's public transportation data. Access bus stops, routes, and real-time information through Claude Desktop or any MCP-compatible client.

## Features

- 🚌 List all bus stops in Porto Alegre
- 🛣️ Browse available bus routes
- 📍 Get detailed route information (stops, schedule, path)
- 📄 Pagination support for large datasets
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

### Development Commands

```bash
pnpm test        # Run MCP Inspector
pnpm lint        # Run linter
pnpm format      # Format code
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
| `stops-fetcher` | List all bus stops with pagination | `cursor` (string, optional) |
| `routes-fetcher` | List all bus routes with pagination | `cursor` (string, optional) |
| `route-details-fetcher` | Get route details | `routeId` (string, required) |

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

## Acknowledgments

This project was inspired by and built upon the work of:

- [POABus](https://github.com/rafaeelaudibert/POABus) by [@rafaeelaudibert](https://github.com/rafaeelaudibert) - A comprehensive Porto Alegre bus system API
- [poatransporte](https://github.com/ClaudiaStrm/poatransporte) by [@ClaudiaStrm](https://github.com/ClaudiaStrm) - Porto Alegre public transportation data tools

These projects provided valuable insights into Porto Alegre's public transportation data structure and API patterns.

## License

MIT - See [LICENSE](LICENSE)
