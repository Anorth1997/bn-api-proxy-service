# BN API Proxy Service

A high-performance Node.js TypeScript proxy service that forwards requests to Binance APIs and returns results. Deployed on Render Singapore region for optimal latency.

## 🚀 Features

- **Dual API Support**: Proxies both Binance Spot/Margin and UM Futures APIs
- **JSON to URL Parameters**: Automatically converts JSON payloads to URL parameters for GET requests
- **High Performance**: Built with Express.js and optimized for low latency
- **Security**: Includes CORS, Helmet, and request logging
- **Health Monitoring**: Built-in health check endpoint
- **Production Ready**: Configured for Render deployment

## 📋 API Endpoints

### Health Check
```
GET /health
```
Returns service status and timestamp.

### Binance Spot/Margin API Proxy
```
GET|POST /api/v3/*
```
Forwards requests to `https://api.binance.com/api/v3/*`

**Traditional URL Parameters:**
```bash
curl https://your-service.onrender.com/api/v3/ticker/price?symbol=BTCUSDT
```

**JSON Payload (GET only):**
```bash
curl -X GET https://your-service.onrender.com/api/v3/ticker/price \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTCUSDT"}'
```

### Binance UM Futures API Proxy
```
GET|POST /fapi/v1/*
```
Forwards requests to `https://fapi.binance.com/fapi/v1/*`

**Traditional URL Parameters:**
```bash
curl https://your-service.onrender.com/fapi/v1/ticker/price?symbol=BTCUSDT
```

**JSON Payload (GET only):**
```bash
curl -X GET https://your-service.onrender.com/fapi/v1/ticker/price \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTCUSDT"}'
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd bn-api-proxy-service
npm install
```

### Environment Setup
```bash
cp .env.example .env
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run typecheck

# Lint code
npm run lint
```

## 🚀 Deployment

### Render Deployment
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy to Singapore region

### Environment Variables
```bash
PORT=3000                                    # Auto-configured by Render
BN_SPOT_API_BASE_URL=https://api.binance.com
BN_FUTURES_API_BASE_URL=https://fapi.binance.com
NODE_ENV=production
```

## 📁 Project Structure
```
├── src/
│   └── index.ts          # Main server entry point
├── dist/                 # Compiled JavaScript (generated)
├── CLAUDE.md            # Claude-specific documentation
├── README.md            # This file
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── render.yaml          # Render deployment config
├── .env.example         # Environment variables template
└── .gitignore           # Git ignore rules
```

## 🔧 Configuration

### Proxy Configuration
The service automatically routes requests based on URL patterns:
- `/api/*` → Binance Spot/Margin API
- `/fapi/*` → Binance UM Futures API

### JSON to URL Parameters Transformation
For GET requests only, the service automatically converts JSON payloads to URL parameters:

**Input:**
```json
GET /api/v3/ticker/price
Content-Type: application/json
{
  "symbol": "BTCUSDT",
  "interval": "1h"
}
```

**Transformed to:**
```
GET /api/v3/ticker/price?symbol=BTCUSDT&interval=1h
```

**Key Features:**
- Only applies to GET requests
- Existing URL parameters are ignored (JSON payload takes precedence)
- Works for both `/api` and `/fapi` endpoints
- Transformation is logged for debugging

### CORS
CORS is enabled for all origins. Modify `src/index.ts` to restrict origins in production if needed.

### Logging
All requests are logged using Morgan with 'combined' format for production monitoring.

## 🚨 Error Handling

The service includes comprehensive error handling:
- Proxy errors return 500 status with error details
- Unknown routes return 404 with helpful message
- All errors are logged to console

## 📊 Monitoring

### Health Check
```bash
curl https://your-service.onrender.com/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "bn-api-proxy-service"
}
```

### Logs
Monitor application logs through Render dashboard or use log aggregation services.

## 🔒 Security

- **Helmet**: Security headers enabled
- **CORS**: Cross-origin requests configured
- **Request Logging**: All requests logged for monitoring
- **Environment Variables**: Sensitive data stored securely

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the logs in Render dashboard
- Review the health check endpoint
- Verify environment variables are set correctly