#!/bin/bash

# Navigate to the directory where your package.json is located
cd /frontend/

npm install -g @vue/cli
npm install -g prettier

# Install project dependencies
npm install

# Start your NestJS application
npm run serve
