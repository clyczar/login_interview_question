# Use an official Node.js runtime as a parent image
FROM node:18.0.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port your app runs on
EXPOSE 8888

# Define the command to run your application
CMD ["npm", "test"]