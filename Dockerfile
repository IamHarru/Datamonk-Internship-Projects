FROM node:18
# Install build tools for sqlite3
RUN apt-get update && apt-get install -y make gcc g++ python3 && rm -rf /var/lib/apt/lists/*
# Set working dir to backend
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY backend/ ./
RUN npm install

# Copy backend source AFTER npm install (to avoid cache issues)

# Copy frontend files
WORKDIR /app
COPY frontend ./frontend

# Set working directory back to backend for execution
WORKDIR /app/backend

EXPOSE 5000
CMD ["node", "index.js"]
