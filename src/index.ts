import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const BN_SPOT_API_BASE_URL = process.env.BN_SPOT_API_BASE_URL || 'https://api.binance.com';
const BN_FUTURES_API_BASE_URL = process.env.BN_FUTURES_API_BASE_URL || 'https://fapi.binance.com';

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'bn-api-proxy-service'
  });
});

const spotProxyOptions = {
  target: BN_SPOT_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onError: (err: Error, req: express.Request, res: express.Response) => {
    console.error('Spot API Proxy Error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
  onProxyReq: (proxyReq: any, req: express.Request) => {
    console.log(`Proxying spot request: ${req.method} ${req.url} -> ${BN_SPOT_API_BASE_URL}${req.url}`);
  }
};

const futuresProxyOptions = {
  target: BN_FUTURES_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/fapi': '/fapi'
  },
  onError: (err: Error, req: express.Request, res: express.Response) => {
    console.error('Futures API Proxy Error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
  onProxyReq: (proxyReq: any, req: express.Request) => {
    console.log(`Proxying futures request: ${req.method} ${req.url} -> ${BN_FUTURES_API_BASE_URL}${req.url}`);
  }
};

app.use('/api', createProxyMiddleware(spotProxyOptions));
app.use('/fapi', createProxyMiddleware(futuresProxyOptions));

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: 'Use /api/v3/* for spot/margin API or /fapi/v1/* for futures API'
  });
});

app.listen(PORT, () => {
  console.log(`BN API Proxy Service running on port ${PORT}`);
  console.log(`Spot API Base URL: ${BN_SPOT_API_BASE_URL}`);
  console.log(`Futures API Base URL: ${BN_FUTURES_API_BASE_URL}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});