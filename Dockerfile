FROM node:lts-alpine
RUN npm install -g http-server
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG port
EXPOSE ${port}
ENV env_port ${port}
RUN npm run build -- --port=${port}
ENTRYPOINT http-server dist --port ${env_port}