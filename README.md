# Porto Alegre Bus MCP Server

An MCP (Model Context Protocol) server that provides access to Porto Alegre's public transportation data, including bus stops, routes, and route details.

## Features

- **List Bus Stops**: Fetch all available bus stops in Porto Alegre
- **List Bus Routes**: Retrieve all bus routes operating in the city
- **Route Details**: Get detailed information about specific bus routes

## Installation

```bash
# Clone the repository
git clone https://github.com/emiliosheinz/poa-bus-mcp.git
cd poa-bus-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## Usage

### Testing with MCP Inspector

The easiest way to test the server is using the MCP Inspector:

```bash
pnpm test
```

This will open a web interface where you can interact with all available tools.

### Integration with Claude Desktop

Add the server to your Claude Desktop configuration:

1. Open Claude Desktop settings
2. Go to Developer -> Edit Config
3. Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "poa-bus": {
      "command": "node",
      "args": ["/absolute/path/to/poa-bus-mcp/dist/index.js"]
    }
  }
}
```

4. Restart Claude Desktop

## Available Tools

### stops-fetcher
Lists all available bus stops in Porto Alegre.

**Parameters**: None

**Example Response**: Returns a list of all bus stops with their locations and identifiers.

### routes-fetcher
Lists all available bus routes in Porto Alegre.

**Parameters**: None

**Example Response**: Returns a list of all bus routes with their names and route numbers.

### route-details-fetcher
Provides detailed information about a specific bus route.

**Parameters**:
- `routeId` (string, required): The ID of the bus route

**Example Response**: Returns detailed route information including stops, schedule, and path.

## Development

### Scripts

- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run the compiled server
- `pnpm test` - Launch MCP Inspector for testing
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome
- `pnpm check` - Run all checks (lint + format)
- `pnpm check:fix` - Fix all auto-fixable issues

### Project Structure

```
poa-bus-mcp/
├── src/
│   ├── index.ts          # Main server implementation
│   └── poa-transporte.ts # API wrapper for Porto Alegre transport data
├── dist/                 # Compiled JavaScript (git-ignored)
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI pipeline
├── package.json
├── tsconfig.json         # TypeScript configuration
├── biome.json           # Biome linter configuration
└── README.md
```

### CI/CD

The project uses GitHub Actions for continuous integration. On every pull request to `main`, the workflow:
- Runs TypeScript type checking
- Runs Biome linting and formatting checks

## API Source

This server fetches data from Porto Alegre's public transportation API:
`http://www.poatransporte.com.br/php/facades/process.php`

## Technologies

- **TypeScript**: For type-safe development
- **MCP SDK**: Model Context Protocol implementation
- **Biome**: Fast formatter and linter
- **pnpm**: Package manager
- **GitHub Actions**: CI/CD pipeline

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all checks pass before submitting a PR:
```bash
pnpm check
pnpm build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[@emiliosheinz](https://github.com/emiliosheinz)

## Acknowledgments

- Porto Alegre public transportation system for providing the data API
- Anthropic for the MCP protocol specification