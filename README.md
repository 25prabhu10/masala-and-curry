# Masala and Curry

A modern food delivery application for restaurants built with a robust monorepo architecture. This project delivers a complete food ordering experience across multiple platforms with a shared API backend.

## Architecture

This monorepo uses [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces) to manage multiple applications and shared packages efficiently.

### Applications

- **Web App** (`apps/web`) - Customer-facing web application built with React and TanStack Router
- **Mobile App** (`apps/mobile`) - Cross-platform mobile app for iOS and Android using React Native and Expo
- **API Server** (`apps/server`) - Backend API built with Hono.js and deployed on Cloudflare Workers

### Packages

- **UI Components** - Shared UI libraries for web and mobile
- **API Client** - Type-safe API client for frontend applications
- **Tooling** - Shared configurations for TypeScript, Tailwind CSS, and other tools

## Quick Start

### Prerequisites

- Node.js 22.17+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/25prabhu10/masala-and-curry.git
cd masala-and-curry

# Install dependencies
pnpm install
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Or start individual applications
pnpm --filter @mac/web dev      # Web app
pnpm --filter @mac/mobile dev   # Mobile app
pnpm --filter @mac/server dev   # API server
```

### Building

```bash
# Build all applications
pnpm build

# Run mobile app on Android
pnpm android
```

## Project Structure

```
masala-and-curry/
├── apps/
│   ├── web/          # React web application
│   ├── mobile/       # React Native mobile app
│   └── server/       # Hono.js API server
├── packages/
│   ├── web-ui/       # Web UI components
│   ├── mobile-ui/    # Mobile UI components
│   └── api-client/   # Shared API client
└── tooling/          # Shared configurations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the GPLv2 License - see the [LICENSE](LICENSE) file for details.
