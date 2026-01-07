FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

ENV HOST=0.0.0.0
ENV PORT=5173
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

EXPOSE 5173

CMD ["npm", "run", "dev"]
