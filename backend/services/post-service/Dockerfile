# Base image
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy app files
COPY . .

# Expose the service's port
EXPOSE 3002

# Run the app
CMD ["node", "server.js"]
