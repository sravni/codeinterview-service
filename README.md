# Codeinterview-service &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](blob/main/LICENSE.md) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](how-to-contribute.html#your-first-pull-request)

## What is Codeinterview?

Codeinterview is a project for conducting interviews for a developer position.

Out of the box:

- Codeinterview allows you to create, edit, delete an interview
- Codeinterview allows you to create a websocket room for livecoding
- Codeinterview allows you to evaluate the interview based on many parameters
- Codeinterview allows you to save your tasks for interviews. At the time of the interview, you can conveniently find the desired task and quickly use its interview

## Available Languages for livecoding

- JavaScript
- Typescript
- Go
- C#

## Getting Started

To start using codeinterview you need to launch 3 services.
This service is responsible for CRUD operations on entities.

1. Install dependencies
   `yarn`
2. Copy `./.env.example` to `./.env`
3. Paste your local database credentials in `.env`
4. Build application
   `yarn build`
5. Start application
   `yarn start`

## Docker

1. Make Docker image by `./Dockerfile`
   `docker build -t codeinterview-service .`
2. Run docker image with enviroment variables from `.env`
   `docker run --env-file ./.env codeinterview-service`

## Migrations

- **Create migration**
  `npm run migration:create --name=YOUR-NAME`.
  We use `npm` here because `yarn` still does not have args

- **Generate migration by code diff**
  `npm run migration:generate --name=YOUR-NAME`.
  We use `npm` here because `yarn` still does not have args

- **Run migraions**
  1. `yarn build` - Convert ts to js. Because migrations must work on deploy, we wotk with them on localhost like on production
  2. `yarn migration:run`
