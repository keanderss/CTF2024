FROM node:22-alpine AS client
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]