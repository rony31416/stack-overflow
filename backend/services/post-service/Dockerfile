# Base image
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose the service's port
EXPOSE 3002

# Run the app
CMD ["node", "server.js"]
