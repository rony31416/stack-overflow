# Use Node.js as the base image
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 5001

# Run the server
CMD ["node", "server.js"]
