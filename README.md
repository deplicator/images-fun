# Images Fun

Quick little project to play with an API made with node.js and docker.

## Run Project

Should be able to run these commands in bash or powershell.

### With Docker

- Requirement: have docker

```
git clone https://github.com/deplicator/images-fun.git
cd images-fun/api
npm install
cd ../client
npm install
cd ../
docker compose up
```

### Without Docker

- Requirement: have node/npm
- two terminals (quick and easy cross-platform solution)

Terminal 1

```
git clone https://github.com/deplicator/images-fun.git
cd images-fun/api
npm install
npm start
```

Terminal 2

```
cd images-fun/client
npm install
npm start --prefix client/
```

## Play

Open a browser to `http://localhost:3000`. Have fun with images!

## For the Future

- better error handling, especially api
- aria-labels
- use MUI themes on Client
- search as user types into search bar
- state management (particularly something that support providing and invalidating tags)
- confirm on delete
- better responsiveness
- click and drag to arrange order, send changed order property to API
- groups of images
- swap between image cards and a list with details
- some variable names leave a lot to be desired
- two separate projects
