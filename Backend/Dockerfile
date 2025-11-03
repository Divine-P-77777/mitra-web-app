# -------- Stage 1: Build the TypeScript project --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDeps for TypeScript build)
RUN npm ci

# Copy TypeScript source and config
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript → dist/
RUN npm run build


# -------- Stage 2: Run production image --------
FROM node:20-alpine

WORKDIR /app

# Copy only package.json + lock for clean install
COPY package*.json ./

# Install only production dependencies (exclude devDeps)
RUN npm ci --omit=dev

# Copy compiled dist files from builder
COPY --from=builder /app/dist ./dist

# Copy .env if you want environment configuration
# COPY .env .env

# Expose your backend port (default: 5000)
EXPOSE 5000

# Command to run your app
CMD ["node", "dist/index.js"]
