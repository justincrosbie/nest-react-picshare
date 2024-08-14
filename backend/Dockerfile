# Step 1: Build the application
FROM node:18 AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Step 2: Run the application
FROM node:18-alpine
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port NestJS will run on
EXPOSE 3000

# Start the NestJS application
CMD ["node", "dist/main"]