# Use Node.js LTS as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Expose the service's port
EXPOSE 5001

# Start the notification service
CMD ["node", "server.js"]
