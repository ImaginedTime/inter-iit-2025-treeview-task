# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Set environment variables (these should be set in your Docker Compose or runtime environment)


# Step 7: Build the Next.js application
RUN npm run build

# Step 8: Expose the port on which the app will run
EXPOSE 3000

# Step 9: Define the command to start the application
CMD ["npm", "start"]
