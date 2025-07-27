# Use official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies first (better for caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite default dev port
EXPOSE 5173

# Run Vite development server
CMD ["npm", "run", "dev"]
