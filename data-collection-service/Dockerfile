# Use an official Node runtime as the base image
FROM node:18-alpine

# Add additional dependencies for production
RUN apk add --no-cache tini

# Declaring env
ENV MONGO_URI=mongodb+srv://hgdsandakalum:AOU0CZt9nXpzrdGs@cluster0.kusbd.mongodb.net/retina-care-db?retryWrites=true&w=majority&appName=Cluster0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]

# Start the service
CMD ["node", "index.js"]