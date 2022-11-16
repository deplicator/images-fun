FROM node:16-alpine 
WORKDIR /app
COPY . .
COPY package.json ./
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "start", "--host=0.0.0.0"]