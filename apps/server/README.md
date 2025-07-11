# Masala and Curry Server

The backend API server for the Masala and Curry food delivery application. Built with Hono.js and deployed on Cloudflare Workers for global edge performance.

## Tech Stack

- **Framework**: [Hono.js](https://hono.dev/) - Ultra-fast web framework
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: Zod with OpenAPI integration
- **Authentication**: Better Auth
- **Testing**: Vitest

## Getting Started

### Prerequisites

- Node.js 22.17+
- pnpm 10+
- Cloudflare account (for deployment)

### Development

```bash
# Install dependencies (from project root)
pnpm install

# Start development server
pnpm --filter @mac/server dev

# Or from this directory
cd apps/server
pnpm dev
```

The server will start at `http://localhost:8080`

### Database Operations

```bash
# Generate database migrations
pnpm db:generate

# Apply migrations locally
pnpm db:migrate

# Open database studio
pnpm db:studio
```

### Testing

```bash
# Run tests
pnpm test
```

## API Endpoints

The API follows RESTful conventions and includes:

- **Authentication** - User registration, login, and session management
- **Menu Management** - Restaurant menu items and categories
- **Order Processing** - Order creation, tracking, and management
- **User Profiles** - Customer and restaurant profile management
- **Payment Integration** - Secure payment processing

### API Documentation

When running locally, visit:

- API Documentation: `http://localhost:8787/api/v1/reference`
- OpenAPI Spec: `http://localhost:8787/api/v1/open-api-schema.json`

## Deployment

### Cloudflare Workers

```bash
# Generate TypeScript types for Cloudflare bindings
pnpm cf-typegen

# Deploy to production
pnpm deploy
```

### Environment Variables

Configure the following in your Cloudflare Workers dashboard:

```env
DATABASE_URL=your-d1-database-url
AUTH_SECRET=your-auth-secret
PAYMENT_API_KEY=your-payment-provider-key
```

## Project Structure

```
src/
├── app.ts              # Main application setup
├── index.ts            # Worker entry point
├── db/                 # Database schema and migrations
├── lib/                # Utility functions and configurations
├── middlewares/        # Custom middleware
├── resources/          # Business logic and data access
└── routes/             # API route handlers
```

## Security

- Input validation with Zod schemas
- Rate limiting and CORS protection
- Secure authentication with Better Auth
- SQL injection protection with Drizzle ORM
