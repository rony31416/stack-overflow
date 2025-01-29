# Use Node.js LTS as the base image
FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the service's port
EXPOSE 5002

# Start the notification service
CMD ["node", "server.js"]
