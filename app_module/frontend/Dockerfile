FROM node:20-alpine

WORKDIR /app

# Copiamos manifiestos primero para aprovechar cache de dependencias
COPY package.json package-lock.json* ./

RUN npm install

# Copiamos el resto del código
COPY . .

ENV HOST=0.0.0.0
ENV PORT=5173
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

EXPOSE 5173

CMD ["npm", "run", "dev"]
