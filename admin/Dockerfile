# Build React admin
FROM node:20 AS build
WORKDIR /app
ARG BUILD_MODE=production
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/admin 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
