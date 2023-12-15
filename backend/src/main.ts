// backend main.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as fs from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// necessary for handling wss connections.
class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    const httpServer = server.server; // Get the underlying HTTP server

    // Apply your httpsOptions to the HTTP server
    const httpsOptions = {
      key: fs.readFileSync('/certificates/certificate.key'),
      cert: fs.readFileSync('/certificates/certificate.cert'),
    };
    const httpsServer = require('https').createServer(httpsOptions, httpServer);

    // Attach the WebSocket server to the HTTPS server
    server.attach(httpsServer);

    return server;
  }
}

async function bootstrap() {
  const expressApp = express();
  const config = new ConfigService();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      httpsOptions: {
        key: fs.readFileSync('/certificates/certificate.key'),
        cert: fs.readFileSync('/certificates/certificate.cert'),
      },
    },
  );
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.enableCors({
    origin: [
      `https://${process.env.BACKEND_IP}:8080`,
      'https://localhost:8080',
      `https://${process.env.BACKEND_IP}:3000`,
      'https://localhost:3000',
    ],
  });

  // Add a custom middleware for handling the redirect
  expressApp.use((req, res, next) => {
    if (req.url === '/' && req.method === 'GET') {
      // Assuming your frontend is running on port 8080
      return res.redirect(302, `https://${process.env.BACKEND_IP}:8080`);
    }
    next();
  });

  // Enable CORS for all routes
  app.use(cors());

  await app.listen(3000);
}

bootstrap();
