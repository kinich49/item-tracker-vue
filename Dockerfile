FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ARG port
EXPOSE ${port}
ENTRYPOINT ["http-server", "dist", "--port"]
CMD ${port}
