// backend main.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as fs from 'fs';

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
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('/certificates/certificate.key'),
      cert: fs.readFileSync('/certificates/certificate.cert'),
    },
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  app.enableCors({
    origin: [
      `https://${process.env.BACKEND_IP}:8080`,
      'https://localhost:8080',
      `https://${process.env.BACKEND_IP}:3000`,
      'https://localhost:3000',
    ],
  });

  // Enable CORS for all routes
  app.use(cors());
  
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3000);
}

bootstrap();
