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
app.use(express.json());

// JSON to Query transformation will be handled in onProxyReq

app.get('/health', (_, res) => {
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
  onError: (err: Error, _: express.Request, res: express.Response) => {
    console.error('Spot API Proxy Error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
  onProxyReq: (proxyReq: any, req: express.Request) => {
    console.log('=== Original Request ===');
    console.log(`Original URL: ${req.url}`);
    console.log(`Method: ${req.method}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Query params:', req.query);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('===================================');

    // Handle JSON to Query transformation for GET requests
    if (req.method === 'GET' && req.body && Object.keys(req.body).length > 0) {
      console.log('Transforming GET request with JSON body to query parameters...');
      
      // Convert JSON body to query parameters
      const queryParams = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        queryParams.set(key, String(value));
      });
      
      const queryString = queryParams.toString();
      const originalPath = proxyReq.path;
      
      // Append query parameters to proxy request path
      proxyReq.path = originalPath + (originalPath.includes('?') ? '&' : '?') + queryString;
      
      // Remove content-related headers for GET requests
      proxyReq.removeHeader('content-type');
      proxyReq.removeHeader('content-length');
      
      console.log(`Transformed proxy path from ${originalPath} to ${proxyReq.path}`);
    }

    console.log('=== Proxy Request ===');
    console.log('Proxy request path:', proxyReq.path);
    console.log('Proxy request full URL:', `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    console.log('===================================');
  },
  onProxyRes: (proxyRes: any, _: express.Request) => {
    console.log('=== DETAILED PROXY RESPONSE DEBUG ===');
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Status Message: ${proxyRes.statusMessage}`);
    console.log('====================================');
  }
};

const futuresProxyOptions = {
  target: BN_FUTURES_API_BASE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/fapi': '/fapi'
  },
  onError: (err: Error, _: express.Request, res: express.Response) => {
    console.error('Futures API Proxy Error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  },
  onProxyReq: (proxyReq: any, req: express.Request) => {
    console.log('=== Original Request ===');
    console.log(`Original URL: ${req.url}`);
    console.log(`Method: ${req.method}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Query params:', req.query);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('===================================');

    // Handle JSON to Query transformation for GET requests
    if (req.method === 'GET' && req.body && Object.keys(req.body).length > 0) {
      console.log('Transforming GET request with JSON body to query parameters...');
      
      // Convert JSON body to query parameters
      const queryParams = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        queryParams.set(key, String(value));
      });
      
      const queryString = queryParams.toString();
      const originalPath = proxyReq.path;
      
      // Append query parameters to proxy request path
      proxyReq.path = originalPath + (originalPath.includes('?') ? '&' : '?') + queryString;
      
      // Remove content-related headers for GET requests
      proxyReq.removeHeader('content-type');
      proxyReq.removeHeader('content-length');
      
      console.log(`Transformed proxy path from ${originalPath} to ${proxyReq.path}`);
    }

    console.log('=== Proxy Request ===');
    console.log('Proxy request path:', proxyReq.path);
    console.log('Proxy request full URL:', `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    console.log('===================================');
  },
  onProxyRes: (proxyRes: any, _: express.Request) => {
    console.log('=== DETAILED FUTURES PROXY RESPONSE DEBUG ===');
    console.log(`Status: ${proxyRes.statusCode}`);
    console.log(`Status Message: ${proxyRes.statusMessage}`);
    console.log('=============================================');
  }
};

app.use('/api', createProxyMiddleware(spotProxyOptions));
app.use('/fapi', createProxyMiddleware(futuresProxyOptions));

app.use('*', (_, res) => {
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