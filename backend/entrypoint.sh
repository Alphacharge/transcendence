#!/bin/bash

# Navigate to the directory where your package.json is located
cd /backend/

npm install -g @nestjs/cli

# Install project dependencies
npm install

# Start your NestJS application
npm run start:dev
