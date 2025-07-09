# BN API Proxy Service

A Node.js TypeScript proxy service that forwards requests to the Binance API and returns results. Deployed on Render Singapore region.

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```bash
PORT=3000
BN_SPOT_API_BASE_URL=https://api.binance.com
BN_FUTURES_API_BASE_URL=https://fapi.binance.com
NODE_ENV=development
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## API Endpoints

### Health Check
- `GET /health` - Returns service health status

### Proxy Endpoints
- `GET /api/v3/*` - Proxies all requests to Binance Spot/Margin API (api.binance.com)
- `POST /api/v3/*` - Proxies all POST requests to Binance Spot/Margin API
- `GET /fapi/v1/*` - Proxies all requests to Binance UM Futures API (fapi.binance.com)
- `POST /fapi/v1/*` - Proxies all POST requests to Binance UM Futures API

## Deployment

### Render Configuration
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Node.js
- Region: Singapore

### Environment Variables for Production
Set these in Render dashboard:
- `PORT` (auto-configured by Render)
- `BN_SPOT_API_BASE_URL=https://api.binance.com`
- `BN_FUTURES_API_BASE_URL=https://fapi.binance.com`
- `NODE_ENV=production`

## Project Structure
```
src/
├── index.ts          # Main server entry point
├── middleware/       # Custom middleware
├── routes/          # API routes
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

## Error Handling
- All requests are logged
- Errors are returned with appropriate HTTP status codes
- Rate limiting is handled by upstream BN API

## Security
- CORS enabled for all origins
- Request/response logging
- Environment-based configuration