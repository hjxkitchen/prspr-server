# Start from the official Node.js LTS (Long Term Support) base image
FROM node:lts

# Set the working directory in the Docker container
WORKDIR /usr/src/prspr-server

# Copy package.json and package-lock.json
COPY package.json ./

# Install the application dependencies
RUN npm install

# Copy the application source code
COPY . .

# Expose the application on port 3000 (or whatever port your app uses)
EXPOSE 3000

# Command to run the application
# CMD [ "node", "server" ]

# Install PM2 globally
RUN npm install pm2 -g

# Use PM2 as the process manager to start the application
CMD ["pm2-runtime", "start", "server.js"]