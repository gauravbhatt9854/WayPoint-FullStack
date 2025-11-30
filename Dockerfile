FROM  node:18

# Set working directory
WORKDIR /app

# Install dependencies early to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build


# Expose the port Vite uses (5173 for dev, but production usually uses 3000 or serves static)
EXPOSE 5173

# Start the app (adjust if you're serving static files or using a framework)
CMD ["npm", "start"]
