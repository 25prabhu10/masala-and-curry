# Masala and Curry Website

The customer-facing website for Masala and Curry food delivery service. Built with modern React technologies for a fast, responsive, and intuitive user experience.

## Features

- **Modern React** - Built with React 19 and latest patterns
- **Type-Safe Routing** - TanStack Router for robust navigation
- **Responsive Design** - Tailwind CSS for beautiful, mobile-first UI
- **Real-time Updates** - TanStack Query for efficient data fetching
- **Progressive Web App** - PWA capabilities for app-like experience
- **Authentication** - Secure user login and registration
- **Order Management** - Browse menu, add to cart, and track orders

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Authentication**: Better Auth
- **UI Components**: Custom component library
- **Type Safety**: TypeScript throughout

## Getting Started

### Prerequisites

- Node.js 22.17+
- pnpm 10+

### Development

```bash
# Install dependencies (from project root)
pnpm install

# Start development server
pnpm --filter @mac/web dev

# Or from this directory
cd apps/web
pnpm dev
```

The app will start at `http://localhost:5173`

### Building

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## UI Components

The web app uses a custom component library (`@mac/web-ui`) that includes:

- **Form Controls** - Inputs, buttons, labels with consistent styling
- **Layout Components** - Responsive grids and containers
- **Navigation** - Headers, menus, and breadcrumbs
- **Feedback** - Loading states, error messages, and notifications

## Key Features

### Menu Browsing

- Browse restaurant menu by categories
- Search and filter menu items
- View detailed item descriptions and images
- Dietary restrictions and allergen information

### Shopping Cart

- Add/remove items with customizations
- Real-time price calculations
- Save cart for later
- Quick reorder from order history

### User Account

- Profile management
- Order history and tracking
- Favorite items and restaurants
- Address book management

### Order Flow

- Seamless checkout process
- Multiple payment options
- Real-time order tracking
- Delivery time estimates

## Project Structure

```
src/
├── app.tsx             # Main app component
├── main.tsx            # Entry point
├── routes/             # Page components and routing
├── assets/             # Static assets (images, icons)
├── lib/                # Utilities and configurations
└── styles/             # Global styles and Tailwind config
```

## Security

- **Content Security Policy** - XSS protection
- **Secure Authentication** - HTTP-only cookies
- **Input Validation** - Client and server-side validation
- **HTTPS Only** - Secure communication
