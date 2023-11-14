#!/bin/bash

# Navigate to the directory where your package.json is located
cd /backend/

npm install -g @nestjs/cli
npm install -g prettier

# Install project dependencies
npm install

# Start your NestJS application
npm run start:dev
