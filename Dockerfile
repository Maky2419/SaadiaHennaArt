# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy the rest of the app
COPY . .

EXPOSE 3000

# Default command is overridden by docker-compose for dev
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]
