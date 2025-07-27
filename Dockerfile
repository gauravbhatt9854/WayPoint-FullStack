# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app source
COPY . .

# Build the application
RUN npm run build

# Expose the port (optional, change if needed)
EXPOSE 5173

# Start the application
CMD ["npm", "start"]
