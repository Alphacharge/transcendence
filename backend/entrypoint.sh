#!/bin/bash

cd /backend/

npm cache clean -f
npm config set loglevel error -g
npm install --no-fund --no-update-notifier -g @nestjs/cli
npm install --no-fund --no-update-notifier

while ! echo > /dev/tcp/postgresql/5432; do
    sleep 1
done

echo "PostreSQL available."

echo y | npx prisma migrate deploy
npx ts-node src/seed.ts

npm run start:eva
