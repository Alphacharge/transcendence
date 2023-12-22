#!/bin/bash

cd /backend/

npm cache clean -f
npm install -g @nestjs/cli
npm install

while ! echo > /dev/tcp/postgresql/5432; do
    sleep 1
done

echo "PostreSQL available."

echo y | npx prisma generate
npx ts-node src/seed.ts

npm run start:eva
