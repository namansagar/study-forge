FROM node:20-alpine
WORKDIR /app
ARG BACKEND_URL=http://backend:8080
ENV BACKEND_URL=$BACKEND_URL
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
