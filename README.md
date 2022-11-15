


docker build ./api -t images-api
docker build ./client -t images-client

docker run -p 3001:3001 images-api
docker run -p 3000:3000 images-client
