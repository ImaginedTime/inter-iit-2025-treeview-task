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
ARG CLI_DATABASE_URL=default
ARG CLI_JWT_SECRET=default
ARG CLI_USER_EMAIL=default
ARG CLI_USER_PASSWORD=default


ENV CLI_DATABASE_URL=$CLI_DATABASE_URL
ENV JWT_SECRET=$CLI_JWT_SECRET
ENV USER_EMAIL=$CLI_USER_EMAIL
ENV USER_PASSWORD=$CLI_USER_PASSWORD

# Step 7: Build the Next.js application
RUN npm run build

RUN echo ${CLI_DATABASE_URL}

# Step 8: Expose the port on which the app will run
EXPOSE 3000

# Step 9: Define the command to start the application
CMD ["npm", "run", "start"]
