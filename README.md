# Xttreme- API

- Encryption at rest API that provides data to xttreme's- client

#### CI/CD

[![Build Status](https://travis-ci.org/Bluebird2000/xttreme-api.svg?branch=master)](https://travis-ci.org/Bluebird2000/xttreme-api)
[![Coverage Status](https://coveralls.io/repos/github/Bluebird2000/xttreme-api/badge.svg?branch=master)](https://coveralls.io/github/Bluebird2000/xttreme-api?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/911c83771273fd9f5972/maintainability)](https://codeclimate.com/github/Bluebird2000/xttreme-api/maintainability)

## Local Installation Guide (Non Docker)

Install the node packages via:

`$ npm install`
*P.S:* See package.json for project dependencies

And then run the grunt task to compile the TypeScript:

`$ npm run grunt`

Run the start command to serve the application in dev mode and visit `http://localhost:PORT`

`$ npm start or node ./bin/www`

## Starting

Install PM2 if not yet installed
`$ npm install pm2 -g`

To start the server run:

`$ pm2 start boot.json`

## Install/Run (Docker) - Ensure you have pulled the `servers` project and started up the container

`docker-compose up -d`

#### Acknowledgments
- Photizzo Technologies Limited