# Images Fun

Quick little project to play with a client, server, and docker.

## Run Project

### With Docker

- have docker

```
git clone https://github.com/deplicator/images-fun.git
cd images-fun
docker compose up
```

### Without Docker

- have node/npm
- two terminals (easiest)

```
git clone https://github.com/deplicator/images-fun.git
cd images-fun
npm install --prefix api/ && npm install --prefix client/
npm start --prefix api/
```

Terminal 2

```
npm start --prefix client/
```

## Play

Open a browser to `http://localhost:3000`. Have fun with images!

## For the Future

- two separate projects
- better error handling, especially api side
- aria-labels
- use MUI themes on Client
- search as user types into search bar
- state management (particularly something that support providing and invalidating tags)
- confirm on delete
- better responsiveness
