# Use the latest lightweight Node.js image based on Alpine
FROM node:22-alpine

# Set the working directory for your application inside the container
WORKDIR /usr

# Copy the package.json and package-lock.json from the Authentication microservice
COPY package*.json ./
COPY wait-for-it.sh ./

RUN chmod +x wait-for-it.sh
# Install app dependencies
RUN npm install --production

# Copy the entire Authentication service folder into the container
COPY . .


# Expose the port the service will run on
EXPOSE 3000

# Set environment variable to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
