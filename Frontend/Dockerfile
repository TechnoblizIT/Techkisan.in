# Step 1: Build the React app
FROM node:18 as build
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL $REACT_APP_SERVER_URL
ENV NODE_ENV=production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve the app using a minimal server
FROM nginx:alpine

# Copy the built files from the previous stage to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port the app will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
