# Multi-stage Dockerfile for FasalAI
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

EXPOSE 5000
CMD ["npm", "start"]
